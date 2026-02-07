import axios from '@/lib/axios/config';

export type AnalysisParameters = {
  samplingRate: number;
  duration: number;
  channels: string[];
};

export type CreateAnalysisPayload = {
  deviceId: string;
  type: string;
  parameters: AnalysisParameters;
};

export type AnalysisResponse = {
  success: boolean;
  analysis: any;
};

export async function createAnalysis(payload: CreateAnalysisPayload): Promise<any> {
  try {
    const response = await axios.post<AnalysisResponse>('analysis', payload);
    return response.data.analysis;
  } catch (err: any) {
    // Bubble up a useful error message with status if available
    const msg = err?.response?.data?.message || err?.message || 'Failed to create analysis';
    const status = err?.response?.status;
    const error = new Error(msg);
    (error as any).status = status;
    throw error;
  }
}

// Upload analysis file (multipart/form-data) - supports doctor's upload flow
export async function uploadAnalysisFile(file: File, sessionId?: string): Promise<any> {
  try {
    const form = new FormData();
    form.append('file', file, file.name);
    if (sessionId) form.append('sessionId', sessionId);

    // Don't set Content-Type header - let axios/browser handle it automatically
    // This ensures the boundary parameter is correctly included
    const response = await axios.post<any>('analysis', form);
    return response.data;
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || 'Failed to upload analysis file';
    const status = err?.response?.status;
    const error = new Error(msg);
    (error as any).status = status;
    throw error;
  }
}