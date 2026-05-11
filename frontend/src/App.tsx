<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import History from './pages/History';
import AuthPage from './pages/AuthPage'; 
import FullStatement from './pages/FullStatement'; // 1. Add this import
import BottomNav from './components/BottomNav';

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#020617]">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/history" element={<History />} />
        
        {/* 2. Add this route so the app knows where to go */}
        <Route path="/full-statement" element={<FullStatement />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Logic: BottomNav will now also show on /full-statement */}
      {location.pathname !== '/' && location.pathname !== '/auth' && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OpenAccount from './pages/OpenAccount';
import RegisterPage from './pages/RegisterPage';
import Payments from './pages/PaymentPage'; 
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import Withdraw from './pages/Withdraw'; 
import Profile from './pages/Profile';
import ContactUs from './pages/ContactUs';
import Landing from './pages/Landing';
import History from './pages/History';
import Buy from './pages/Buy';
import Deposit from './pages/Deposit';
import Notifications from './pages/Notifications';
import Cards from './pages/Cards';
import FullStatement from './pages/FullStatement';



const App: React.FC = () => {
  return (
    <Router>
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/open-account" element={<OpenAccount />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/pay" element={<Payments />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/full-statement" element={<FullStatement />} />
          <Route path="/notification" element={<Notifications />} />
          <Route path="/cards" element={<Cards />} />
        </Routes>

        
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    </Router>
  );
};

export default App;