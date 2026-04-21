<<<<<<< HEAD
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Types
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getUserProfile } from '../services/api';

>>>>>>> sibongokuhle
interface User {
  id: string;
  name: string;
  email: string;
<<<<<<< HEAD
  phone?: string;
  balance: number;
  createdAt?: string;
  preferences?: {
    emailNotifications: boolean;
    transactionAlerts: boolean;
    language: string;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'alert' | 'info' | 'success';
  read: boolean;
  createdAt: string;
=======
  balance: number;
  accounts: any[];
>>>>>>> sibongokuhle
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, code: string) => Promise<boolean>;
<<<<<<< HEAD
  register: (name: string, email: string, code: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  updateUser: (userData: Partial<User>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updatePreferences: (preferences: User['preferences']) => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 6);

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load user from localStorage on mount - THIS IS CRITICAL
  useEffect(() => {
    const storedUser = localStorage.getItem('bluemarble_user');
    const storedNotifications = localStorage.getItem('bluemarble_notifications');
    
    console.log('Loading from localStorage:', storedUser); // Debug log
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('User loaded:', parsedUser); // Debug log
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (e) {
        console.error('Failed to parse notifications:', e);
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      console.log('Saving user to localStorage:', user); // Debug log
      localStorage.setItem('bluemarble_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bluemarble_user');
    }
  }, [user]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('bluemarble_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Login function
  const login = async (email: string, code: string): Promise<boolean> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Demo user - accept demo@openbank.com with code 123456
        if (email === 'demo@openbank.com' && code === '123456') {
          const demoUser: User = {
            id: '1',
            name: 'Demo User',
            email: 'demo@openbank.com',
            phone: '+1 234 567 8900',
            balance: 5234.56,
            createdAt: '2024-01-15',
            preferences: {
              emailNotifications: true,
              transactionAlerts: true,
              language: 'en',
            },
          };
          setUser(demoUser);
          setLoading(false);
          resolve(true);
        } else {
          setLoading(false);
          resolve(false);
        }
      }, 500);
    });
  };

  // Register function
  const register = async (name: string, email: string, code: string): Promise<boolean> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: generateId(),
          name,
          email,
          balance: 1000.00,
          createdAt: new Date().toISOString().slice(0, 10),
          preferences: {
            emailNotifications: true,
            transactionAlerts: true,
            language: 'en',
          },
        };
        
        setUser(newUser);
        setLoading(false);
        resolve(true);
      }, 500);
    });
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bluemarble_user');
  };

  // Update balance
=======
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

>>>>>>> sibongokuhle
  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
<<<<<<< HEAD
    }
  };

  // Update user profile
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Mark as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  };

  // Update preferences
  const updatePreferences = (preferences: User['preferences']) => {
    if (user) {
      const updatedUser = { ...user, preferences };
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateBalance,
    updateUser,
    addNotification,
    notifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    changePassword,
    updatePreferences,
  };

  return (
    <AuthContext.Provider value={value}>
=======
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
>>>>>>> sibongokuhle
      {children}
    </AuthContext.Provider>
  );
};

<<<<<<< HEAD
// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
=======
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
>>>>>>> sibongokuhle
