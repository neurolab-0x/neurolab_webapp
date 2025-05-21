import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, LoginCredentials, RegisterCredentials, User } from '@/types/auth';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Set up axios defaults
axios.defaults.baseURL = API_URL;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
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

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response = await axios.post('/auth/login', credentials);
      const { token, userWithoutPassword } = response.data;

      if (!token || !userWithoutPassword) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      setToken(token);
      setUser(userWithoutPassword);
      return userWithoutPassword;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setError(null);
      const response = await axios.post('/auth/register', credentials);
      const { message, userWithoutPassword } = response.data;

      if (!message || !userWithoutPassword) {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
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