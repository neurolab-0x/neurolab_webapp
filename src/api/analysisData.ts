import axios from '@/lib/axios/config';

export interface AnalysisData {
  id: string;
  deviceId: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  parameters: Record<string, any>;
  results?: Record<string, any>;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAnalysisStatusPayload {
  status: string;
}

// Get analyses for a specific device
export async function getDeviceAnalyses(deviceId: string): Promise<AnalysisData[]> {
  try {
    const response = await axios.get<any>(`/analysis/device/${deviceId}`);
    if (response.data.analyses) {
      return response.data.analyses;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch device analyses');
  }
}

// Get a specific analysis
export async function getAnalysis(analysisId: string): Promise<AnalysisData> {
  try {
    const response = await axios.get<{ success: boolean; analysis: AnalysisData }>(`/analysis/${analysisId}`);
    return response.data.analysis;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch analysis');
  }
}

// Get user's analyses
export async function getUserAnalyses(): Promise<AnalysisData[]> {
  try {
    const response = await axios.get<any>('/analysis/user');
    // Handle different response formats
    if (response.data.analyses) {
      return response.data.analyses;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn('[getUserAnalyses] Unexpected response format:', response.data);
      return [];
    }
  } catch (err: any) {
    console.error('[getUserAnalyses] Error:', err);
    throw new Error(err?.response?.data?.message || 'Failed to fetch user analyses');
  }
}

// Update analysis status
export async function updateAnalysisStatus(analysisId: string, payload: UpdateAnalysisStatusPayload): Promise<AnalysisData> {
  try {
    const response = await axios.put<{ success: boolean; analysis: AnalysisData }>(`/analysis/${analysisId}/status`, payload);
    return response.data.analysis;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to update analysis status');
  }
}
