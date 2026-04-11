import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, getRedirectResult, signInWithRedirect } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';
import bridge from '@vkontakte/vk-bridge';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth).catch((error) => {
      console.error("Error getting redirect result:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Non-blocking VK info fetch
          let vkId: number | undefined;
          try {
            const vkUser = await Promise.race([
              bridge.send('VKWebAppGetUserInfo'),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
            ]) as any;
            vkId = vkUser.id;
          } catch (e) {
            console.log('VK info fetch failed or timed out');
          }

          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          const MAIN_ADMIN_EMAIL = 'lfos0.music@gmail.com';
          
          let moderatorEmails: string[] = [];
          let moderatorVkIds: number[] = [];
          try {
            const moderatorsDoc = await getDoc(doc(db, 'config', 'moderators'));
            if (moderatorsDoc.exists()) {
              moderatorEmails = (moderatorsDoc.data().emails || []).map((e: string) => e.toLowerCase());
              moderatorVkIds = moderatorsDoc.data().vkIds || [];
            }
          } catch (e) {
            console.error("Error fetching moderators config:", e);
          }
          
          const userEmail = firebaseUser.email?.toLowerCase();
          const isMainAdmin = userEmail === MAIN_ADMIN_EMAIL.toLowerCase();
          const isModerator = (userEmail && moderatorEmails.includes(userEmail)) || 
                             (vkId && moderatorVkIds.includes(vkId));
          
          const newRole = (isMainAdmin || isModerator) ? 'admin' : 'user';
          
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            if ((vkId && data.vkId !== vkId) || data.role !== newRole) {
              const updates: any = { role: newRole };
              if (vkId) updates.vkId = vkId;
              await updateDoc(userDocRef, updates);
              data.role = newRole;
              if (vkId) data.vkId = vkId;
            }
            setProfile(data);
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              vkId: vkId,
              role: newRole
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error in profile logic:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      // Try popup first
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login error:", error);
      
      // If popup is blocked or fails in mobile environment, try redirect
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/internal-error' || error.code === 'auth/network-request-failed') {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          toast.error("Не удалось открыть окно входа. Пожалуйста, используйте меню 'Открыть в браузере' в ВК.");
        }
      } else if (error.code !== 'auth/popup-closed-by-user') {
        toast.error("Ошибка входа. Попробуйте открыть приложение через браузер.");
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
