import { useState, useCallback } from 'react';
import { doctorService } from '@/lib/api/doctor';
import { Appointment, Patient, MedicalReport } from '../../../types';

export const useDoctor = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorService.getAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAppointment = useCallback(async (id: string, data: Partial<Appointment>) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await doctorService.updateAppointment(id, data);
      setAppointments(prev => prev.map(apt => apt.id === id ? updated : apt));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Patients
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorService.getPatients();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePatient = useCallback(async (id: string, data: Partial<Patient>) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await doctorService.updatePatient(id, data);
      setPatients(prev => prev.map(patient => patient.id === id ? updated : patient));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update patient');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reports
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorService.getReports();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = useCallback(async (data: Omit<MedicalReport, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newReport = await doctorService.createReport(data);
      setReports(prev => [...prev, newReport]);
      return newReport;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReport = useCallback(async (id: string, data: Partial<MedicalReport>) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await doctorService.updateReport(id, data);
      setReports(prev => prev.map(report => report.id === id ? updated : report));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReport = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await doctorService.deleteReport(id);
      setReports(prev => prev.filter(report => report.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    appointments,
    patients,
    reports,
    loading,
    error,

    // Appointment actions
    fetchAppointments,
    updateAppointment,

    // Patient actions
    fetchPatients,
    updatePatient,

    // Report actions
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
  };
}; 