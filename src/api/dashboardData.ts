import axios from '@/lib/axios/config';

// Fetches live analysis data for the current user
export async function getDashboardCardsData() {
    try {
        const response = await axios.get('/analysis/user');
        return response.data;
    } catch (error: any) {
        throw error?.response?.data || new Error('Failed to fetch analysis data.');
    }
}

export async function getTotalActivities() {
    try {
        const response = await axios.get('/analysis/user');
        return response.data;
    } catch (error: any) {
        throw error?.response?.data || new Error('Failed to fetch analysis data.');
    }
}