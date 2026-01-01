import { useContext } from 'react';
import { AuthContext } from '@/lib/auth/auth-context';
import { LoginCredentials, RegisterCredentials, UpdateProfileData, ChangePasswordData } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
  } = context;

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
    } catch (err) {
      throw err;
    }
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      await register(credentials);
    } catch (err) {
      throw err;
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    try {
      await updateProfile(data);
    } catch (err) {
      throw err;
    }
  };

  const handleChangePassword = async (data: ChangePasswordData) => {
    try {
      await changePassword(data);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteAccount = async (password: string) => {
    try {
      await deleteAccount(password);
    } catch (err) {
      throw err;
    }
  };

  return {
    user,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
    deleteAccount: handleDeleteAccount,
  };
}; 