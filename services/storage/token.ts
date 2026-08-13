// Secure Token Storage Adapter
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Constants
const TOKEN_KEY = 'parea.auth.token';

// Web fallback storage (for development only)
const webStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

// Token storage adapter
export const TokenStorage = {
  /**
   * Get the stored token
   * @returns The stored token or null if not found
   */
  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return webStorage.getItem(TOKEN_KEY);
      } else {
        return await SecureStore.getItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error reading token from storage:', error);
      return null;
    }
  },

  /**
   * Store a token securely
   * @param token The token to store
   */
  async setToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        webStorage.setItem(TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error storing token:', error);
      throw new Error('Failed to store authentication token');
    }
  },

  /**
   * Delete the stored token
   */
  async deleteToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        webStorage.removeItem(TOKEN_KEY);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error deleting token from storage:', error);
      // Don't throw error here as we want to proceed with logout even if token deletion fails
    }
  },
};