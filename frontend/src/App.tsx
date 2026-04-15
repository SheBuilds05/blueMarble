import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all your existing page components
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Entrance & Auth */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Banking Features */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
      </Routes>
    </Router>
  );
}

export default App;
