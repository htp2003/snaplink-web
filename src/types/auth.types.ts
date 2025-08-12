// types/auth.types.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "moderator"; // Lowercase để consistency
  token?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// JWT Token Claims Constants
export const JWT_CLAIMS = {
  ROLE: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  NAME: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  NAMEIDENTIFIER:
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  EMAIL: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
} as const;
