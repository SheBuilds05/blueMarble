import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

console.log('🔌 API Base URL:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.message);
    return Promise.reject(error);
  }
);

export const loginUser = (email: string, code: string) =>
  api.post('/auth/login', { email, code });

export const getUserProfile = () => api.get('/user/profile');

export const transferFunds = (from: string, to: string, amount: number, desc?: string) =>
  api.post('/transfer', { fromAccountId: from, toAccountId: to, amount, description: desc });

export const buyAirtime = (provider: string, phone: string, amount: number) =>
  api.post('/buy/airtime', { provider, phoneNumber: phone, amount });

export const getNotifications = (filter = 'all') =>
  api.get(`/notifications?filter=${filter}`);

export const markNotificationRead = (id: string) =>
  api.patch(`/notifications/${id}/read`);

export const deleteNotification = (id: string) =>
  api.delete(`/notifications/${id}`);

export const markAllNotificationsRead = () =>
  api.post('/notifications/mark-all-read');

export default api;