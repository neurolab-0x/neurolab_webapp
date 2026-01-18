import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AuthContextType, LoginCredentials, RegisterCredentials, User, UpdateProfileData, ChangePasswordData } from '@/types/auth';
import axios, { API_URL } from '@/lib/axios/config';

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
          !originalRequest.url?.includes('/auth/refresh')
        ) {
          originalRequest._retry = true;

          try {
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (!storedRefreshToken) {
              // Clear auth state if no refresh token is available
              await logout();
              throw new Error('No refresh token available');
            }

            // Create a plain axios instance (no interceptors) using configured base URL
            const plain = axios.create({ baseURL: API_URL });
            const refreshResponse = await plain.post('/auth/refresh', { refreshToken: storedRefreshToken });

            const accessToken = refreshResponse.data?.accessToken || refreshResponse.data?.token;
            const newRefreshToken = refreshResponse.data?.refreshToken || refreshResponse.data?.refresh_token || storedRefreshToken;

            if (!accessToken) {
              throw new Error('Invalid refresh token response');
            }

            // Update tokens in storage and state
            localStorage.setItem('token', accessToken);
            if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
            setToken(accessToken);
            setRefreshToken(newRefreshToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear auth state and redirect to login
            await logout();
            // Let the application handle navigation; avoid forced full-page redirect
            return Promise.reject(refreshError);
          }
        }

        // If it's a 401 error on the refresh endpoint, clear auth state
        if (error.response?.status === 401 && originalRequest.url?.includes('/auth/refresh')) {
          await logout();
          // Avoid forcing a redirect here; let the app handle navigation
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
          // Try to fetch user data with stored token using a plain axios instance
          const plain = axios.create({ baseURL: API_URL });
          const response = await plain.get('/users/me', { headers: { Authorization: `Bearer ${storedToken}` } });

          if (response.data?.success && response.data?.user) {
            setUser(response.data.user);
          } else {
            throw new Error('Invalid user data response');
          }
        } catch (userError) {
          // If user fetch fails, try to refresh the token
          try {
            const plain = axios.create({ baseURL: API_URL });
            const refreshResponse = await plain.post('/auth/refresh', { refreshToken: storedRefreshToken });

            const accessToken = refreshResponse.data?.accessToken || refreshResponse.data?.token;
            const newRefreshToken = refreshResponse.data?.refreshToken || refreshResponse.data?.refresh_token || storedRefreshToken;

            if (!accessToken) {
              throw new Error('Invalid refresh response');
            }

            // Update tokens
            localStorage.setItem('token', accessToken);
            if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
            setToken(accessToken);
            setRefreshToken(newRefreshToken);

            // Try to fetch user data again with new token
            const newPlain = axios.create({ baseURL: API_URL });
            const newResponse = await newPlain.get('/users/me', { headers: { Authorization: `Bearer ${accessToken}` } });

            if (newResponse.data?.success && newResponse.data?.user) {
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
        // Log the error and clear all auth state if anything fails
        console.warn('[AuthProvider] initializeAuth failed:', (error as any)?.message || error);
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
      const response = await axios.post('auth/login', credentials);
      const tokenFromServer = response.data?.accessToken || response.data?.token;
      const refreshFromServer = response.data?.refreshToken || response.data?.refresh_token || null;
      const userFromServer = response.data?.user || response.data?.user;

      if (!tokenFromServer || !userFromServer) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', tokenFromServer);
      if (refreshFromServer) localStorage.setItem('refreshToken', refreshFromServer);
      setToken(tokenFromServer);
      setRefreshToken(refreshFromServer);
      setUser(userFromServer);
      console.debug('[AuthProvider] login successful, token length:', tokenFromServer?.length);
      return userFromServer;
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
      const response = await axios.post('auth/register', credentials);
      const tokenFromServer = response.data?.accessToken || response.data?.token;
      const refreshFromServer = response.data?.refreshToken || response.data?.refresh_token || null;
      const userFromServer = response.data?.user || response.data?.user;

      if (!userFromServer || !tokenFromServer) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', tokenFromServer);
      if (refreshFromServer) localStorage.setItem('refreshToken', refreshFromServer);
      setToken(tokenFromServer);
      setRefreshToken(refreshFromServer);
      setUser(userFromServer);
      return userFromServer;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('auth/logout', {}, {
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
      // Don't use window.location.href - let the calling component handle navigation
    }
  };

  // Listen for external logout events (dispatched by axios refresh failures)
  const { toast } = useToast();

  useEffect(() => {
    const handleExternalLogout = async (e: Event) => {
      const detail = (e as CustomEvent)?.detail || {};
      const reason = detail?.reason || 'unknown';
      const url = detail?.url || null;
      const status = detail?.status ?? null;
      const requestId = detail?.requestId ?? null;
      const responseBody = detail?.responseBody ?? null;

      console.warn('[AuthProvider] External logout event received:', { reason, url, status, requestId });
      if (responseBody) {
        console.debug('[AuthProvider] Response body snippet (truncated):', responseBody);
      }

      // Before logging out, attempt one silent refresh (wait 1s) in case this was a transient issue
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (storedRefreshToken) {
          console.info('[AuthProvider] Attempting silent refresh before logging out (1s delay)');
          await new Promise((resolve) => setTimeout(resolve, 1000));
          try {
            const plain = axios.create({ baseURL: API_URL });
            const refreshResponse = await plain.post('/auth/refresh', { refreshToken: storedRefreshToken });
            const accessToken = refreshResponse.data?.accessToken || refreshResponse.data?.token;
            const newRefreshToken = refreshResponse.data?.refreshToken || refreshResponse.data?.refresh_token || storedRefreshToken;
            if (accessToken) {
              localStorage.setItem('token', accessToken);
              if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
              setToken(accessToken);
              setRefreshToken(newRefreshToken);
              console.info('[AuthProvider] Silent refresh succeeded; restoring session');
              // Optionally fetch user data again to restore `user` state
              try {
                const mePlain = axios.create({ baseURL: API_URL });
                const me = await mePlain.get('/users/me', { headers: { Authorization: `Bearer ${accessToken}` } });
                if (me.data?.success && me.data?.user) {
                  setUser(me.data.user);
                }
              } catch (meErr) {
                console.warn('[AuthProvider] Failed to fetch user after silent refresh', meErr);
              }

              // Silent recovery — bail out without logging out
              return;
            }
          } catch (silentErr) {
            console.warn('[AuthProvider] Silent refresh attempt failed', silentErr?.response?.status || silentErr?.message || silentErr);
          }
        }
      } catch (err) {
        console.error('[AuthProvider] Error during silent refresh attempt', err);
      }

      // Show the user a clear message (do this before clearing state)
      try {
        const description = requestId
          ? `Your session expired. Request ID: ${requestId}`
          : (reason === 'refresh_failed' ? 'We could not refresh your session. Please sign in again.' : `Authentication error: ${reason}`);

        toast({
          title: 'Session expired',
          description,
          variant: 'destructive',
        });
      } catch (toastError) {
        console.warn('[AuthProvider] Failed to show toast on external logout', toastError);
      }

      // Also expose a more detailed console message for backend correlation
      console.info('[AuthProvider] Logout details for backend correlation:', { reason, url, status, requestId });

      // Proceed with logout cleanup
      await logout();
    };

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('auth:logout', handleExternalLogout as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('auth:logout', handleExternalLogout as EventListener);
      }
    };
  }, [toast]);

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setError(null);
      
      // Check if avatar is a File object (file upload)
      const hasFile = data.avatar instanceof File;
      
      let requestData: any;
      let headers: any = { Authorization: `Bearer ${token}` };
      
      if (hasFile) {
        // Use FormData for file uploads
        const formData = new FormData();
        if (data.fullName) formData.append('fullName', data.fullName);
        if (data.username) formData.append('username', data.username);
        if (data.email) formData.append('email', data.email);
        if (data.avatar) formData.append('avatar', data.avatar);
        
        requestData = formData;
        // Don't set content-type header, let axios set it automatically with boundary
      } else {
        // Use JSON for metadata-only updates
        requestData = data;
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await axios.patch('users/me', requestData, { headers });

      const { success, user: updatedUser } = response.data;
      if (!success || !updatedUser) {
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
      const response = await axios.post('users/me/password', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { success } = response.data;
      if (!success) {
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
      const response = await axios.delete('users/me', {
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