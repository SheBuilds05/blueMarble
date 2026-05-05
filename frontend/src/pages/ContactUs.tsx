import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, Phone, Headphones, ShieldAlert, Star, MessageSquare } from 'lucide-react';

const ContactUs: React.FC = () => {
  const navigate = useNavigate();

  const directory = [
    { label: "Aspire Suite", value: "087 575 4653", icon: <Star size={18} /> },
    { label: "eBucks", value: "087 320 3200", icon: <MessageSquare size={18} /> },
    { label: "Fraud & Security", value: "087 575 9444", icon: <ShieldAlert size={18} /> },
  ];

  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/\s/g, '')}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32 overflow-x-hidden">
      {/* Signature High-Contrast Header */}
      <nav className="bg-[#002a8f] p-8 pb-16 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        {/* Subtle Brand Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        
        <div className="max-w-lg mx-auto flex justify-between items-center relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">Support Center</p>
            <h1 className="font-black text-white text-2xl uppercase tracking-tighter">Contact Us</h1>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto -mt-10 relative z-20">
        {/* Hero Card */}
        <div className="bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,42,143,0.1)] border border-slate-100 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[#002a8f] flex items-center justify-center text-white shadow-lg">
              <Headphones size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#000000] uppercase tracking-tighter leading-none">24/7 Priority Support</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Available worldwide</p>
            </div>
          </div>
        </div>

        {/* Directory List */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 mb-2">Departments</p>
          {directory.map((item, index) => (
            <div
              key={index}
              className="group bg-white border border-slate-100 rounded-[2.5rem] p-2 pl-6 flex justify-between items-center transition-all hover:border-[#002a8f]/20 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="text-[#002a8f] opacity-20 group-hover:opacity-100 transition-opacity">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-[9px] font-black text-[#002a8f] uppercase tracking-widest">
                    {item.label}
                  </h4>
                  <p className="text-lg font-black text-[#000000] tracking-tight">
                    {item.value}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleCall(item.value)}
                className="bg-[#002a8f] text-white w-16 h-16 rounded-[2rem] shadow-lg shadow-blue-100 flex items-center justify-center active:scale-95 transition-all"
              >
                <Phone size={20} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>

        {/* Informational Footer */}
        <div className="mt-12 text-center px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">
            Quality Assurance Mode Active
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-relaxed">
            Standard network rates apply. Calls are recorded for security purposes and to maintain our world-class service standards.
          </p>
        </div>

        {/* Brand Slogan */}
        <div className="text-center mt-16 mb-10 opacity-30">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-[2px] w-8 bg-[#002a8f]" />
            <span className="text-[10px] font-black text-[#000000] uppercase tracking-[0.4em]">blueMarble</span>
            <div className="h-[2px] w-8 bg-[#002a8f]" />
          </div>
          <p className="text-xs font-bold italic text-[#000000]">
            "Your World, Your Bank, Your Freedom."
          </p>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;