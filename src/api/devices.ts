import axios from '@/lib/axios/config';

export interface Device {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDevicePayload {
  name: string;
  type: string;
  serialNumber: string;
}

export interface UpdateDevicePayload {
  name?: string;
  type?: string;
  status?: string;
}

// Create a device
export async function createDevice(payload: CreateDevicePayload): Promise<Device> {
  try {
    const response = await axios.post<{ success: boolean; device: Device }>('/device', payload);
    return response.data.device;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to create device');
  }
}

// Get device by ID
export async function getDevice(deviceId: string): Promise<Device> {
  try {
    const response = await axios.get<{ success: boolean; device: Device }>(`/device/${deviceId}`);
    return response.data.device;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch device');
  }
}

// Update device
export async function updateDevice(deviceId: string, payload: UpdateDevicePayload): Promise<Device> {
  try {
    const response = await axios.put<{ success: boolean; device: Device }>(`/device/${deviceId}`, payload);
    return response.data.device;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to update device');
  }
}

// Delete device
export async function deleteDevice(deviceId: string): Promise<{ success: boolean }> {
  try {
    const response = await axios.delete<{ success: boolean }>(`/device/${deviceId}`);
    return response.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to delete device');
  }
}

// Get device status
export async function getDeviceStatus(deviceId: string): Promise<{ status: string; [key: string]: any }> {
  try {
    const response = await axios.get<{ success: boolean; status: string; [key: string]: any }>(`/device/${deviceId}/status`);
    return { status: response.data.status, ...response.data };
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch device status');
  }
}

// Assign device to user
export async function assignDevice(deviceId: string, userId: string): Promise<{ success: boolean }> {
  try {
    const response = await axios.post<{ success: boolean }>(`/device/${deviceId}/assign`, { userId });
    return response.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to assign device');
  }
}
