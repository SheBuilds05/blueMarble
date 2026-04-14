import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard'; // Added this
import Accounts from './pages/Accounts';
import Payments from './pages/PaymentPage'; // Capitalized for consistency

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/pay" element={<Payments />} />
      </Routes>
    </Router>
  );
}

export default App;