// API Client for Parea Authentication
import { buildUrl } from '@/config/api';
import { AuthResponse, LoginData, MeResponse, RegisterData, ValidationError } from '@/types/auth';

// Custom error types
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public validationErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Type guards
const isValidationError = (error: any): error is ValidationError => {
  return error && typeof error === 'object' && 'errors' in error;
};

// API client class
export class AuthApiClient {
  private static async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return undefined as unknown as T;
    }
    
    // Handle non-JSON responses
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new ApiError(`Unexpected response format: ${text}`, response.status);
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      let validationErrors: Record<string, string[]> | undefined;
      
      if (isValidationError(data)) {
        errorMessage = data.message;
        validationErrors = data.errors;
      } else if (data && typeof data === 'object' && 'message' in data) {
        errorMessage = data.message as string;
      }
      
      throw new ApiError(errorMessage, response.status, validationErrors);
    }
    
    return data;
  }

  private static async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError('Network error - please check your connection', 0);
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    const url = buildUrl('/api/v1/auth/register');
    return await this.request<AuthResponse>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    const url = buildUrl('/api/v1/auth/login');
    return await this.request<AuthResponse>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async logout(token: string): Promise<void> {
    const url = buildUrl('/api/v1/auth/logout');
    return await this.request<void>(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  static async getMe(token: string): Promise<MeResponse> {
    const url = buildUrl('/api/v1/me');
    return await this.request<MeResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  static async healthCheck(): Promise<any> {
    const url = buildUrl('/api/v1/health');
    return await this.request(url, {
      method: 'GET',
    });
  }
}