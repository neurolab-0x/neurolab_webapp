import axios from '@/lib/axios/config';

export interface AppointmentResponse {
  id: string;
  user: string;
  doctor: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';
}

export interface DoctorAvailableSlot {
  time: string;
  date: string;
}

/**
 * Get available time slots for a specific doctor
 */
export async function getAvailableSlots(doctorId: string): Promise<DoctorAvailableSlot[]> {
  try {
    const response = await axios.get(`/appointments/available-slots/${doctorId}`);
    return response.data || [];
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to fetch available slots');
  }
}

/**
 * Request a new appointment
 */
export async function requestAppointment(
  doctorId: string,
  payload: {
    startTime: string;
    endTime: string;
    message?: string;
  }
): Promise<AppointmentResponse> {
  try {
    const response = await axios.post(`/appointments/${doctorId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to request appointment');
  }
}

/**
 * Accept an appointment
 */
export async function acceptAppointment(appointmentId: string): Promise<AppointmentResponse> {
  try {
    const response = await axios.post(`/appointments/accept/${appointmentId}`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to accept appointment');
  }
}

/**
 * Decline an appointment
 */
export async function declineAppointment(appointmentId: string): Promise<AppointmentResponse> {
  try {
    const response = await axios.post(`/appointments/decline/${appointmentId}`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to decline appointment');
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(appointmentId: string): Promise<AppointmentResponse> {
  try {
    const response = await axios.post(`/appointments/cancel/${appointmentId}`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to cancel appointment');
  }
}

/**
 * Complete an appointment
 */
export async function completeAppointment(appointmentId: string): Promise<AppointmentResponse> {
  try {
    const response = await axios.post(`/appointments/complete/${appointmentId}`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to complete appointment');
  }
}

/**
 * Update an appointment
 */
export async function updateAppointment(
  appointmentId: string,
  payload: {
    startTime?: string;
    endTime?: string;
    message?: string;
  }
): Promise<AppointmentResponse> {
  try {
    const response = await axios.patch(`/appointments/${appointmentId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to update appointment');
  }
}
