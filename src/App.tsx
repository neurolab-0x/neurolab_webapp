import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Private from "./pages/Private";
import NotFound from "./pages/NotFound";
import LiveAnalysis from "./components/LiveAnalysis";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import { DoctorRoute } from './features/doctor/components/DoctorRoute';
import { DoctorLayout } from './features/doctor/components/DoctorLayout';
import { DoctorDashboard } from './features/doctor/components/DoctorDashboard';
import { Appointments } from './features/doctor/components/Appointments';
import { Patients } from './features/doctor/components/Patients';
import { Reports } from './features/doctor/components/Reports';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
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
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
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
            {/* Doctor routes with layout and protection */}
            <Route
              path="/doctor"
              element={
                <DoctorRoute>
                  <DoctorLayout>
                    <DoctorDashboard />
                  </DoctorLayout>
                </DoctorRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <DoctorRoute>
                  <DoctorLayout>
                    <Appointments />
                  </DoctorLayout>
                </DoctorRoute>
              }
            />
            <Route
              path="/doctor/patients"
              element={
                <DoctorRoute>
                  <DoctorLayout>
                    <Patients />
                  </DoctorLayout>
                </DoctorRoute>
              }
            />
            <Route
              path="/doctor/reports"
              element={
                <DoctorRoute>
                  <DoctorLayout>
                    <Reports />
                  </DoctorLayout>
                </DoctorRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
