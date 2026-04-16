import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Globe, Loader2 } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // 3-second delay for the "initialization" state
const timer = setTimeout(() => {
      setIsInitializing(false);
      // Immediate navigation after loading finishes
      navigate('/login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.08),transparent_60%)]"></div>

      {/* Main Content Area */}
      <section className="relative flex flex-col items-center justify-center text-center z-10">
        
        {/* Branding Container - Always Visible */}
        <div className="animate-in fade-in zoom-in duration-1000">
          <div className="relative flex items-center justify-center w-[300px] h-[300px] md:w-[420px] md:h-[420px]">
            
            {/* Orbital Rings */}
            <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-[spin_30s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full border-t border-blue-400/20 animate-[spin_12s_linear_infinite_reverse]"></div>
            <div className="absolute inset-8 rounded-full border border-blue-500/5"></div>
            
            {/* Central Pulsing Aura */}
            <div className="absolute w-32 h-32 bg-blue-500/15 blur-[80px] rounded-full animate-pulse"></div>
            
            {/* Typography & Loader */}
            <div className="relative flex flex-col items-center animate-subtle-float">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl">
                <span className="text-white">Blue</span>
                <span className="text-blue-500 bg-clip-text text-transparent bg-gradient-to-b from-blue-300 to-blue-600">Marble</span>
              </h1>

              {/* Slogan */}
              <div className="mt-4 px-6 py-2 border-y border-blue-500/10 backdrop-blur-sm">
                <p className="text-xs md:text-sm font-medium tracking-[0.5em] uppercase text-blue-100/60 whitespace-nowrap">
                  "Your World, Your Wealth, Your Bank"
                </p>
              </div>

              {/* Loader - Positioned Below Slogan */}
              <div className={`mt-8 flex flex-col items-center gap-3 transition-opacity duration-500 ${isInitializing ? 'opacity-100' : 'opacity-0'}`}>
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-blue-400/40">
                  Secure System Initializing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Trust Bar */}
        <div className="absolute bottom-10 flex items-center justify-center gap-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-blue-500" /> 
            Global Network
          </span>
          <span className="w-1 h-1 bg-blue-900 rounded-full"></span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> 
            Tier 1 Security
          </span>
        </div>
      </section>

      {/* Global CSS Animations */}
      <style>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-subtle-float {
          animation: subtle-float 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
