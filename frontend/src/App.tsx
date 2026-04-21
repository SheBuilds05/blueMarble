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
    </Router>
  );
}

export default App;