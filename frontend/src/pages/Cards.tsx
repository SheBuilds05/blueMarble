import React from 'react';
import { CreditCard, ShieldCheck, Eye, Lock, Plus, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav'; // Import the BottomNav component

const Cards = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#052ce0] to-[#031ba3] text-white px-6 pt-12 pb-44">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">My Cards</h1>
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">Manage your physical and virtual cards</p>
        </div>
        <button className="bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20 active:scale-90 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      {/* The Platinum Card (Matches blueMarble branding) */}
      <div className="relative w-full aspect-[1.586/1] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 text-[#052ce0] overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#052ce0]/5 rounded-full -mr-20 -mt-20" />
        
        <div className="flex justify-between items-start mb-12">
          <div className="z-10">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#052ce0]/40 mb-1">Platinum Member</p>
            <h2 className="text-2xl font-black italic tracking-tight">Deolyn East</h2>
          </div>
          <div className="w-14 h-10 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-lg shadow-md" />
        </div>

        <div className="mb-8 z-10">
          <p className="text-xl font-mono tracking-[0.25em] font-bold">**** **** **** 4717</p>
        </div>

        <div className="flex justify-between items-end z-10">
          <div className="flex gap-8">
            <div>
              <p className="text-[8px] uppercase font-black opacity-30">Expiry</p>
              <p className="text-sm font-black">12 / 28</p>
            </div>
            <div>
              <p className="text-[8px] uppercase font-black opacity-30">CVV</p>
              <p className="text-sm font-black">***</p>
            </div>
          </div>
          <CreditCard size={35} strokeWidth={1.5} className="opacity-80" />
        </div>
      </div>

      {/* Card Management Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-4 ml-2">Card Security</h3>
        
        <ControlItem icon={<Eye size={20} />} label="View Card Details" />
        <ControlItem icon={<Lock size={20} />} label="Freeze Card" isToggle />
        <ControlItem icon={<ShieldCheck size={20} />} label="Atm Limits" />
      </div>

      {/* Navigation Bar */}
      <BottomNav />
    </div>
  );
};

const ControlItem = ({ icon, label, isToggle = false }: { icon: any, label: string, isToggle?: boolean }) => (
  <button className="w-full flex justify-between items-center p-5 bg-white/10 backdrop-blur-2xl rounded-[2.2rem] border border-white/10 hover:bg-white/15 transition-all active:scale-[0.98]">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/10 rounded-2xl text-white">
        {icon}
      </div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
    {isToggle ? (
      <div className="w-11 h-6 bg-white/20 rounded-full relative">
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
      </div>
    ) : (
      <ChevronRight size={18} className="opacity-40" />
    )}
  </button>
);

export default Cards;