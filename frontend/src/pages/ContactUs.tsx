import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, Phone, Headphones } from 'lucide-react';

const ContactUs: React.FC = () => {
  const navigate = useNavigate();

  const directory = [
    { label: "Aspire Suite", value: "087 575 4653" },
    { label: "eBucks", value: "087 320 3200" },
    { label: "Fraud", value: "087 575 9444" },
  ];

  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/\s/g, '')}`;
  };

  return (
    /* FIXED: Expanded to w-full for edge-to-edge layout and updated gradients */
    <div 
      className="min-h-screen w-full pb-32 overflow-x-hidden"
      style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}
    >
      {/* Header - Aligned with the dashboard container padding */}
      <div className="flex justify-between items-center px-6 py-8 md:px-12 mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight drop-shadow-md">Contact Us</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90"
        >
          <X size={20} />
        </button>
      </div>

      <main className="px-6 md:px-12 max-w-5xl mx-auto">
        {/* Main Contact Card - Enhanced Glassmorphism */}
        <div className="bg-white/30 backdrop-blur-2xl border border-white/40 p-10 md:p-14 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
          
          {/* Hero Section */}
          <div className="flex items-center gap-6 mb-12">
            <div 
              className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl rotate-3"
              style={{ background: 'linear-gradient(135deg, #052ce0, #2563eb)', border: '4px solid rgba(255,255,255,0.4)' }}
            >
              <Headphones size={32} />
            </div>
            <div>
              <h3 className="text-4xl font-black text-white tracking-tight">Call Us</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 mt-2">
                Available 24/7 Global Support
              </p>
            </div>
          </div>

          {/* Directory List */}
          <div className="space-y-6">
            {directory.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] px-8 py-6 hover:bg-white/20 hover:border-white/40 transition-all group cursor-default"
              >
                <div>
                  <h4 className="text-[11px] font-black text-[#052ce0] uppercase tracking-[0.25em] mb-2 drop-shadow-sm">
                    {item.label}
                  </h4>
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {item.value}
                  </p>
                </div>
                <button
                  onClick={() => handleCall(item.value)}
                  className="bg-[#052ce0] hover:brightness-110 text-white p-5 rounded-[1.5rem] shadow-xl shadow-blue-900/30 active:scale-90 transition-all group-hover:scale-105"
                >
                  <Phone size={22} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>

          {/* Legal Note */}
          <p className="text-center text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mt-16 leading-loose max-w-md mx-auto">
            Standard network rates apply. <br /> 
            All interactions are recorded to ensure quality of service and security.
          </p>
        </div>

        {/* Brand Slogan Footer */}
        <div className="text-center mt-20 mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-14 bg-white/30" />
            <span className="text-[14px] font-black text-white/60 uppercase tracking-[0.5em]">blueMarble</span>
            <div className="h-[1px] w-14 bg-white/30" />
          </div>
          <p className="text-base md:text-lg text-white font-semibold italic tracking-wide drop-shadow-sm">
            "Your World, Your Bank, Your Freedom."
          </p>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;