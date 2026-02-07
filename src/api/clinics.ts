import axios from '@/lib/axios/config';

export interface ClinicPayload {
  name: string;
  type: 'HOSPITAL' | 'CLINIC' | string;
  location: {
    address?: string;
    city?: string;
    lat?: number;
    lng?: number;
  };
  integration?: {
    hardwareType?: string;
  };
}

export async function getClinics(): Promise<any[]> {
  try {
    const candidates = ['/admin/clinics', '/clinics', '/clinics/all'];
    for (const path of candidates) {
      try {
        const resp = await axios.get<any>(path);
        if (!resp || resp.status === 204) continue;
        if (Array.isArray(resp.data)) return resp.data;
        if (resp.data?.clinics && Array.isArray(resp.data.clinics)) return resp.data.clinics;
        if (resp.data?.data && Array.isArray(resp.data.data)) return resp.data.data;
        if (resp.data?.success && resp.data?.clinics && Array.isArray(resp.data.clinics)) return resp.data.clinics;
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) throw e;
        continue;
      }
    }
    return [];
  } catch (err: any) {
    console.warn('[clinics.getClinics] failed', err?.message || err);
    return [];
  }
}

export async function createClinic(payload: ClinicPayload): Promise<any> {
  try {
    const candidates = ['/admin/clinics', '/clinics'];
    for (const path of candidates) {
      try {
        const resp = await axios.post<any>(path, payload);
        if (resp?.data) return resp.data;
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) throw e;
        continue;
      }
    }
    throw new Error('No suitable endpoint found to create clinic');
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || err?.message || 'Failed to create clinic');
  }
}

export async function deleteClinic(clinicId: string): Promise<any> {
  try {
    const candidates = [`/admin/clinics/${clinicId}`, `/clinics/${clinicId}`];
    for (const path of candidates) {
      try {
        const resp = await axios.delete<any>(path);
        if (resp?.data) return resp.data;
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) throw e;
        continue;
      }
    }
    return { success: false };
  } catch (err: any) {
    console.warn('[clinics.deleteClinic] failed', err?.message || err);
    return { success: false };
  }
}

export default { getClinics, createClinic, deleteClinic };
