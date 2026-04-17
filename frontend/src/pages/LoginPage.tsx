import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  // 1. Hooks must be inside the component
  const navigate = useNavigate();

  // 2. Functions must be defined before the return statement
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to move to dashboard
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-marble-primary to-blue-marble-dark p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl w-full max-w-md flex flex-col items-center">
        
        {/* Logo Icon */}
        <div className="bg-blue-marble-primary p-4 rounded-2xl mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-500 mb-10 text-center text-sm">Enter your credentials to access your account</p>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              className="w-full p-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-marble-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-marble-primary outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-marble-primary text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-10 text-sm text-slate-500">
          Don't have an account? <span className="text-blue-marble-primary font-bold cursor-pointer hover:underline">Register Now</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
