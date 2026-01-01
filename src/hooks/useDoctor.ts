import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import doctorApi, { MedicalReport, CreateAppointmentData, CreateReportData } from '@/lib/api/doctor';
import { DoctorProfile, Appointment, User } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

export const useDoctor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);

  // Fetch initial data
  useEffect(() => {
    if (user?.role === 'doctor') {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [profileData, appointmentsData, patientsData, reportsData] = await Promise.all([
        doctorApi.getProfile(),
        doctorApi.getAppointments(),
        doctorApi.getPatients(),
        doctorApi.getReports(),
      ]);
      setProfile(profileData);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setReports(reportsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      toast({
        title: 'Error',
        description: 'Failed to load doctor data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Appointments
  const createAppointment = async (data: CreateAppointmentData) => {
    try {
      const newAppointment = await doctorApi.createAppointment(data);
      setAppointments((prev) => [...prev, newAppointment]);
      toast({
        title: 'Success',
        description: 'Appointment created successfully',
      });
      return newAppointment;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create appointment',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateAppointment = async (id: string, status: Appointment['status']) => {
    try {
      const updatedAppointment = await doctorApi.updateAppointment(id, status);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? updatedAppointment : apt))
      );
      toast({
        title: 'Success',
        description: 'Appointment updated successfully',
      });
      return updatedAppointment;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update appointment',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Reports
  const createReport = async (data: CreateReportData) => {
    try {
      const newReport = await doctorApi.createReport(data);
      setReports((prev) => [...prev, newReport]);
      toast({
        title: 'Success',
        description: 'Report created successfully',
      });
      return newReport;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create report',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateReport = async (id: string, data: Partial<MedicalReport>) => {
    try {
      const updatedReport = await doctorApi.updateReport(id, data);
      setReports((prev) =>
        prev.map((report) => (report.id === id ? updatedReport : report))
      );
      toast({
        title: 'Success',
        description: 'Report updated successfully',
      });
      return updatedReport;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update report',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await doctorApi.deleteReport(id);
      setReports((prev) => prev.filter((report) => report.id !== id));
      toast({
        title: 'Success',
        description: 'Report deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete report',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Profile
  const updateProfile = async (data: Partial<DoctorProfile>) => {
    try {
      const updatedProfile = await doctorApi.updateProfile(data);
      setProfile(updatedProfile);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      return updatedProfile;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    isLoading,
    error,
    profile,
    appointments,
    patients,
    reports,
    createAppointment,
    updateAppointment,
    createReport,
    updateReport,
    deleteReport,
    updateProfile,
    refreshData: fetchInitialData,
  };
}; 