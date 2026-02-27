import { type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    children?: ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const sessionBlob = localStorage.getItem('neurai_user');
    let currentUser = null;

    if (sessionBlob) {
        try {
            currentUser = JSON.parse(sessionBlob);
        } catch (e) {
            // ignore
        }
    }

    // Not authenticated at all
    if (!currentUser) {
        return <Navigate to="/auth/login" replace />;
    }

    // Role-based access control
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // Redirect to their default dashboard based on their actual role
        switch (currentUser.role) {
            case 'ADMIN': return <Navigate to="/admin/metrics" replace />;
            case 'DOCTOR': return <Navigate to="/doctor/analysis" replace />;
            case 'CLINIC': return <Navigate to="/clinic/stats" replace />;
            case 'USER':
            default: return <Navigate to="/user/session" replace />;
        }
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
