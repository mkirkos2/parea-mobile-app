// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Check if API base URL is configured
if (!API_BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL is not configured. Please set it in your .env file.');
}

// Normalize the base URL to ensure it doesn't end with a slash
const normalizedBaseUrl = API_BASE_URL.endsWith('/') 
  ? API_BASE_URL.slice(0, -1) 
  : API_BASE_URL;

export const API_CONFIG = {
  BASE_URL: normalizedBaseUrl,
  ENDPOINTS: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/me',
    HEALTH: '/api/v1/health',
  },
};

// Helper function to build full URLs
export const buildUrl = (endpoint: string): string => {
  // Ensure endpoint starts with a slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${normalizedEndpoint}`;
};