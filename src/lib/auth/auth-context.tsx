import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, LoginCredentials, RegisterCredentials, User, UpdateProfileData, ChangePasswordData } from '@/types/auth';
import axios from 'axios';

const API_URL = 'http://localhost:5001/';

// Set up axios defaults
axios.defaults.baseURL = API_URL;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for token refresh
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (!storedRefreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post('/api/auth/refresh', {
              refreshToken: storedRefreshToken
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            setToken(accessToken);
            setRefreshToken(newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/login', credentials);
      const { message, accessToken, refreshToken, user } = response.data;

      if (!message || !accessToken || !refreshToken || !user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
      return user;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/signup', credentials);
      const { message, accessToken, refreshToken, user } = response.data;

      if (!message || !user || !accessToken || !refreshToken) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
      return user;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setError(null);
      const response = await axios.patch('/api/users/me', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { message, user: updatedUser } = response.data;
      if (!message || !updatedUser) {
        throw new Error('Invalid response from server');
      }

      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    try {
      setError(null);
      const response = await axios.post('/api/users/me/password', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { message } = response.data;
      if (!message) {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password change failed');
      throw err;
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      setError(null);
      const response = await axios.delete('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
        data: { password }
      });

      const { message } = response.data;
      if (!message) {
        throw new Error('Invalid response from server');
      }

      // Logout after successful account deletion
      await logout();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Account deletion failed');
      throw err;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 