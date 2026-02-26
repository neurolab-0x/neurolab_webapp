import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PlatformShell from './components/PlatformShell';
import { usePortalStore } from './store/usePortalStore';

// Auth pages (no shell)
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));

// User Portal
const UserPortal = lazy(() => import('./modules/UserPortal'));
const UserHistory = lazy(() => import('./modules/UserHistory'));
const UserDevices = lazy(() => import('./modules/UserDevices'));
const UserAppointments = lazy(() => import('./modules/UserAppointments'));
const UserChat = lazy(() => import('./modules/UserChat'));
const UserUploads = lazy(() => import('./modules/UserUploads'));
const UserReviews = lazy(() => import('./modules/UserReviews'));
const UserDecisionSupport = lazy(() => import('./modules/UserDecisionSupport'));
const AppointmentBooking = lazy(() => import('./modules/AppointmentBooking'));

// Admin Portal
const AdminPortal = lazy(() => import('./modules/AdminPortal'));
const AdminUsers = lazy(() => import('./modules/AdminUsers'));
const AdminDevices = lazy(() => import('./modules/AdminDevices'));
const AdminSessions = lazy(() => import('./modules/AdminSessions'));
const AdminClinics = lazy(() => import('./modules/AdminClinics'));
const AdminBilling = lazy(() => import('./modules/AdminBilling'));
const AdminPartnerships = lazy(() => import('./modules/AdminPartnerships'));

// Doctor Portal
const DoctorPortal = lazy(() => import('./modules/DoctorPortal'));
const DoctorPatients = lazy(() => import('./modules/DoctorPatients'));
const DoctorAppointments = lazy(() => import('./modules/DoctorAppointments'));
const DoctorDecision = lazy(() => import('./modules/DoctorDecision'));
const DoctorCertifications = lazy(() => import('./modules/DoctorCertifications'));

// Clinic Portal
const ClinicStats = lazy(() => import('./modules/ClinicStats'));

// Shared
const SettingsPage = lazy(() => import('./modules/SettingsPage'));
const Notifications = lazy(() => import('./modules/Notifications'));
const CalendarIntegration = lazy(() => import('./modules/CalendarIntegration'));

import NotFound from './pages/NotFound';

const ModuleLoader = () => (
  <div className="flex h-[400px] w-full items-center justify-center">
    <div className="relative h-px w-32 overflow-hidden bg-secondary">
      <div className="absolute inset-y-0 left-0 bg-electric-blue" style={{ width: '40%', animation: 'surgical-shimmer 1.5s ease-in-out infinite' }} />
    </div>
  </div>
);

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<ModuleLoader />}>{children}</Suspense>
);

function App() {
  const { theme } = usePortalStore();

  React.useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth — standalone, no shell */}
        <Route path="/auth/login" element={<S><LoginPage /></S>} />
        <Route path="/auth/register" element={<S><RegisterPage /></S>} />

        {/* Platform Shell (all authenticated routes) */}
        <Route path="/" element={<PlatformShell />}>
          <Route index element={<Navigate to="/doctor/analysis" replace />} />

          {/* User Routes */}
          <Route path="user/session" element={<S><UserPortal /></S>} />
          <Route path="user/history" element={<S><UserHistory /></S>} />
          <Route path="user/devices" element={<S><UserDevices /></S>} />
          <Route path="user/appointments" element={<S><UserAppointments /></S>} />
          <Route path="user/booking" element={<S><AppointmentBooking /></S>} />
          <Route path="user/chat" element={<S><UserChat /></S>} />
          <Route path="user/uploads" element={<S><UserUploads /></S>} />
          <Route path="user/reviews" element={<S><UserReviews /></S>} />
          <Route path="user/insights" element={<S><UserDecisionSupport /></S>} />

          {/* Admin Routes */}
          <Route path="admin/metrics" element={<S><AdminPortal /></S>} />
          <Route path="admin/users" element={<S><AdminUsers /></S>} />
          <Route path="admin/devices" element={<S><AdminDevices /></S>} />
          <Route path="admin/sessions" element={<S><AdminSessions /></S>} />
          <Route path="admin/clinics" element={<S><AdminClinics /></S>} />
          <Route path="admin/billing" element={<S><AdminBilling /></S>} />
          <Route path="admin/partnerships" element={<S><AdminPartnerships /></S>} />

          {/* Doctor Routes */}
          <Route path="doctor/analysis" element={<S><DoctorPortal /></S>} />
          <Route path="doctor/overview" element={<S><DoctorPatients /></S>} />
          <Route path="doctor/appointments" element={<S><DoctorAppointments /></S>} />
          <Route path="doctor/decision" element={<S><DoctorDecision /></S>} />
          <Route path="doctor/certifications" element={<S><DoctorCertifications /></S>} />

          {/* Clinic Routes */}
          <Route path="clinic/patients" element={<S><DoctorPatients /></S>} />
          <Route path="clinic/devices" element={<S><AdminDevices /></S>} />
          <Route path="clinic/stats" element={<S><ClinicStats /></S>} />

          {/* Shared Routes */}
          <Route path="settings" element={<S><SettingsPage /></S>} />
          <Route path="notifications" element={<S><Notifications /></S>} />
          <Route path="calendar-sync" element={<S><CalendarIntegration /></S>} />

          <Route path="*" element={<NotFound />} />

          <Route path="*" element={<Navigate to="/doctor/analysis" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
