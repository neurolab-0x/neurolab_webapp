import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, LoginCredentials, RegisterCredentials, User, UpdateProfileData, ChangePasswordData } from '@/types/auth';
import axios from 'axios';

const API_URL =import.meta.env.Backend_URL || 'http://13.60.64.187:5000/'; // Default to localhost if not set

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

        // Only attempt refresh if:
        // 1. It's a 401 error
        // 2. We haven't tried to refresh for this request yet
        // 3. The request isn't to the refresh endpoint itself
        if (
          error.response?.status === 401 && 
          !originalRequest._retry &&
          !originalRequest.url?.includes('/api/auth/refresh')
        ) {
          originalRequest._retry = true;

          try {
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (!storedRefreshToken) {
              // Clear auth state if no refresh token is available
              await logout();
              throw new Error('No refresh token available');
            }

            // Create a new axios instance for refresh token request to avoid interceptors
            const refreshResponse = await axios.create().post(
              `${API_URL}/api/auth/refresh`,
              { refreshToken: storedRefreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
            
            if (!accessToken || !newRefreshToken) {
              throw new Error('Invalid refresh token response');
            }

            // Update tokens in storage and state
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            setToken(accessToken);
            setRefreshToken(newRefreshToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear auth state and redirect to login
            await logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // If it's a 401 error on the refresh endpoint, clear auth state
        if (error.response?.status === 401 && originalRequest.url?.includes('/api/auth/refresh')) {
          await logout();
          window.location.href = '/login';
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
      try {
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        if (!storedToken || !storedRefreshToken) {
          throw new Error('No stored tokens');
        }

        // Set initial tokens
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);

        try {
          // Try to fetch user data with stored token
          const response = await axios.create().get(
            `${API_URL}/api/users/me`,
            {
              headers: { Authorization: `Bearer ${storedToken}` }
            }
          );
          
          if (response.data.user) {
            setUser(response.data.user);
          } else {
            throw new Error('Invalid user data response');
          }
        } catch (userError) {
          // If user fetch fails, try to refresh the token
          try {
            const refreshResponse = await axios.create().post(
              `${API_URL}/api/auth/refresh`,
              { refreshToken: storedRefreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
            
            if (!accessToken || !newRefreshToken) {
              throw new Error('Invalid refresh response');
            }

            // Update tokens
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            setToken(accessToken);
            setRefreshToken(newRefreshToken);

            // Try to fetch user data again with new token
            const newResponse = await axios.create().get(
              `${API_URL}/api/users/me`,
              {
                headers: { Authorization: `Bearer ${accessToken}` }
              }
            );

            if (newResponse.data.user) {
              setUser(newResponse.data.user);
            } else {
              throw new Error('Invalid user data response after refresh');
            }
          } catch (refreshError) {
            // If refresh fails, clear everything
            throw new Error('Token refresh failed');
          }
        }
      } catch (error) {
        // Clear all auth state if anything fails
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setToken(null);
        setRefreshToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
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
      // Handle rate limiting explicitly
      if (err?.response?.status === 429) {
        const retryAfter = err.response.headers?.['retry-after'];
        const msg = `Too many requests. Please wait${retryAfter ? ` ${retryAfter} seconds` : ''} and try again.`;
        setError(msg);
        const e = new Error(msg);
        // Attach original axios error for debugging
        (e as any).original = err;
        throw e;
      }

      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/register', credentials);
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