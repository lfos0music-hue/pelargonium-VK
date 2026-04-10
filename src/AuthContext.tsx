import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';
import bridge from '@vkontakte/vk-bridge';

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
      
      let vkId: number | undefined;
      try {
        const vkUser = await bridge.send('VKWebAppGetUserInfo');
        vkId = vkUser.id;
      } catch (e) {
        console.log('Not in VK environment or user denied info');
      }

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            
            // Re-verify role based on current moderator list
            const moderatorsDoc = await getDoc(doc(db, 'config', 'moderators'));
            const moderatorEmails = moderatorsDoc.exists() ? moderatorsDoc.data().emails || [] : [];
            const moderatorVkIds = moderatorsDoc.exists() ? moderatorsDoc.data().vkIds || [] : [];
            
            const isMainAdmin = firebaseUser.email === 'lfos0.music@gmail.com';
            const isModerator = (firebaseUser.email && moderatorEmails.includes(firebaseUser.email)) || 
                               (vkId && moderatorVkIds.includes(vkId));
            
            const newRole = (isMainAdmin || isModerator) ? 'admin' : 'user';
            
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
            // Check if user is in moderators list (by email or VK ID)
            const moderatorsDoc = await getDoc(doc(db, 'config', 'moderators'));
            const moderatorEmails = moderatorsDoc.exists() ? moderatorsDoc.data().emails || [] : [];
            const moderatorVkIds = moderatorsDoc.exists() ? moderatorsDoc.data().vkIds || [] : [];
            
            const isMainAdmin = firebaseUser.email === 'lfos0.music@gmail.com';
            const isModerator = (firebaseUser.email && moderatorEmails.includes(firebaseUser.email)) || 
                               (vkId && moderatorVkIds.includes(vkId));

            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              vkId: vkId,
              role: (isMainAdmin || isModerator) ? 'admin' : 'user'
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
    await signInWithPopup(auth, provider);
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
