import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Withdraw from './pages/Withdraw';
import Profile from './pages/Profile';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <Router>
      {/* Standard Bank branding container: 
          We use a max-width to simulate a mobile app feel 
          as per your screenshots.
      */}
      <div className="max-w-md mx-auto min-h-screen bg-black shadow-2xl overflow-x-hidden">
        <Routes>
          {/* Main Hub */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Your Assigned Pages */}
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<ContactUs />} />
          
          {/* Fallback to Dashboard if route not found */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;