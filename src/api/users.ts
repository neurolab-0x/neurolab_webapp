import axios from '@/lib/axios/config';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  role: string;
  avatar?: string;
  isEmailVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  username?: string;
  avatar?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// Get user profile
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await axios.get<{ success: boolean; user: UserProfile }>('/user/me');
    return response.data.user;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch user profile');
  }
}

// Update user profile
export async function updateUserProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  try {
    const response = await axios.put<{ success: boolean; user: UserProfile }>('/user/me', payload);
    return response.data.user;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to update user profile');
  }
}

// Change password
export async function changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean }> {
  try {
    const response = await axios.put<{ success: boolean }>('/user/change-password', payload);
    return response.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to change password');
  }
}

// Delete account
export async function deleteAccount(): Promise<{ success: boolean }> {
  try {
    const response = await axios.delete<{ success: boolean }>('/user/me');
    return response.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to delete account');
  }
}
