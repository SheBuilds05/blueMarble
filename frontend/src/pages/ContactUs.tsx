import React from 'react';
import { X, ChevronLeft, Phone } from 'lucide-react';

const ContactUs: React.FC = () => {
  const directory = [
    { label: "Aspire Suite", value: "087 575 4653" },
    { label: "eBucks", value: "087 320 3200" },
    { label: "Fraud", value: "087 575 9444" },
  ];

  const handleCall = (label: string, number: string) => {
    window.location.href = `tel:${number.replace(/\s/g, '')}`;
  };

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #93c5fd 100%)' }}>
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 max-w-4xl mx-auto">
        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold tracking-wide">Contact us</h2>
        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
          <X size={20} />
        </button>
      </div>

      <div className="px-6 max-w-2xl mx-auto mt-4">
        {/* Glass card */}
        <div className="rounded-3xl p-8 shadow-2xl" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.25)' }}>
          
          {/* Icon + title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Phone size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Call us</h3>
              <p className="text-sm text-blue-100/70">We're available 24/7</p>
            </div>
          </div>

          <div className="space-y-3">
            {directory.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center rounded-2xl px-5 py-4 transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <div>
                  <h4 className="text-base font-semibold text-white">{item.label}</h4>
                  <p className="text-sm text-blue-100/70 mt-0.5">{item.value}</p>
                </div>
                <button
                  onClick={() => handleCall(item.label, item.value)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                  style={{ background: '#1d4ed8', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', boxShadow: '0 4px 15px rgba(29,78,216,0.4)' }}
                >
                  <Phone size={14} />
                  Call
                </button>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-blue-100/50 mt-8">
            Standard call rates apply. Calls may be recorded for security purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;