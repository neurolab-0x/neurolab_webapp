import { create } from 'zustand';

/**
 * Backend appointment response mapped to frontend format
 */
export interface Appointment {
  id: string;
  doctorName: string;
  startTime: Date;
  endTime: Date;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';
  doctorId: string;
  userId: string;
  email?: string;
  phone?: string;
  notes?: string;
}

interface AppointmentStore {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,
  
  setAppointments: (appointments) => set({ appointments, error: null }),
  
  addAppointment: (appointment) => set((state) => ({
    appointments: [...state.appointments, appointment],
  })),
  
  updateAppointment: (id, updates) => set((state) => ({
    appointments: state.appointments.map((apt) =>
      apt.id === id ? { ...apt, ...updates } : apt
    ),
  })),
  
  deleteAppointment: (id) => set((state) => ({
    appointments: state.appointments.filter((apt) => apt.id !== id),
  })),
  
  getAppointment: (id) => get().appointments.find((apt) => apt.id === id),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}));