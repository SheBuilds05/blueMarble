import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getUserProfile } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  accounts: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  addNotification: (notif: any) => void;
  notifications: any[];
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      // Use stored user data – no need to fetch profile
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else if (token) {
      // Token exists but no user data – try to fetch profile
      getUserProfile()
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          // Token is invalid or expired – clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, code: string) => {
    try {
      const res = await loginUser(email, code);
      console.log('Login response:', res);
      console.log('Token:', res.data.token);
      console.log('User:', res.data.user);

      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user)); // ✅ store user
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setNotifications([]);
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // keep stored user in sync
    }
  };

  const addNotification = (notif: any) => {
    setNotifications(prev => [
      {
        ...notif,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const markAsRead = (id: string) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));

  const deleteNotification = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const markAllAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateBalance,
        addNotification,
        notifications,
        markAsRead,
        deleteNotification,
        markAllAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};