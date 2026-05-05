import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, ChevronRight, Landmark, ShieldCheck } from 'lucide-react';
import AddBeneficiaryPopup from '../components/AddBeneficiaryPopup';
import PaymentSuccess from '../components/PaymentSuccess';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [view, setView] = useState<'list' | 'pay-details' | 'success'>('list');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [userAccount, setUserAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    try {
      const benRes = await fetch('https://bluemarble.onrender.com/api/auth/beneficiaries', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (benRes.ok) {
        const benData = await benRes.json();
        setBeneficiaries(benData);
      }

      const accRes = await fetch('https://bluemarble.onrender.com/api/auth/accounts', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (accRes.ok) {
        const accData = await accRes.json();
        setUserAccount(accData[0]);
      }
    } catch (error) {
      console.error("Failed to load payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePayClick = (person: any) => {
    setSelectedRecipient(person);
    setAmount(''); 
    setReference('');
    setView('pay-details');
  };

  const handleFinalPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsProcessing(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('https://bluemarble.onrender.com/api/auth/pay', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          reference: reference || 'Bank Transfer',
          beneficiaryId: selectedRecipient._id 
        })
      });

      if (response.ok) {
        setView('success');
        loadData();
      }
    } catch (error) {
      console.error("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#002a8f] text-white">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="font-black text-xs uppercase tracking-[0.3em]">Authenticating Gateway</p>
      </div>
    );
  }

  if (view === 'success') {
    return (
      <PaymentSuccess 
        amount={amount}
        recipient={selectedRecipient?.name || 'Beneficiary'}
        reference={reference || 'Bank Transfer'}
        onClose={() => setView('list')}
      />
    );
  }

  // --- VIEW: PAYMENT DETAILS ---
  if (view === 'pay-details') {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center p-6">
          <button onClick={() => setView('list')} className="p-2 bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
          <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">Payment Detail</h1>
          <div className="w-10" /> 
        </header>

        <main className="p-6 space-y-8 max-w-md mx-auto">
          {/* FROM SECTION */}
          <section className="space-y-3">
            <label className="text-[10px] font-black text-[#002a8f] uppercase tracking-[0.2em] ml-2">Source Account</label>
            <div className="bg-white p-5 rounded-[2rem] border border-slate-50 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#002a8f] rounded-2xl flex items-center justify-center text-white">
                  <Landmark size={20} />
                </div>
                <div>
                  <p className="font-black text-[#000000] text-sm uppercase">{userAccount?.type || 'Savings'}</p>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider">BALANCE: {userAccount?.balance || 'R 0.00'}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </section>

          {/* TO & AMOUNT SECTION */}
          <section className="space-y-3">
            <label className="text-[10px] font-black text-[#002a8f] uppercase tracking-[0.2em] ml-2">Destination</label>
            <div className="bg-white rounded-[2.5rem] border border-slate-50 overflow-hidden shadow-sm">
              <div className="p-6 flex items-center gap-4 border-b border-slate-50">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs">
                  {selectedRecipient?.initials}
                </div>
                <div>
                  <p className="font-black text-[#000000] text-sm uppercase">{selectedRecipient?.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider">{selectedRecipient?.detail}</p>
                </div>
              </div>
              
              <div className="flex items-center p-8 bg-slate-50/50">
                <span className="text-3xl font-black text-[#002a8f] mr-4">R</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-transparent text-5xl font-black text-[#000000] outline-none placeholder:text-slate-200"
                />
              </div>
            </div>
          </section>

          {/* REFERENCE */}
          <section className="space-y-3">
            <label className="text-[10px] font-black text-[#002a8f] uppercase tracking-[0.2em] ml-2">Recipient Reference</label>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
              <input 
                type="text" 
                placeholder="Enter description"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full bg-transparent outline-none font-bold text-sm text-[#000000] uppercase tracking-wider" 
              />
            </div>
            <div className="flex gap-2 items-center px-4">
               <ShieldCheck size={14} className="text-emerald-500" />
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Real-time cleared transfer</p>
            </div>
          </section>

          <button 
            onClick={handleFinalPayment}
            disabled={isProcessing || !amount}
            className="w-full bg-[#002a8f] text-white font-black py-6 rounded-[2rem] shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
          >
            {isProcessing ? 'Processing Gateway...' : 'Confirm & Pay'}
          </button>
        </main>
      </div>
    );
  }

  // --- VIEW: MAIN LIST ---
  return (
    <div className="min-h-screen bg-[#002a8f]">
      <header className="flex items-center justify-between p-8 text-white">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
          <X size={20} />
        </button>
        <h1 className="text-xs font-black uppercase tracking-[0.4em]">Beneficiaries</h1>
        <div className="w-10" />
      </header>

      <main className="px-6 space-y-8 max-w-lg mx-auto">
        <button 
          onClick={() => setShowAddPopup(true)}
          className="w-full bg-white text-[#002a8f] rounded-[2.5rem] p-8 flex items-center gap-5 shadow-2xl active:scale-95 transition-all group"
        >
          <div className="w-14 h-14 bg-[#002a8f] text-white rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-90">
            <Plus size={24} strokeWidth={3} />
          </div>
          <div className="text-left">
            <span className="block font-black text-sm uppercase tracking-wider">New Recipient</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add to your list</span>
          </div>
        </button>

        <div className="space-y-4">
          {beneficiaries.length > 0 ? (
            beneficiaries.map((person, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-6 flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white text-[#002a8f] rounded-2xl flex items-center justify-center font-black text-sm">
                    {person.initials}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm uppercase tracking-wide">{person.name}</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{person.detail}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handlePayClick(person)}
                  className="bg-white text-[#002a8f] px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  Pay
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-white/20 rounded-[3rem]">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">No saved beneficiaries</p>
            </div>
          )}
        </div>
      </main>

      {showAddPopup && (
        <AddBeneficiaryPopup 
          onClose={() => {
            setShowAddPopup(false);
            loadData();
          }} 
        />
      )}

      {/* Brand Footer */}
      <div className="fixed bottom-10 left-0 right-0 text-center opacity-20">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">blueMarble Global</p>
      </div>
    </div>
  );
};

export default PaymentPage;