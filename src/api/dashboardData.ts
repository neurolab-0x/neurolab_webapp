import axios from "axios";

// Fetches live analysis data for a user by _id
export async function getDashboardCardsData() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/analysis/user`);
        // Optionally, return the latest analysis
        const analyses = response.data;
        return analyses;
    } catch (error: any) {
        return error?.response?.data?.message || "Failed to fetch analysis data.";
    }
}

export async function getTotalActivities() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/analysis/user`);
        // Optionally, return the latest analysis
        const analyses = response.data;
        return analyses;
    } catch (error: any) {
        return error?.response?.data?.message || "Failed to fetch analysis data.";
    }
}