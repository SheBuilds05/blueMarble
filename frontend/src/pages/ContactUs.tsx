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
<div 
      className="min-h-screen px-6 py-8 md:px-12 max-w-4xl mx-auto pb-32"
      style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}
>
      {/* Header */}
<div className="flex justify-between items-center mb-10">
<button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90"
>
<ChevronLeft size={20} />
</button>
<h2 className="text-xl font-bold text-white tracking-tight">Contact Us</h2>
<button 
          onClick={() => navigate('/dashboard')}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90"
>
<X size={20} />
</button>
</div>
 
      <div className="max-w-2xl mx-auto">
        {/* Main Contact Card - Using Glassmorphism Dashboard Style */}
<div className="bg-white/30 backdrop-blur-xl border border-white/40 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          {/* Hero Section */}
<div className="flex items-center gap-6 mb-12">
<div 
              className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl rotate-3"
              style={{ background: 'linear-gradient(135deg, #052ce0, #2563eb)', border: '3px solid rgba(255,255,255,0.4)' }}
>
<Headphones size={28} />
</div>
<div>
<h3 className="text-3xl font-black text-white tracking-tight">Call Us</h3>
<p className="text-xs font-bold uppercase tracking-widest text-white/70 mt-1">
                We're available 24/7
</p>
</div>
</div>
 
          {/* Directory List */}
<div className="space-y-4">
            {directory.map((item, index) => (
<div
                key={index}
                className="flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] px-6 py-5 hover:bg-white/20 transition-all group"
>
<div>
<h4 className="text-[10px] font-black text-[#052ce0] uppercase tracking-[0.2em] mb-1">
                    {item.label}
</h4>
<p className="text-lg font-bold text-white tracking-tight">
                    {item.value}
</p>
</div>
<button
                  onClick={() => handleCall(item.value)}
                  className="bg-[#052ce0] hover:bg-blue-700 text-white p-4 rounded-2xl shadow-lg shadow-blue-900/20 active:scale-90 transition-all group-hover:scale-110"
>
<Phone size={18} fill="currentColor" />
</button>
</div>
            ))}
</div>
 
          {/* Legal Note */}
<p className="text-center text-[10px] font-bold text-white/40 uppercase tracking-widest mt-12 leading-relaxed">
            Standard call rates apply. <br /> 
            Calls may be recorded for security purposes.
</p>
</div>
 
        {/* Brand Slogan Footer */}
<div className="text-center mt-16 mb-8">
<div className="flex items-center justify-center gap-4 mb-4">
<div className="h-[1px] w-12 bg-white/20" />
<span className="text-[14px] font-black text-white/50 uppercase tracking-[0.4em]">
              blueMarble
</span>
<div className="h-[1px] w-12 bg-white/20" />
</div>
<p className="text-sm md:text-base text-white/80 font-semibold italic tracking-wide">
            "Your World, Your Bank, Your Freedom."
</p>
</div>
</div>
</div>
  );
};
 
export default ContactUs;