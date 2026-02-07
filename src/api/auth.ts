import axios from '@/lib/axios/config';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

export const loginUser = async (credentials: LoginCredentials) => {
    const { data } = await axios.post('/auth/login', credentials);
    return data;
};

export const registerUser = async (credentials: RegisterCredentials) => {
    const { data } = await axios.post('/auth/register', credentials);
    return data;
};

export const verifyEmail = async (token: string) => {
    const { data } = await axios.get(`/auth/verify-email/${token}`);
    return data;
};

export const requestPasswordReset = async (email: string) => {
    const { data } = await axios.post('/auth/request-password-reset', { email });
    return data;
};

export const resetPassword = async (token: string, password: string) => {
    const { data } = await axios.post(`/auth/reset-password/${token}`, { password });
    return data;
};

export const logoutUser = async () => {
    const { data } = await axios.post('/auth/logout');
    return data;
};

export const refreshToken = async (refreshToken: string) => {
    const { data } = await axios.post('/auth/refresh', { refreshToken });
    return data;
};
