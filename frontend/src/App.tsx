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
          
          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
        
        {/* Your Floating Navigation */}
        <BottomNav />
        
      </div>
    </Router>
  );
}

export default App;