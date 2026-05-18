import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTH ==========
export const loginUser = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

// ========== ACCOUNTS ==========
export const getUserAccounts = () => api.get('/auth/accounts');
export const addAccount = (type: string) => 
  api.post('/auth/add-account', { type });

// ========== TRANSACTIONS (NEW) ==========
export const getTransactions = () => api.get('/transactions');
export const getTransactionsByUser = (userId: string) => 
  api.get(`/transactions/user/${userId}`);
export const createTransaction = (transactionData: any) => 
  api.post('/transactions', transactionData);
export const deleteTransaction = (id: string) => 
  api.delete(`/transactions/${id}`);
export const getSummary = (userId: string) => 
  api.get(`/summary/${userId}`);

// ========== USER PROFILE ==========
export const getUserProfile = () => api.get('/auth/accounts');

// ========== TRANSFERS / PAYMENTS ==========
export const transferFunds = (fromAccountId: string, toAccountId: string, amount: number, reference?: string) =>
  api.post('/auth/pay', { amount, reference, beneficiaryId: toAccountId });

// ========== NOTIFICATIONS ==========
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id: string) =>
  api.patch(`/notifications/${id}/read`);
export const deleteNotification = (id: string) =>
  api.delete(`/notifications/${id}`);
export const markAllNotificationsRead = () =>
  api.post('/notifications/mark-all-read');

// ========== PURCHASES ==========
export const buyAirtime = (provider: string, phoneNumber: string, amount: number) =>
  api.post('/buy/airtime', { provider, phoneNumber, amount });
export const buyElectricity = (provider: string, meterNumber: string, amount: number) =>
  api.post('/buy/electricity', { provider, meterNumber, amount });
export const buyVoucher = (provider: string, amount: number, email: string) =>
  api.post('/buy/voucher', { provider, amount, email });

export default api;