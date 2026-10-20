export type RoleName = 'ADMIN' | 'USER';
export type PlanType = 'FREE' | 'PREMIUM';

export interface User {
  id: string;
  email: string;
  role: RoleName;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}