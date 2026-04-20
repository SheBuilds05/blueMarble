import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cards: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeModal, setActiveModal] = useState(false);

  const API_URL = "https://supreme-space-meme-5gjwwgpq44pw37x65-5000.app.github.dev/cards";

  useEffect(() => { fetchCards(); }, []);

  const fetchCards = async () => {
    try {
      const res = await axios.get(API_URL);
      setCards(res.data);
      if (res.data.length > 0) setSelectedCard(res.data[0]);
    } catch (err) { console.error("Database fetch failed."); }
  };

  // Button Handlers
  const handleFreeze = () => alert(`Card ending in ${selectedCard?.lastFour} has been frozen.`);
  const handleLimits = () => alert("Daily ATM limit: R5,000.00");

  return (
    <div className="p-6 bg-blue-700 min-h-screen text-white font-sans">
      <h1 className="text-3xl font-black italic uppercase mb-10">My Cards</h1>

      {/* Main Card Display */}
      <div className="mb-12 border-2 border-dashed border-blue-400/50 rounded-[40px] p-6 flex justify-center">
        {selectedCard && (
          <div className="bg-white text-blue-900 p-8 rounded-[35px] w-full shadow-2xl">
             <div className="flex justify-between mb-8 text-[10px] font-black uppercase opacity-40">
               <span>{selectedCard.tier}</span>
               <span className="text-blue-800 italic font-bold text-lg">OpenBank</span>
             </div>
             <div className="text-2xl mb-10 tracking-[0.3em] font-mono font-bold text-center">
                •••• •••• •••• {selectedCard.lastFour}
             </div>
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
               <span>{selectedCard.cardHolder}</span>
               <span>{selectedCard.expiry}</span>
             </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="space-y-4">
        <button onClick={() => setShowDetails(true)} className="w-full bg-white/10 p-6 rounded-3xl flex justify-between items-center border border-white/5 hover:bg-white/20 transition-all">
          <span className="font-bold uppercase text-[11px] tracking-widest">View Card Details</span>
          <span className="opacity-40 text-2xl">&rsaquo;</span>
        </button>

        <button onClick={handleFreeze} className="w-full bg-white/10 p-6 rounded-3xl flex justify-between items-center border border-white/5 hover:bg-white/20 transition-all">
          <span className="font-bold uppercase text-[11px] tracking-widest">Freeze Card</span>
          <span className="opacity-40 text-2xl">&rsaquo;</span>
        </button>

        <button onClick={handleLimits} className="w-full bg-white/10 p-6 rounded-3xl flex justify-between items-center border border-white/5 hover:bg-white/20 transition-all">
          <span className="font-bold uppercase text-[11px] tracking-widest">ATM Limits</span>
          <span className="opacity-40 text-2xl">&rsaquo;</span>
        </button>
      </div>

      {/* DETAILS POPUP (Direct from Database) */}
      {showDetails && selectedCard && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="bg-white text-blue-900 w-full max-w-sm rounded-[40px] p-10 relative shadow-2xl">
            <button onClick={() => setShowDetails(false)} className="absolute top-6 right-8 text-3xl opacity-20 hover:opacity-100 transition-opacity">&times;</button>
            
            <h2 className="text-xl font-black italic uppercase mb-8 border-b pb-4">Security Vault</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase opacity-40 mb-1">Card Holder</p>
                <p className="font-bold tracking-tight text-lg">{selectedCard.cardHolder}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-40 mb-1">Full Card Number</p>
                <p className="font-mono font-bold tracking-widest">{selectedCard.cardNumber}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-1">Expiry</p>
                  <p className="font-bold">{selectedCard.expiry}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-1">CVV</p>
                  <p className="font-bold text-red-500">{selectedCard.cvv}</p>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-1">Status</p>
                  <p className="font-bold text-green-600">{selectedCard.status || "Active"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-1">Type</p>
                  <p className="font-bold">{selectedCard.tier}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setShowDetails(false)} className="w-full bg-blue-900 text-white p-5 rounded-3xl font-black uppercase mt-10 hover:bg-blue-800">Done</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;