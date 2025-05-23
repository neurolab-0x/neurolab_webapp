import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // TODO: Replace with actual API call to verify token and get user data
      const response = await fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const userData = await response.json();
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });

      // Redirect based on role
      switch (user.role) {
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'patient':
          navigate('/patient/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const isDoctor = () => {
    return authState.user?.role === 'doctor';
  };

  const isPatient = () => {
    return authState.user?.role === 'patient';
  };

  const isAdmin = () => {
    return authState.user?.role === 'admin';
  };

  return {
    ...authState,
    login,
    logout,
    isDoctor,
    isPatient,
    isAdmin,
  };
}; 