'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config';

export interface UserContextType {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null; 
  isAdmin?: boolean; 
}

interface AuthContextProps {
  user: UserContextType | null;
  loading: boolean;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userData: UserContextType = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            // Simplified admin check - replace with a proper role system
            isAdmin: firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
