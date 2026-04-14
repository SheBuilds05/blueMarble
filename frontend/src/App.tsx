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
      {/* Main wrapper with your blueMarble gradient */}
      <div className="relative min-h-screen w-full bg-gradient-to-br from-[#052ce0] to-[#ADE8F4] overflow-x-hidden">
        
        <Routes>
          {/* Default Path */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
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
        
        {/* Your Floating Nav Component */}
        <BottomNav />
        
      </div>
    </Router>
  );
}

export default App;