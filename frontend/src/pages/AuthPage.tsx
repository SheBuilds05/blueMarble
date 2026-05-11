import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // This function simulates a login and takes you to your History page
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Later, you'll add your axios login call here
    navigate('/history'); 
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans overflow-hidden relative text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_70%)]"></div>

      <div className="relative w-full max-w-[450px] z-10">
        {/* Toggle Switcher */}
        <div className="flex bg-slate-900/50 backdrop-blur-xl p-1 rounded-2xl mb-8 border border-slate-800">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${isLogin ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            <LogIn size={18} /> Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${!isLogin ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            <UserPlus size={18} /> Register
          </button>
        </div>

        {/* Sliding Form Container */}
        <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-[32px] p-8 min-h-[480px]">
          
          {/* LOGIN FORM */}
          <div className={`transition-all duration-500 ease-in-out absolute inset-8 ${isLogin ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0 pointer-events-none'}`}>
            <h2 className="text-3xl font-black mb-2 italic">Blue Marble</h2>
            <p className="text-slate-400 text-sm mb-8">Access your global wealth.</p>
            <form onSubmit={handleAuth} className="space-y-5">
              <input type="email" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="Email" />
              <input type="password" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="Password" />
              <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 transition-all">
                Sign In <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* REGISTER FORM */}
          <div className={`transition-all duration-500 ease-in-out absolute inset-8 ${!isLogin ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'}`}>
            <h2 className="text-3xl font-black mb-2">Create Account</h2>
            <p className="text-slate-400 text-sm mb-8">Join the global network.</p>
            <form onSubmit={handleAuth} className="space-y-4">
              <input className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none" placeholder="Full Name" />
              <input className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none" placeholder="Email" />
              <input type="password" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none" placeholder="Password" />
              <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold mt-2 transition-all">
                Get Started
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;