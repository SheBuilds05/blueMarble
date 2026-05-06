import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Gauge, Check, ShieldCheck, Snowflake, CreditCard, Loader2, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav'; 

// Using the relative path if you use the Proxy fix above
const API_BASE = "/api/cards"; 

const Cards: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [newLimit, setNewLimit] = useState<string>(""); // Fixed: Initialize as empty string
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setCards(res.data);
      if (res.data.length > 0) setSelectedCard(res.data[0]);
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
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
            />
          </div>
          <button 
            onClick={handleUpdateLimit} 
            disabled={isUpdating}
            className={`w-full p-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${isUpdating ? 'bg-slate-100 text-slate-400' : 'bg-[#002a8f] text-white active:scale-95'}`}
          >
            {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
            {isUpdating ? 'Saving...' : 'Confirm Update'}
          </button>
        </Modal>
      )}

      <BottomNav />
    </div>
  );
};

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
  </button>
);

const Modal = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 bg-[#001d66]/80 backdrop-blur-md flex items-end sm:items-center justify-center z-[10000] p-4">
    <div className="bg-white text-slate-900 w-full max-w-sm rounded-[3.5rem] p-10 relative shadow-2xl">
      <button onClick={onClose} className="absolute top-8 right-10 text-2xl text-slate-300 hover:text-slate-900">&times;</button>
      <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-[#002a8f] border-b border-slate-100 pb-4">{title}</h2>
      {children}
    </div>
  </div>
);

export default Cards;