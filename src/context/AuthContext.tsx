'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  auth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider, 
  signOut,
  isFirebaseConfigured 
} from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: (customEmail?: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_STORAGE_KEY = 'apirun_demo_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    // If real Firebase Auth is available, listen to auth state
    if (configured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    }

    // Fallback: Check local storage for persistent demo session
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(DEMO_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Could not read demo auth session', err);
      }
      setLoading(false);
    }
  }, [configured]);

  const signInWithEmail = async (email: string, pass: string) => {
    if (configured && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
      return;
    }
    // Demo mode login
    demoLogin(email);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (configured && auth) {
      await createUserWithEmailAndPassword(auth, email, pass);
      return;
    }
    // Demo mode signup
    demoLogin(email);
  };

  const signInWithGoogle = async () => {
    if (configured && auth) {
      await signInWithPopup(auth, googleProvider);
      return;
    }
    // Demo mode Google login
    demoLogin('developer@apirun.dev');
  };

  const logout = async () => {
    if (configured && auth) {
      await signOut(auth);
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    }
  };

  const demoLogin = (customEmail = 'developer@apirun.dev') => {
    const mockUser: any = {
      uid: 'demo_usr_' + Math.random().toString(36).substring(2, 9),
      email: customEmail,
      displayName: customEmail.split('@')[0],
      photoURL: null,
      emailVerified: true,
      isAnonymous: false,
    };
    setUser(mockUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(mockUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: configured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
