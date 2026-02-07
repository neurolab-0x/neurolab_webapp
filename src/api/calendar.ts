import axios from '@/lib/axios/config';

export const getCalendarAuthUrl = async () => {
    const { data } = await axios.get('/calendar/auth-url');
    return data;
};

export const disconnectCalendar = async () => {
    const { data } = await axios.post('/calendar/disconnect', { disconnect: true });
    return data;
};
