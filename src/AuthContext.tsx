import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          let vkId: number | undefined;
          try {
            const vkUser = await bridge.send('VKWebAppGetUserInfo');
            vkId = vkUser.id;
          } catch (e) {
            console.log('Not in VK environment or user denied info');
          }

          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          // Hardcoded main admin email
          const MAIN_ADMIN_EMAIL = 'lfos0.music@gmail.com';
          
          // Fetch moderators list safely
          let moderatorEmails: string[] = [];
          let moderatorVkIds: number[] = [];
          try {
            const moderatorsDoc = await getDoc(doc(db, 'config', 'moderators'));
            if (moderatorsDoc.exists()) {
              moderatorEmails = moderatorsDoc.data().emails || [];
              moderatorVkIds = moderatorsDoc.data().vkIds || [];
            }
          } catch (e) {
            console.error("Error fetching moderators config:", e);
          }
          
          const isMainAdmin = firebaseUser.email?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase();
          const isModerator = (firebaseUser.email && moderatorEmails.includes(firebaseUser.email.toLowerCase())) || 
                             (vkId && moderatorVkIds.includes(vkId));
          
          const newRole = (isMainAdmin || isModerator) ? 'admin' : 'user';
          
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            
            // Update profile if vkId or role changed
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
          console.error("Error fetching/creating user profile:", error);
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
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/popup-blocked') {
        toast.error("Всплывающее окно заблокировано. Пожалуйста, разрешите всплывающие окна или откройте приложение в браузере.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, no need for error toast
      } else {
        toast.error("Ошибка входа. Если вы в приложении ВК, попробуйте нажать 'Открыть в браузере' в меню (три точки).");
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
