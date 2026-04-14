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