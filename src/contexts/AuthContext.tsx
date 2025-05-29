import { createContext, useContext, useState, useEffect } from 'react';
export type UserRole = 'professional' | 'client';

interface User {
  id: string;
  email: string | null;
  role: UserRole | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isOnboardingComplete: boolean;
  userProfile: {
    role: 'professional' | 'client' | null;
    // Add other user profile fields as needed
  } | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [userProfile, setUserProfile] = useState<AuthContextType['userProfile']>(null);

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate sign in
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: 'user-1',
        email,
        role: 'client'
      });
      setUserProfile({ role: 'client' });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Simulate sign up
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: 'user-1',
        email,
        role: 'client'
      });
      setUserProfile({ role: 'client' });
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Simulate sign out
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Simulate auth loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isOnboardingComplete,
        userProfile,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
