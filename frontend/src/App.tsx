import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import History from './pages/History'; // Match this name to the tag below
import AuthPage from './pages/AuthPage'; 
import BottomNav from './components/BottomNav';

// We create a wrapper component to use the 'useLocation' hook
function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#020617]">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* Changed from HistoryPage to History to match the import above */}
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Logic: Only show BottomNav if the path is NOT '/' or '/auth' */}
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