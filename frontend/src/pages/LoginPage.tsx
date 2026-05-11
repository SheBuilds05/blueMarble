import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State for form inputs and UI feedback
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Fix for ReferenceError

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Disable button and show "Verifying..."
    
    try {
<<<<<<< HEAD
      const response = await fetch('http://localhost:5000/api/auth/login', {
=======
      const response = await fetch('https://bluemarble.onrender.com/api/auth/login', {
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

if (response.ok) {
  localStorage.setItem('token', data.token);
  
  // FIXED: Accessing 'id' inside the 'user' object returned by your backend
  const userId = data.user?.id || data.user?._id || data.userId;
  
  if (userId) {
    localStorage.setItem('userId', userId);
    console.log("User ID saved successfully:", userId);
  } else {
    console.error("User ID not found in backend response:", data);
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
  });
  
  await Toast.fire({ icon: 'success', title: 'Signed in successfully' });
  navigate('/dashboard');
} else {
        // Handle 401 Unauthorized or other backend errors
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.message || "Invalid credentials provided.",
          confirmButtonColor: '#2563eb'
        });
      }
    } catch (error) {
      // Handles ERR_CONNECTION_REFUSED
      Swal.fire({
        icon: 'warning',
        title: 'Connection Error',
        text: 'The backend server is offline. Please ensure the server is running on port 5000.',
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  const goToRegister = () => navigate('/register');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 p-4">
      <div className="bg-blue-600/40 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl w-full max-w-md flex flex-col items-center border border-blue-400/30">
        
        {/* Login Icon */}
        <div className="bg-white p-4 rounded-2xl mb-6 shadow-lg">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h1>
        <p className="text-blue-100 mb-10 text-center text-sm">Enter your credentials to access your account</p>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full p-4 bg-white/10 border border-blue-400/50 rounded-2xl text-white placeholder:text-blue-200 focus:ring-2 focus:ring-white outline-none transition-all shadow-inner"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em] ml-1">Access Code</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 bg-white/10 border border-blue-400/50 rounded-2xl text-white placeholder:text-blue-200 focus:ring-2 focus:ring-white outline-none transition-all shadow-inner"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-600 font-bold py-5 rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : "Access Account"}
          </button>
        </form>

        <p className="mt-10 text-sm text-blue-100">
          Don't have an account?{" "}
          <span onClick={goToRegister} className="text-white font-bold cursor-pointer hover:underline underline-offset-4">
            Register Now
          </span>
        </p>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default LoginPage;
=======
export default LoginPage;
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
