import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are provided, ensure the user's role (case-insensitive) is allowed
  if (roles && roles.length > 0) {
    const userRole = (user.role || '').toString().toLowerCase();
    const allowed = roles.map((r) => r.toString().toLowerCase());
    if (!allowed.includes(userRole)) {
      // Redirect to dashboard or unauthorized page
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
} 