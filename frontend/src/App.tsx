import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Your pages
import Deposit from './pages/Deposit';
import Buy from './pages/Buy';
import Notifications from './pages/Notifications';
import Withdraw from './pages/Withdraw';
import Navbar from './components/Navbar';

// Login component
function Login() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/deposit');
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const success = await login(email, code);
    
    if (!success) {
      setError('Invalid email or code. Use: demo@openbank.com / 123456');
      setIsLoading(false);
    }
  };
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importing your specific blueMarble pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Withdraw from './pages/Withdraw'; // Re-added the Withdraw page
import Profile from './pages/profile';
import ContactUs from './pages/ContactUs';
import BottomNav from './components/BottomNav';

/**
 * Placeholder components for remaining features.
 */
const History = () => <div className="p-20 text-white text-center font-bold">History (Coming Soon)</div>;
const Deposit = () => <div className="p-20 text-white text-center font-bold">Deposit (Coming Soon)</div>;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import History from './pages/History';
import './index.css';

function App() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">BlueMarble</h1>
        <p className="login-subtitle">Sign in to your account</p>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
          />
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="login-demo">
          Demo: demo@openbank.com / 123456
        </p>
      </div>
    </div>
  );
}

// Protected route wrapper
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Main app content with routing
function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/deposit" element={<PrivateRoute><Deposit /></PrivateRoute>} />
        <Route path="/withdraw" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
        <Route path="/buy" element={<PrivateRoute><Buy /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/deposit" />} />
      </Routes>
    </>
  );
}

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
    <Router>
      <Routes>
        {/* Your BlueMarble animated entrance */}
        <Route path="/" element={<Landing />} />
        
        {/* Your separate History page */}
        <Route path="/history" element={<History />} />
      </Routes>
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importing your specific pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';

/**
 * Placeholder components for the rest of your team.
 * These keep your app running while they finish their files.
 */
const History = () => <div className="p-20 text-white text-center">History (Coming Soon)</div>;
const Deposit = () => <div className="p-20 text-white text-center">Deposit (Coming Soon)</div>;
const Withdraw = () => <div className="p-20 text-white text-center">Cards & Withdraw (Coming Soon)</div>;
const Profile = () => <div className="p-20 text-white text-center">User Profile (Coming Soon)</div>;

function App() {
  return (
    <Router>
      {/* Main wrapper with your signature blueMarble gradient */}
      <div className="relative min-h-screen w-full bg-gradient-to-br from-[#052ce0] to-[#ADE8F4] overflow-x-hidden">
        
        <Routes>
          {/* Default Path */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* Core blueMarble Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/withdraw" element={<Withdraw />} /> {/* Withdraw is now active */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<ContactUs />} />
          
          {/* Collaboration Routes */}
          <Route path="/history" element={<History />} />
          <Route path="/deposit" element={<Deposit />} />
          {/* Your Core Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Team Collaboration Routes */}
          <Route path="/history" element={<History />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
        
        {/* Your Floating Navigation */}
        {/* Your Floating Nav Component */}
        <BottomNav />
        
      </div>
    </Router>
  );
}

export default App;