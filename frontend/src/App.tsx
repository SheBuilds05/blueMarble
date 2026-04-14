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
    </Router>
  );
}

export default App;