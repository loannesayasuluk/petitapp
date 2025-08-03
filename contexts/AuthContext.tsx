import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { listenToAuthState, createUserProfile, getUserProfile, UserProfile } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = listenToAuthState(async (user) => {
        try {
          setCurrentUser(user);
          
          if (user) {
            // Create user profile if it doesn't exist
            try {
              await createUserProfile(user);
              
              // Get user profile data
              const profile = await getUserProfile(user.uid);
              setUserProfile(profile);
            } catch (error) {
              console.error('Error creating/getting user profile:', error);
              // Set basic profile info even if Firebase fails
              setUserProfile({
                uid: user.uid,
                displayName: user.displayName || user.email?.split('@')[0] || '익명',
                nickname: user.displayName || user.email?.split('@')[0] || '익명',
                email: user.email || '',
                photoURL: user.photoURL,
                createdAt: new Date(),
                updatedAt: new Date(),
                postsCount: 0,
                followersCount: 0,
                followingCount: 0,
                isAdmin: false
              });
            }
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Auth state change error:', error);
          setLoading(false);
        }
      });

      return () => {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth state:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
      return () => {};
    }
  }, []);

  const login = async (user: User) => {
    try {
      setCurrentUser(user);
      await createUserProfile(user);
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Login error:', error);
      // Set basic profile info even if Firebase fails
      setUserProfile({
        uid: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || '익명',
        nickname: user.displayName || user.email?.split('@')[0] || '익명',
        email: user.email || '',
        photoURL: user.photoURL,
        createdAt: new Date(),
        updatedAt: new Date(),
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        isAdmin: false
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserProfile(null);
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    logout,
    isAdmin: userProfile?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};