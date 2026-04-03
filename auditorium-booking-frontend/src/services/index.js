import api from './api';

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

export const auditoriumService = {
    getAll: () => api.get('/auditoriums'),
};

export const availabilityService = {
    getByDate: (date) => api.get(`/availability?date=${date}`),
};

export const bookingService = {
    create: (data) => api.post('/bookings', data),
    getMyBookings: () => api.get('/bookings/my'),
    getPendingBookings: () => api.get('/bookings/pending'),
    approve: (id) => api.put(`/bookings/${id}/approve`),
    reject: (id, remarks) => api.put(`/bookings/${id}/reject`, { remarks }),
};
