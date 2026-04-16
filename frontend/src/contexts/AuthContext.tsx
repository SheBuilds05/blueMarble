import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  accounts?: any[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('bluemarble_user');
    const storedNotifs = localStorage.getItem('bluemarble_notifications');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
    setLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) localStorage.setItem('bluemarble_user', JSON.stringify(user));
    else localStorage.removeItem('bluemarble_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bluemarble_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Mock login – replace with real API call later
  const login = async (email: string, code: string): Promise<boolean> => {
    // Demo credentials
    if (email === 'demo@openbank.com' && code === '123456') {
      const demoUser: User = {
        id: '1',
        name: 'Demo User',
        email: 'demo@openbank.com',
        balance: 5234.56,
        accounts: [
          { id: '1', name: 'Main Savings', type: 'savings', balance: 12500.75, accountNumber: 'SAV-****-1234' },
          { id: '2', name: 'Everyday Cheque', type: 'cheque', balance: 3450.50, accountNumber: 'CHQ-****-5678' },
          { id: '3', name: 'Investment Portfolio', type: 'investment', balance: 50000.00, accountNumber: 'INV-****-9012' }
        ]
      };
      setUser(demoUser);
      // Add welcome notification if none exist
      if (notifications.length === 0) {
        setNotifications([{
          id: Date.now().toString(),
          title: 'Welcome to BlueMarble',
          message: 'Start by transferring funds or buying services.',
          type: 'info',
          read: false,
          createdAt: new Date().toISOString()
        }]);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
  };

  const updateBalance = (newBalance: number) => {
    if (user) setUser({ ...user, balance: newBalance });
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, updateBalance,
      notifications, addNotification, markAsRead, deleteNotification, markAllAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};