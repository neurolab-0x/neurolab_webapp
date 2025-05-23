import axios from 'axios';
import { DoctorProfile, Appointment, User } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL;

export interface MedicalReport {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine';
  diagnosis: string;
  prescription?: string;
  notes: string;
  status: 'draft' | 'final' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  patientId: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
}

export interface CreateReportData {
  patientId: string;
  date: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine';
  diagnosis: string;
  prescription?: string;
  notes: string;
}

export interface UpdateAvailabilityData {
  days: string[];
  startTime: string;
  endTime: string;
}

const doctorApi = {
  // Profile
  getProfile: async (): Promise<DoctorProfile> => {
    const response = await axios.get(`${API_URL}/doctors/profile`);
    return response.data;
  },

  updateProfile: async (data: Partial<DoctorProfile>): Promise<DoctorProfile> => {
    const response = await axios.put(`${API_URL}/doctors/profile`, data);
    return response.data;
  },

  updateAvailability: async (data: UpdateAvailabilityData): Promise<DoctorProfile> => {
    const response = await axios.put(`${API_URL}/doctors/availability`, data);
    return response.data;
  },

  // Appointments
  getAppointments: async (): Promise<Appointment[]> => {
    const response = await axios.get(`${API_URL}/doctors/appointments`);
    return response.data;
  },

  createAppointment: async (data: CreateAppointmentData): Promise<Appointment> => {
    const response = await axios.post(`${API_URL}/doctors/appointments`, data);
    return response.data;
  },

  updateAppointment: async (id: string, status: Appointment['status']): Promise<Appointment> => {
    const response = await axios.patch(`${API_URL}/doctors/appointments/${id}`, { status });
    return response.data;
  },

  // Patients
  getPatients: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/doctors/patients`);
    return response.data;
  },

  getPatientDetails: async (patientId: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/doctors/patients/${patientId}`);
    return response.data;
  },

  // Reports
  getReports: async (): Promise<MedicalReport[]> => {
    const response = await axios.get(`${API_URL}/doctors/reports`);
    return response.data;
  },

  createReport: async (data: CreateReportData): Promise<MedicalReport> => {
    const response = await axios.post(`${API_URL}/doctors/reports`, data);
    return response.data;
  },

  updateReport: async (id: string, data: Partial<MedicalReport>): Promise<MedicalReport> => {
    const response = await axios.put(`${API_URL}/doctors/reports/${id}`, data);
    return response.data;
  },

  deleteReport: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/doctors/reports/${id}`);
  },
};

export default doctorApi; 