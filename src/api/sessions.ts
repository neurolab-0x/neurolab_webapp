import axios from '@/lib/axios/config';

export interface Session {
  id: string;
  deviceId: string;
  type: string;
  status: 'active' | 'completed' | 'failed';
  parameters: Record<string, any>;
  startTime: string;
  endTime?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionResult {
  id: string;
  sessionId: string;
  results: Record<string, any>;
  createdAt: string;
}

export interface CreateSessionPayload {
  deviceId: string;
  type: string;
  parameters: Record<string, any>;
}

export interface EndSessionPayload {
  endTime?: string;
}

export interface AddSessionResultPayload {
  results: Record<string, any>;
}

// Create a session
export async function createSession(payload: CreateSessionPayload): Promise<Session> {
  try {
    const response = await axios.post<{ success: boolean; session: Session }>('/session', payload);
    return response.data.session;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to create session');
  }
}

// End a session
export async function endSession(sessionId: string, payload?: EndSessionPayload): Promise<Session> {
  try {
    const response = await axios.post<{ success: boolean; session: Session }>(`/session/${sessionId}/end`, payload);
    return response.data.session;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to end session');
  }
}

// Add analysis results to session
export async function addSessionResult(sessionId: string, payload: AddSessionResultPayload): Promise<SessionResult> {
  try {
    const response = await axios.post<{ success: boolean; result: SessionResult }>(`/session/${sessionId}/results`, payload);
    return response.data.result;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to add session results');
  }
}
