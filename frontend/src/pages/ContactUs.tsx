import React from 'react';
import { X, ChevronLeft } from 'lucide-react';

const ContactUs: React.FC = () => {
  const directory = [
    { label: "Aspire Suite", value: "087 575 4653", action: "Call" },
    { label: "eBucks", value: "087 320 3200", action: "Call" },
    { label: "Fraud", value: "087 575 9444", action: "Call" },
    { label: "Phonebook", value: "View all the numbers in our directory", action: "View" },
  ];

  const handleAction = (label: string) => {
    alert(`Connecting you to ${label}...`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-8">
        <ChevronLeft size={28} className="cursor-pointer" />
        <h2 className="text-xl font-bold">Contact us</h2>
        <X size={28} className="cursor-pointer" />
      </div>

      <div className="px-4 max-w-md mx-auto">
        <div className="bg-[#1C1C1E] rounded-[2rem] p-8 shadow-2xl border border-white/5">
          <h3 className="text-2xl font-bold mb-8">Call us</h3>
          
          <div className="space-y-10">
            {directory.map((item, index) => (
              <div key={index} className="flex justify-between items-center group">
                <div className="flex-1 pr-4">
                  <h4 className="text-lg font-bold text-gray-100">{item.label}</h4>
                  <p className="text-gray-500 text-sm mt-0.5">{item.value}</p>
                </div>
                <button 
                  onClick={() => handleAction(item.label)}
                  className="bg-[#FF6B00] hover:bg-[#E65A00] text-white px-7 py-2 rounded-full font-bold text-sm transition-all shadow-lg active:scale-90"
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;