import { apiClient } from './client';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types/auth';

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  },

  async resendVerification(): Promise<void> {
    await apiClient.post('/auth/resend-verification');
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/users/me');
    return data;
  },
};