const API_BASE = 'http://localhost:5000/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

// Generic fetch wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

// Deposit funds
export const depositFunds = (amount: number, description: string) =>
  request('/deposit', { method: 'POST', body: JSON.stringify({ amount, description }) });

// Transfer between accounts
export const transferFunds = (fromAccount: string, toAccount: string, amount: number, description: string) =>
  request('/transfer', { method: 'POST', body: JSON.stringify({ fromAccount, toAccount, amount, description }) });

// Buy airtime
export const buyAirtime = (provider: string, phoneNumber: string, amount: number) =>
  request('/buy/airtime', { method: 'POST', body: JSON.stringify({ provider, phoneNumber, amount }) });

// Buy electricity
export const buyElectricity = (provider: string, meterNumber: string, amount: number) =>
  request('/buy/electricity', { method: 'POST', body: JSON.stringify({ provider, meterNumber, amount }) });

// Buy voucher
export const buyVoucher = (voucherType: string, amount: number, email: string) =>
  request('/buy/voucher', { method: 'POST', body: JSON.stringify({ voucherType, amount, email }) });

// Get notifications
export const getNotifications = (filter: string = 'all') =>
  request(`/notifications?filter=${filter}`);

// Mark notification as read
export const markNotificationRead = (id: string) =>
  request(`/notifications/${id}/read`, { method: 'PATCH' });

// Delete notification
export const deleteNotification = (id: string) =>
  request(`/notifications/${id}`, { method: 'DELETE' });

// Mark all as read
export const markAllNotificationsRead = () =>
  request('/notifications/mark-all-read', { method: 'POST' });