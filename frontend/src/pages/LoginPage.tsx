import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard'); 
  };

  // Function to handle moving to the register page
  const goToRegister = () => {
    navigate('/RegisterPage'); 
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-marble-primary to-blue-marble-dark p-4">
      {/* Changed bg-white/95 to bg-blue-600 (or your primary blue) and adjusted text colors */}
      <div className="bg-blue-600 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl w-full max-w-md flex flex-col items-center border border-blue-400/30">
        
        {/* Logo Icon - Adjusted background for contrast */}
        <div className="bg-white p-4 rounded-2xl mb-6 shadow-lg">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>

        {/* Text colors changed to white for visibility on blue card */}
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-blue-100 mb-10 text-center text-sm">Enter your credentials to access your account</p>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em]">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              className="w-full p-4 bg-white/10 border border-blue-400/50 rounded-2xl text-white placeholder:text-blue-200 focus:ring-2 focus:ring-white outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em]">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-4 bg-white/10 border border-blue-400/50 rounded-2xl text-white placeholder:text-blue-200 focus:ring-2 focus:ring-white outline-none transition-all"
            />
          </div>

          {/* Login button: vibrant white-on-blue for high visibility */}
          <button 
            type="submit"
            className="w-full bg-white text-blue-600 font-bold py-5 rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        {/* Register navigation added here */}
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