import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
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
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, code: string) => Promise<boolean>;
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
  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
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
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;