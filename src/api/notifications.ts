import axios from '@/lib/axios/config';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

/**
 * Get all notifications for the current user
 */
export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await axios.get('/notifications');
    return response.data || [];
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to fetch notifications');
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  try {
    const response = await axios.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to mark notification as read');
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    await axios.delete(`/notifications/${notificationId}`);
  } catch (error: any) {
    throw error?.response?.data || new Error('Failed to delete notification');
  }
}
