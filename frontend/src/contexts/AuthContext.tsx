import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Types
interface Account {
  id: string;
  name: string;
  type: 'savings' | 'cheque' | 'investment';
  balance: number;
  accountNumber: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  accounts?: Account[];
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
  login: (email: string, password: string) => Promise<boolean>;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 6);

const DEFAULT_ACCOUNTS: Account[] = [
  { id: "1", name: "Main Savings", type: "savings", balance: 12500.75, accountNumber: "SAV-****-1234" },
  { id: "2", name: "Everyday Cheque", type: "cheque", balance: 3450.50, accountNumber: "CHQ-****-5678" },
  { id: "3", name: "Investment Portfolio", type: "investment", balance: 50000.00, accountNumber: "INV-****-9012" }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('bluemarble_user');
    const storedNotifications = localStorage.getItem('bluemarble_notifications');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.accounts || parsedUser.accounts.length === 0) {
          parsedUser.accounts = DEFAULT_ACCOUNTS;
        }
        setUser(parsedUser);
        console.log('✅ User loaded from localStorage:', parsedUser.email);
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

  useEffect(() => {
    if (user) {
      localStorage.setItem('bluemarble_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bluemarble_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bluemarble_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
<<<<<<< HEAD
      const response = await fetch('http://localhost:5000/api/auth/login', {
=======
      const response = await fetch('https://bluemarble.onrender.com/api/auth/login', {
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        
        const userWithAccounts: User = {
          id: data.user?.id || data.userId,
          name: data.user?.firstName || data.user?.name || email.split('@')[0],
          email: email,
          balance: data.user?.balance || 1000,
          accounts: data.user?.accounts || DEFAULT_ACCOUNTS,
          phone: data.user?.phone,
          createdAt: new Date().toISOString(),
          preferences: {
            emailNotifications: true,
            transactionAlerts: true,
            language: 'en'
          }
        };
        
        localStorage.setItem('bluemarble_user', JSON.stringify(userWithAccounts));
        setUser(userWithAccounts);
        console.log('✅ Login successful, user saved with accounts');
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, code: string): Promise<boolean> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: generateId(),
          name,
          email,
          balance: 1000.00,
          accounts: [
            { id: "1", name: "Main Savings", type: "savings", balance: 1000.00, accountNumber: "SAV-****-NEW1" },
            { id: "2", name: "Everyday Cheque", type: "cheque", balance: 0, accountNumber: "CHQ-****-NEW2" }
          ],
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bluemarble_user');
    localStorage.removeItem('token');
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  };

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

<<<<<<< HEAD
export default AuthContext;
=======
export default AuthContext;
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
