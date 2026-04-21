import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  // Changed from password to registerCode to match backend logic
  const [registerCode, setRegisterCode] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Clear any old mock sessions before attempting a new real login
    localStorage.removeItem('userId');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sending registerCode instead of password
        body: JSON.stringify({ email, registerCode }), 
      });

      const data = await response.json();

      if (response.ok) {
        // Save the real MongoDB _id returned by the server
        localStorage.setItem('userId', data.userId); 
        
        await Swal.fire({
          icon: 'success',
          title: 'Access Granted',
          text: `Welcome back, ${email}`,
          timer: 1500,
          showConfirmButton: false,
          background: '#052ce0',
          color: '#ffffff'
        });
        
        navigate('/withdraw'); 
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.error || 'Invalid email or registration code',
          confirmButtonColor: '#052ce0'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Could not reach the server. Please check your network.',
        confirmButtonColor: '#052ce0'
      });
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate('/RegisterPage'); 
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 p-4">
      <div className="bg-blue-600/40 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl w-full max-w-md flex flex-col items-center border border-blue-400/30">
        
        <div className="bg-white p-4 rounded-2xl mb-6 shadow-lg">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Secure Login</h1>
        <p className="text-blue-100 mb-10 text-center text-sm">Enter your registered email and 6-digit code</p>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em]">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@example.com"
              required
              className="w-full p-4 bg-white/10 border border-blue-400/50 rounded-2xl text-white placeholder:text-blue-200/50 focus:ring-2 focus:ring-white outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em]">Registration Code</label>
            <input 
              type="text" 
              maxLength={6}
              value={registerCode}
              onChange={(e) => setRegisterCode(e.target.value)}
              placeholder="111111"
              required
              className="w-full p-4 bg-white/10 border border-blue-400/50 rounded-2xl text-white placeholder:text-blue-200/50 focus:ring-2 focus:ring-white outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-600 font-bold py-5 rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Access Account"}
          </button>
        </form>

        <p className="mt-10 text-sm text-blue-100">
          Don't have an account?{" "}
          <span 
            onClick={goToRegister}
            className="text-white font-bold cursor-pointer hover:underline"
          >
            Register Now
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;