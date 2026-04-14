import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Accounts from './pages/Accounts';
import Payments from './pages/PaymentPage'; 
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Withdraw from './pages/Withdraw'; 
import Profile from './pages/Profile';
import ContactUs from './pages/ContactUs';
import Landing from './pages/Landing';
import History from './pages/History';
import Buy from './pages/Buy';
import Deposit from './pages/Deposit';
import Notifications from './pages/Notifications';



function App() {
  return (
    <Router>
      {/* Main wrapper with your signature blueMarble gradient */}
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="/notification" element={<Notifications />} />
          {/* Ensure Deposit is imported or created to avoid "not defined" errors */}
          {/* <Route path="/deposit" element={<Deposit />} /> */}
        </Routes>

        
    </Router>
  );
}

export default App;