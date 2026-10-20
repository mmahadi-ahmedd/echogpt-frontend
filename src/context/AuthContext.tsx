'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginPayload, RegisterPayload } from '@/types/auth';
import { authApi } from '@/lib/api/auth';
import { tokenStorage } from '@/lib/storage';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function restoreSession() {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await authApi.getProfile();
        setUser(profile);
      } catch {
        tokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { accessToken, refreshToken, user: loggedInUser } = await authApi.login(payload);
      tokenStorage.setTokens(accessToken, refreshToken);
      setUser(loggedInUser);
      router.push('/chat');
    },
    [router],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const { accessToken, refreshToken, user: newUser } = await authApi.register(payload);
      tokenStorage.setTokens(accessToken, refreshToken);
      setUser(newUser);
      router.push('/chat');
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      tokenStorage.clearTokens();
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}