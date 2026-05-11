<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Gauge, Check } from 'lucide-react';
// 1. Import the BottomNav component
import BottomNav from '../components/BottomNav'; 

=======
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Gauge, Check, ShieldCheck, Snowflake, CreditCard, Loader2, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav'; 

// Using the relative path if you use the Proxy fix above
const API_BASE = "/api/cards"; 

>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
const Cards: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
<<<<<<< HEAD
  const [newLimit, setNewLimit] = useState("");

  const API_BASE = "https://supreme-space-meme-5gjwwgpq44pw37x65-5000.app.github.dev/api/cards";

  useEffect(() => { fetchCards(); }, []);

  const fetchCards = async () => {
=======
  const [newLimit, setNewLimit] = useState<string>(""); // Fixed: Initialize as empty string
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCards = useCallback(async () => {
    setLoading(true);
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    try {
      const res = await axios.get(API_BASE);
      setCards(res.data);
      if (res.data.length > 0) setSelectedCard(res.data[0]);
<<<<<<< HEAD
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
    // 2. Added pb-32 to prevent content from being cut off by the navbar
    <div className="p-6 bg-[#052ce0] min-h-screen text-white font-sans pb-32">
      <h1 className="text-3xl font-black italic uppercase mb-10 tracking-tighter">My Cards</h1>

      {/* Main Card Display */}
      <div className="mb-12 border-2 border-dashed border-white/20 rounded-[40px] p-6 flex justify-center">
        {selectedCard && (
          <div className={`relative overflow-hidden p-8 rounded-[35px] w-full shadow-2xl transition-all duration-500 ${selectedCard.status === 'Frozen' ? 'bg-gray-200 grayscale' : 'bg-white text-blue-900'}`}>
            {selectedCard.status === 'Frozen' && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-900/10 backdrop-blur-[2px] z-10">
                <span className="bg-blue-900 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">Frozen</span>
              </div>
            )}
            <div className="flex justify-between mb-8 text-[10px] font-black uppercase opacity-40">
              <span>{selectedCard.tier}</span>
              <span className="italic font-bold text-lg">OpenBank</span>
            </div>
            <div className="text-2xl mb-10 tracking-[0.3em] font-mono font-bold text-center">
              •••• •••• •••• {selectedCard.lastFour || selectedCard.cardNumber?.slice(-4)}
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>{selectedCard.cardHolder}</span>
              <span>{selectedCard.expiry}</span>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 gap-4">
        <ControlBtn 
          icon={<Gauge size={20}/>} 
          label="ATM Limits" 
          onClick={() => {setNewLimit(selectedCard?.atmLimit); setShowLimitModal(true);}} 
        />
      </div>

      {/* LIMIT MODAL */}
      {showLimitModal && (
        <Modal title="ATM Daily Limit" onClose={() => setShowLimitModal(false)}>
          <p className="text-sm opacity-60 mb-6 text-blue-900">Adjust your maximum daily withdrawal amount.</p>
          <div className="relative mb-8">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold opacity-40">R</span>
            <input
              type="number"
              className="w-full bg-blue-50 p-5 pl-10 rounded-2xl text-xl font-black text-blue-900 outline-none"
=======
    } catch (err) {
      console.error("Connection to secure vault timed out.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCards(); }, [fetchCards]);

const handleUpdateLimit = async () => {
  // Guard against undefined selectedCard
  if (!selectedCard?._id) {
    alert("Error: No card selected.");
    return;
  }

  setIsUpdating(true);
  try {
    // Correct URL construction
    const res = await axios.patch(`${API_BASE}/${selectedCard._id}/limits`, {
      atmLimit: Number(newLimit)
    });
    
    setSelectedCard(res.data);
    setShowLimitModal(false);
  } catch (err) {
    console.error("Update failed. Check if backend route matches PATCH /:id/limits");
  } finally {
    setIsUpdating(false);
  }
};

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-32 relative">
      <nav className="bg-[#002a8f] p-8 pb-14 rounded-b-[3.5rem] shadow-2xl mb-8">
        <div className="max-w-lg mx-auto flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Security Center</p>
            <h1 className="font-black text-white text-2xl uppercase tracking-tighter">Card Manager</h1>
          </div>
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto -mt-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#002a8f] mb-2" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decrypting Data...</span>
          </div>
        ) : (
          <>
            <div className="mb-10">
              {selectedCard && (
                <div className={`relative overflow-hidden p-8 rounded-[3rem] w-full shadow-2xl aspect-[1.6/1] flex flex-col justify-between ${selectedCard.status === 'Frozen' ? 'bg-slate-300 grayscale' : 'bg-[#002a8f] text-white'}`}>
                  <div className="relative z-20 flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">{selectedCard.tier || 'Infinite'}</p>
                      <span className="italic font-black text-xl tracking-tighter">blueMarble</span>
                    </div>
                    <ShieldCheck size={20} className="opacity-80" />
                  </div>

                  {selectedCard.status === 'Frozen' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] z-30">
                      <div className="bg-white text-[#002a8f] px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <Snowflake size={14} /> Card Frozen
                      </div>
                    </div>
                  )}

                  <div className="relative z-20">
                    <div className="text-2xl mb-8 tracking-[0.25em] font-mono font-black text-center">
                      •••• •••• •••• {selectedCard.lastFour || selectedCard.cardNumber?.slice(-4)}
                    </div>
                    <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest opacity-80">
                      {/* Inside your card visual section */}
<div>
  <p className="opacity-40 text-[8px] mb-1">Expires</p>
  <span className="text-xs">{selectedCard.expiryDate}</span> {/* Changed from .expiry */}
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

            <div className="space-y-4">
              <ControlBtn 
                icon={<Gauge size={22} className="text-[#002a8f]"/>} 
                label="ATM Daily Limits" 
                sub={`Current: R${selectedCard?.atmLimit?.toLocaleString() || '0'}`}
                onClick={() => {
                    setNewLimit(selectedCard?.atmLimit?.toString() || "");
                    setShowLimitModal(true);
                }} 
              />
            </div>
          </>
        )}
      </main>

      {showLimitModal && (
        <Modal title="Limit Settings" onClose={() => !isUpdating && setShowLimitModal(false)}>
          <div className="relative mb-8">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#002a8f] text-xl">R</span>
            <input
              type="number"
              disabled={isUpdating}
              className="w-full bg-slate-50 p-6 pl-12 rounded-[2rem] text-2xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-[#002a8f]/10 transition-all"
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
            />
          </div>
<<<<<<< HEAD
          <button onClick={handleUpdateLimit} className="w-full bg-[#052ce0] text-white p-5 rounded-3xl font-black uppercase flex items-center justify-center gap-2">
            <Check size={20} /> Update Limit
=======
          <button 
            onClick={handleUpdateLimit} 
            disabled={isUpdating}
            className={`w-full p-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${isUpdating ? 'bg-slate-100 text-slate-400' : 'bg-[#002a8f] text-white active:scale-95'}`}
          >
            {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
            {isUpdating ? 'Saving...' : 'Confirm Update'}
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
          </button>
        </Modal>
      )}

<<<<<<< HEAD
      {/* 3. Add the BottomNav component */}
=======
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      <BottomNav />
    </div>
  );
};

<<<<<<< HEAD
const ControlBtn = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="w-full bg-white/10 p-6 rounded-3xl flex justify-between items-center border border-white/5 hover:bg-white/20 transition-all active:scale-95">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/10 rounded-xl">{icon}</div>
      <span className="font-bold uppercase text-[11px] tracking-widest">{label}</span>
    </div>
    <span className="opacity-40 text-2xl">&rsaquo;</span>
=======
const ControlBtn = ({ icon, label, sub, onClick }: any) => (
  <button onClick={onClick} className="w-full bg-white p-6 rounded-[2.5rem] flex justify-between items-center shadow-sm border border-slate-100 hover:border-[#002a8f]/20 transition-all active:scale-95 text-left group">
    <div className="flex items-center gap-5">
      <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">{icon}</div>
      <div>
        <span className="font-black uppercase text-xs tracking-tighter text-slate-900 block">{label}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{sub}</span>
      </div>
    </div>
    <ChevronRight size={20} className="text-[#002a8f] opacity-20 group-hover:opacity-100 transition-all" />
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  </button>
);

const Modal = ({ title, children, onClose }: any) => (
<<<<<<< HEAD
  <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
    <div className="bg-white text-blue-900 w-full max-w-sm rounded-[40px] p-10 relative animate-in fade-in zoom-in duration-300">
      <button onClick={onClose} className="absolute top-6 right-8 text-3xl opacity-20 hover:opacity-100">&times;</button>
      <h2 className="text-xl font-black italic uppercase mb-8 border-b pb-4 tracking-tighter">{title}</h2>
=======
  <div className="fixed inset-0 bg-[#001d66]/80 backdrop-blur-md flex items-end sm:items-center justify-center z-[10000] p-4">
    <div className="bg-white text-slate-900 w-full max-w-sm rounded-[3.5rem] p-10 relative shadow-2xl">
      <button onClick={onClose} className="absolute top-8 right-10 text-2xl text-slate-300 hover:text-slate-900">&times;</button>
      <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-[#002a8f] border-b border-slate-100 pb-4">{title}</h2>
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      {children}
    </div>
  </div>
);

export default Cards;