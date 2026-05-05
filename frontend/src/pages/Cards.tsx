import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Gauge, Check, ShieldCheck, Snowflake, CreditCard } from 'lucide-react';
import BottomNav from '../components/BottomNav'; 

const Cards: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [newLimit, setNewLimit] = useState("");

  const DASHBOARD_BLUE = "#002a8f";
  const API_BASE = "https://supreme-space-meme-5gjwwgpq44pw37x65-5000.app.github.dev/api/cards";

  useEffect(() => { fetchCards(); }, []);

  const fetchCards = async () => {
    try {
      const res = await axios.get(API_BASE);
      setCards(res.data);
      if (res.data.length > 0) setSelectedCard(res.data[0]);
    } catch (err) { console.error("Database fetch failed."); }
  };

  const handleUpdateLimit = async () => {
    try {
      const res = await axios.patch(`${API_BASE}/${selectedCard._id}/limits`, {
        atmLimit: Number(newLimit)
      });
      setSelectedCard(res.data);
      setShowLimitModal(false);
    } catch (err) { alert("Failed to update limits"); }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-32 relative">
      {/* Header Styled like Dashboard/Accounts */}
      <nav className="bg-[#002a8f] p-8 pb-14 rounded-b-[3.5rem] shadow-2xl mb-8">
        <div className="max-w-lg mx-auto flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Security Center</p>
            <h1 className="font-black text-white text-2xl uppercase tracking-tighter">Card Manager</h1>
          </div>
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto -mt-10">
        {/* Main Card Display */}
        <div className="mb-10">
          {selectedCard && (
            <div className={`relative overflow-hidden p-8 rounded-[3rem] w-full shadow-[0_25px_60px_rgba(0,42,143,0.3)] transition-all duration-500 aspect-[1.6/1] flex flex-col justify-between ${selectedCard.status === 'Frozen' ? 'bg-slate-300 grayscale' : 'bg-[#002a8f] text-white border border-white/10'}`}>
              
              {/* Card Decoration */}
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl" />

              <div className="relative z-20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">{selectedCard.tier || 'Platinum'}</p>
                    <span className="italic font-black text-xl tracking-tighter">blueMarble</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                    <ShieldCheck size={20} className="text-white/80" />
                  </div>
                </div>
              </div>

              {selectedCard.status === 'Frozen' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[4px] z-30">
                  <div className="bg-white text-[#002a8f] px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2">
                    <Snowflake size={14} /> Card Frozen
                  </div>
                </div>
              )}

              <div className="relative z-20">
                <div className="text-2xl mb-8 tracking-[0.25em] font-mono font-black text-center">
                  •••• •••• •••• {selectedCard.lastFour || selectedCard.cardNumber?.slice(-4)}
                </div>
                
                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest opacity-80">
                  <div>
                    <p className="opacity-40 text-[8px] mb-1">Card Holder</p>
                    <span className="tracking-tighter text-xs">{selectedCard.cardHolder}</span>
                  </div>
                  <div className="text-right">
                    <p className="opacity-40 text-[8px] mb-1">Expires</p>
                    <span className="text-xs">{selectedCard.expiry}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Panel Grid */}
        <div className="grid grid-cols-1 gap-4">
          <ControlBtn 
            icon={<Gauge size={22} className="text-[#002a8f]"/>} 
            label="ATM Daily Limits" 
            sub="Set withdrawal boundaries"
            onClick={() => {setNewLimit(selectedCard?.atmLimit); setShowLimitModal(true);}} 
          />
          <ControlBtn 
            icon={<ShieldCheck size={22} className="text-[#002a8f]"/>} 
            label="Online Transactions" 
            sub="Manage e-commerce access"
            onClick={() => {}} 
          />
        </div>
      </main>

      {/* LIMIT MODAL */}
      {showLimitModal && (
        <Modal title="Limit Settings" onClose={() => setShowLimitModal(false)}>
          <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-6 text-[#000000]">ATM Daily Limit</p>
          <div className="relative mb-8">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#002a8f] text-xl">R</span>
            <input
              type="number"
              className="w-full bg-slate-50 p-6 pl-12 rounded-[2rem] text-2xl font-black text-[#000000] outline-none ring-4 ring-slate-100/50 focus:ring-[#002a8f]/10"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
            />
          </div>
          <button onClick={handleUpdateLimit} className="w-full bg-[#002a8f] text-white p-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3">
            <Check size={20} /> Update Limit
          </button>
        </Modal>
      )}

      <BottomNav />
    </div>
  );
};

const ControlBtn = ({ icon, label, sub, onClick }: any) => (
  <button onClick={onClick} className="w-full bg-white p-6 rounded-[2.5rem] flex justify-between items-center shadow-sm border border-slate-100 hover:shadow-md hover:border-[#002a8f]/20 transition-all active:scale-95 text-left">
    <div className="flex items-center gap-5">
      <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
      <div>
        <span className="font-black uppercase text-xs tracking-tighter text-[#000000] block">{label}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{sub}</span>
      </div>
    </div>
    <span className="text-[#002a8f] opacity-20 text-3xl font-light">&rsaquo;</span>
  </button>
);

const Modal = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 bg-[#001d66]/80 backdrop-blur-md flex items-end sm:items-center justify-center z-[10000] p-4">
    <div className="bg-white text-[#000000] w-full max-w-sm rounded-[3.5rem] p-10 relative animate-in slide-in-from-bottom-10 duration-300 shadow-2xl">
      <button onClick={onClose} className="absolute top-8 right-10 text-2xl font-black opacity-20 hover:opacity-100 transition-opacity">&times;</button>
      <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-[#002a8f] border-b border-slate-100 pb-4">{title}</h2>
      {children}
    </div>
  </div>
);

export default Cards;