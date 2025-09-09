import { create } from 'zustand';
import { User, LoginCredentials } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
  refreshAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login(credentials);
      
      // Store in localStorage manually for now
      localStorage.setItem('auth-token', response.token);
      localStorage.setItem('auth-refresh-token', response.refreshToken);
      localStorage.setItem('auth-user', JSON.stringify(response.user));
      
      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    // Call logout API
    authService.logout().catch(console.error);
    
    // Clear localStorage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-refresh-token');
    localStorage.removeItem('auth-user');
    
    // Clear state
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  setUser: (user: User) => {
    set({ user });
    localStorage.setItem('auth-user', JSON.stringify(user));
  },

  refreshAuth: async () => {
    const { refreshToken } = get();
    
    if (!refreshToken) {
      get().logout();
      return;
    }

    try {
      const response = await authService.refresh(refreshToken);
      
      localStorage.setItem('auth-token', response.token);
      localStorage.setItem('auth-refresh-token', response.refreshToken);
      
      set({
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      get().logout();
    }
  },
}));
