import axios from '@/lib/axios/config';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get all users (admin)
export async function getAllUsers(): Promise<AdminUser[]> {
  try {
    const candidates = ['/admins/users', '/admin/users', '/users', '/users/all', '/users?all=true'];
    for (const path of candidates) {
      try {
        const response = await axios.get<any>(path);
        if (!response || response.status === 204) continue;
        if (Array.isArray(response.data)) return response.data;
        if (response.data?.users && Array.isArray(response.data.users)) return response.data.users;
        if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
        // sometimes the API wraps users under { success: true, users: [...] }
        if (response.data?.success && response.data?.users && Array.isArray(response.data.users)) return response.data.users;
      } catch (e: any) {
        // try next candidate
        // If this was a 403/401, bubble up immediately
        const status = e?.response?.status;
        if (status === 401 || status === 403) throw e;
        continue;
      }
    }
    return [];
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch users');
  }
}

// Update a user's role
export async function updateUserRole(userId: string, role: string): Promise<AdminUser> {
  try {
    const candidates = [
      `/admins/users/${userId}/role`,
      `/admin/users/${userId}/role`,
      `/users/${userId}/role`,
      `/users/${userId}`
    ];
    for (const path of candidates) {
      try {
        // If last candidate (/users/:id) we send PUT with role
        const payload = { role };
        const response = await axios.put<any>(path, payload);
        if (response?.data) return response.data.user || response.data;
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) throw e;
        continue;
      }
    }
    throw new Error('No suitable endpoint found to update role');
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to update user role');
  }
}

// Get pending role change requests (if backend supports it)
export async function getRoleChangeRequests(): Promise<any[]> {
  try {
    const response = await axios.get<any>('/admin/role-requests');
    return response.data.requests || response.data || [];
  } catch (err: any) {
    // return empty array if endpoint not available
    console.warn('[admin.getRoleChangeRequests] endpoint may not exist', err?.response?.status);
    return [];
  }
}

export async function approveRoleRequest(requestId: string): Promise<any> {
  try {
    const response = await axios.post<any>(`/admin/role-requests/${requestId}/approve`);
    return response.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to approve role request');
  }
}

export async function rejectRoleRequest(requestId: string): Promise<any> {
  try {
    const response = await axios.post<any>(`/admin/role-requests/${requestId}/reject`);
    return response.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to reject role request');
  }
}

// Get admin dashboard statistics
export async function getAdminStatistics(): Promise<any> {
  try {
    const response = await axios.get<any>('/admin/statistics');
    return response.data;
  } catch (err: any) {
    console.warn('[admin.getAdminStatistics] endpoint may not exist', err?.response?.status);
    // Return dummy data if endpoint not available
    return null;
  }
}

// Get all sessions (admin view)
export async function getAllSessions(): Promise<any[]> {
  try {
    const candidates = ['/admin/sessions', '/sessions/all'];
    for (const path of candidates) {
      try {
        const response = await axios.get<any>(path);
        if (response?.data) {
          if (Array.isArray(response.data)) return response.data;
          if (response.data?.sessions && Array.isArray(response.data.sessions)) return response.data.sessions;
          if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
        }
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) throw e;
        continue;
      }
    }
    return [];
  } catch (err: any) {
    console.warn('[admin.getAllSessions] Failed to fetch sessions');
    return [];
  }
}

// Get all appointments (admin view)
export async function getAllAppointments(): Promise<any[]> {
  try {
    const candidates = ['/admin/appointments', '/appointments/all'];
    for (const path of candidates) {
      try {
        const response = await axios.get<any>(path);
        if (response?.data) {
          if (Array.isArray(response.data)) return response.data;
          if (response.data?.appointments && Array.isArray(response.data.appointments)) return response.data.appointments;
          if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
        }
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) throw e;
        continue;
      }
    }
    return [];
  } catch (err: any) {
    console.warn('[admin.getAllAppointments] Failed to fetch appointments');
    return [];
  }
}

// Get all analyses (admin view)
export async function getAllAnalyses(): Promise<any[]> {
  try {
    const candidates = ['/admin/analyses', '/analysis/all'];
    for (const path of candidates) {
      try {
        const response = await axios.get<any>(path);
        if (response?.data) {
          if (Array.isArray(response.data)) return response.data;
          if (response.data?.analyses && Array.isArray(response.data.analyses)) return response.data.analyses;
          if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
        }
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) throw e;
        continue;
      }
    }
    return [];
  } catch (err: any) {
    console.warn('[admin.getAllAnalyses] Failed to fetch analyses');
    return [];
  }
}

// Get all reports (admin view)
export async function getAllReports(): Promise<any[]> {
  try {
    const candidates = ['/admin/reports', '/reports/all'];
    for (const path of candidates) {
      try {
        const response = await axios.get<any>(path);
        if (response?.data) {
          if (Array.isArray(response.data)) return response.data;
          if (response.data?.reports && Array.isArray(response.data.reports)) return response.data.reports;
          if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
        }
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) throw e;
        continue;
      }
    }
    return [];
  } catch (err: any) {
    console.warn('[admin.getAllReports] Failed to fetch reports');
    return [];
  }
}
