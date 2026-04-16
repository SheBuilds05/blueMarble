import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Core Pages
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Ensure this file is RegisterPage.tsx
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Payments from './pages/PaymentPage';
import Settings from './pages/Settings';
import Withdraw from './pages/Withdraw'; 
import Profile from './pages/Profile';
import ContactUs from './pages/ContactUs';
import History from './pages/History';

// Components
import BottomNav from './components/BottomNav';
import './index.css';

/**
 * Placeholder components for remaining features.
 * Using React.FC for TypeScript type safety.
 */
const Deposit: React.FC = () => (
  <div className="p-20 text-white text-center font-bold">Deposit (Coming Soon)</div>
);

const App: React.FC = () => {
  return (
    <Router>
      {/* Main wrapper with your blueMarble gradient */}
      <div className="relative min-h-screen w-full bg-gradient-to-br from-[#052ce0] to-[#ADE8F4] overflow-x-hidden">
        
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Core App Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/pay" element={<Payments />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/history" element={<History />} />
          <Route path="/deposit" element={<Deposit />} />
          
          {/* Fallback: Send users to landing if route doesn't exist */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* Navigation stays visible across all pages */}
        <BottomNav />
        
      </div>
    </Router>
  );
};

export default App;