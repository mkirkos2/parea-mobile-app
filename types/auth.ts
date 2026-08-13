// Authentication Types matching Laravel API contract

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  createdAt: string; // ISO 8601 format
}

export interface AuthResponse {
  data: {
    user: AuthUser;
    token: string;
  };
}

export interface MeResponse {
  data: AuthUser;
}

export interface ValidationError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}