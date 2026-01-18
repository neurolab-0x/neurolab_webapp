import axios from '@/lib/axios/config';

export interface Session {
  id: string;
  deviceId: string;
  userId: string;
  type: 'EEG' | 'ECG' | 'EMG' | 'COMBINED';
  status: 'active' | 'completed' | 'terminated';
  startTime: string;
  endTime: string | null;
  parameters: {
    samplingRate: number;
    duration: number;
    channels: string[];
  };
  results: any | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionResults {
  frequencyBands: {
    delta: [number, number];
    theta: [number, number];
    alpha: [number, number];
    beta: [number, number];
    gamma: [number, number];
  };
  powerSpectrum: {
    frequencies: number[];
    powers: number[];
  };
}

/**
 * Get all sessions for the current user
 */
export async function getUserSessions(): Promise<Session[]> {
  try {
    const response = await axios.get('/sessions');
    return response.data || [];
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to fetch sessions');
  }
}

/**
 * Get active sessions for the current user
 */
export async function getActiveSessions(): Promise<Session[]> {
  try {
    const response = await axios.get('/sessions/active');
    return response.data || [];
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to fetch active sessions');
  }
}

/**
 * Get session by ID
 */
export async function getSessionById(sessionId: string): Promise<Session> {
  try {
    const response = await axios.get(`/sessions/${sessionId}`);
    return response.data?.session || response.data;
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to fetch session');
  }
}

/**
 * Get session results
 */
export async function getSessionResults(sessionId: string): Promise<SessionResults> {
  try {
    const response = await axios.get(`/sessions/${sessionId}/results`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to fetch session results');
  }
}

/**
 * End a session
 */
export async function endSession(sessionId: string): Promise<Session> {
  try {
    const response = await axios.post(`/sessions/${sessionId}/end`);
    return response.data?.session || response.data;
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to end session');
  }
}

/**
 * Get user history/all sessions
 */
export async function getUserHistory(): Promise<Session[]> {
  try {
    const response = await axios.get('/users/history');
    return response.data || [];
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to fetch user history');
  }
}
