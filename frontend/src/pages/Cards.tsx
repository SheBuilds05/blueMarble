import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Gauge, Check } from 'lucide-react';

const Cards: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [newLimit, setNewLimit] = useState("");

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
    <div className="p-6 bg-[#052ce0] min-h-screen text-white font-sans">
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

      {/* Control Panel - Only ATM Limits remains */}
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
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
            />
          </div>
          <button onClick={handleUpdateLimit} className="w-full bg-[#052ce0] text-white p-5 rounded-3xl font-black uppercase flex items-center justify-center gap-2">
            <Check size={20} /> Update Limit
          </button>
        </Modal>
      )}
    </div>
  );
};

const ControlBtn = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="w-full bg-white/10 p-6 rounded-3xl flex justify-between items-center border border-white/5 hover:bg-white/20 transition-all active:scale-95">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/10 rounded-xl">{icon}</div>
      <span className="font-bold uppercase text-[11px] tracking-widest">{label}</span>
    </div>
    <span className="opacity-40 text-2xl">&rsaquo;</span>
  </button>
);

const Modal = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
    <div className="bg-white text-blue-900 w-full max-w-sm rounded-[40px] p-10 relative animate-in fade-in zoom-in duration-300">
      <button onClick={onClose} className="absolute top-6 right-8 text-3xl opacity-20 hover:opacity-100">&times;</button>
      <h2 className="text-xl font-black italic uppercase mb-8 border-b pb-4 tracking-tighter">{title}</h2>
      {children}
    </div>
  </div>
);

export default Cards;