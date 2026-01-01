import { useAuth as useFeatureAuth } from '@/features/auth/hooks/useAuth';

// This file kept for backwards compatibility but delegates to the AuthContext-backed hook
export const useAuth = () => {
  return useFeatureAuth();
}; 