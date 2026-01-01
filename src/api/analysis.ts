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