import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '@ai-coding/shared-types';
import type { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session on load
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        const sessionUser = JSON.parse(userStr) as AuthUser;
        setUser(sessionUser);
        setIsAuthenticated(true);
      } catch {
        // Ignore parse errors and clear invalid session
        sessionStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = (user: AuthUser) => {
    setUser(user);
    setIsAuthenticated(true);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}