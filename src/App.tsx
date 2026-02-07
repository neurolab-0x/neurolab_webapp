import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth/auth-context";
import { I18nProvider } from "@/lib/i18n";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/admin/Users";
import AdminRoleRequestsPage from "./pages/admin/RoleRequests";
import AdminStatsPage from "./pages/admin/Stats";
import AdminClinicsPage from "./pages/admin/Clinics";
import AdminBillingPage from "./pages/admin/Billing";
import AdminDevicesPage from "./pages/admin/Devices";
import AdminAppointmentsPage from "./pages/admin/AppointmentsAdmin";
import AdminLogsPage from "./pages/admin/Logs";
import AdminImpersonatePage from "./pages/admin/Impersonate";
import Analysis from "./pages/Analysis";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Private from "./pages/Private";
import NotFound from "./pages/NotFound";
import LiveAnalysis from "./components/LiveAnalysis";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Notifications from "./pages/Notifications";
import Schedule from "./pages/Schedule";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor"
                element={
                  <ProtectedRoute roles={["doctor"]}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/requests"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminRoleRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/stats"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminStatsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/clinics"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminClinicsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/billing"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminBillingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/devices"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminDevicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminAppointmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/logs"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminLogsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/impersonate"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminImpersonatePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <Schedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis"
                element={
                  <ProtectedRoute>
                    <Analysis />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/private"
                element={
                  <ProtectedRoute>
                    <Private />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/live-analysis"
                element={
                  <ProtectedRoute>
                    <LiveAnalysis />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
