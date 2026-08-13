// Authentication Context and Provider
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser } from '@/types/auth';
import { AuthApiClient } from '@/services/api/auth';
import { TokenStorage } from '@/services/storage/token';

// Auth status types
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'networkError';

// Context value interface
interface AuthContextType {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  retryBootstrap: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Check if user is authenticated
  const isAuthenticated = status === 'authenticated';

  // Bootstrap session on app start
  useEffect(() => {
    bootstrapSession();
  }, []);

  const bootstrapSession = async () => {
    try {
      setStatus('loading');
      
      // Try to get saved token
      const token = await TokenStorage.getToken();
      
      if (!token) {
        setStatus('unauthenticated');
        return;
      }
      
      // Try to fetch current user
      const response = await AuthApiClient.getMe(token);
      setUser(response.data);
      setStatus('authenticated');
    } catch (error: any) {
      // Check if this is a network error (no response or status 0)
      if (error.status === 0 || !error.status) {
        // Network error - don't delete the token, just set networkError state
        setStatus('networkError');
      } else if (error.status === 401) {
        // Token is invalid/expired - clear it
        await TokenStorage.deleteToken();
        setUser(null);
        setStatus('unauthenticated');
      } else {
        // Other error - treat as unauthenticated for now
        // but don't delete token in case it's a temporary server issue
        setStatus('unauthenticated');
      }
    }
  };

  // Retry bootstrap after network error
  const retryBootstrap = async () => {
    await bootstrapSession();
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      const response = await AuthApiClient.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      // Store token securely
      await TokenStorage.setToken(response.data.token);
      
      // Set user
      setUser(response.data.user);
      setStatus('authenticated');
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthApiClient.login({
        email,
        password,
      });
      
      // Store token securely
      await TokenStorage.setToken(response.data.token);
      
      // Set user
      setUser(response.data.user);
      setStatus('authenticated');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Get current token before deleting it
      const token = await TokenStorage.getToken();
      
      if (token) {
        // Try to call logout endpoint
        try {
          await AuthApiClient.logout(token);
        } catch (error: any) {
          // If it's a network error, inform the user that server logout couldn't be confirmed
          if (error.status === 0 || !error.status) {
            console.warn('Logout API call failed due to network error - token revocation not confirmed on server');
          } else if (error.status === 401) {
            // Token already invalid on server - that's fine
            console.log('Token already invalid on server during logout');
          } else {
            // Other error - log but still proceed with local logout
            console.warn('Logout API call failed:', error);
          }
        }
      }
    } finally {
      // Clear local state regardless of API result
      await TokenStorage.deleteToken();
      setUser(null);
      setStatus('unauthenticated');
    }
  };

  const refreshCurrentUser = async () => {
    try {
      const token = await TokenStorage.getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await AuthApiClient.getMe(token);
      setUser(response.data);
    } catch (error: any) {
      // Check if this is a network error
      if (error.status === 0 || !error.status) {
        // Network error - rethrow to let caller handle
        throw new Error('Network error - please check your connection');
      } else if (error.status === 401) {
        // Token is invalid - logout
        await logout();
        throw new Error('Session expired - please log in again');
      } else {
        // Other error
        throw error;
      }
    }
  };

  const value = {
    user,
    status,
    isAuthenticated,
    register,
    login,
    logout,
    refreshCurrentUser,
    retryBootstrap,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};