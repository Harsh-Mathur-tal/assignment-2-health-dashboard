import { LoginCredentials, AuthResponse, User } from '@/types';
import { apiClient } from '@/services/apiClient';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    // The interceptor extracts the data field, so response.data is now the AuthResponse
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors as we're clearing local state anyway
      console.warn('Logout API call failed:', error);
    }
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.put('/auth/profile', updates);
    return response.data;
  }
}

export const authService = new AuthService();
