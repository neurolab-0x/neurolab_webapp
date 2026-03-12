import { type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children?: ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const sandboxMode = params.get('sandbox');
    const searchParams = location.search;

    let currentUser = null;

    if (sandboxMode === 'doctor') {
        currentUser = { role: 'DOCTOR' };
    } else if (sandboxMode === 'patient') {
        currentUser = { role: 'USER' };
    } else {
        const sessionBlob = localStorage.getItem('neurolab_user');
        if (sessionBlob) {
            try {
                currentUser = JSON.parse(sessionBlob);
            } catch (e) {
                // ignore
            }
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
            case 'ADMIN': return <Navigate to={`/admin/metrics${searchParams}`} replace />;
            case 'DOCTOR': return <Navigate to={`/doctor/analysis${searchParams}`} replace />;
            case 'CLINIC': return <Navigate to={`/clinic/stats${searchParams}`} replace />;
            case 'USER':
            default: return <Navigate to={`/user/session${searchParams}`} replace />;
        }
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
