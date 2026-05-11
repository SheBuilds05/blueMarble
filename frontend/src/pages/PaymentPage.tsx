import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
=======
import { X, Plus, ChevronRight, Landmark, ShieldCheck } from 'lucide-react';
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
import AddBeneficiaryPopup from '../components/AddBeneficiaryPopup';
import PaymentSuccess from '../components/PaymentSuccess';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  
<<<<<<< HEAD
  // 1. Fixed: Combined and updated view state
=======
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  const [view, setView] = useState<'list' | 'pay-details' | 'success'>('list');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  
<<<<<<< HEAD
  // Payment States
=======
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

<<<<<<< HEAD
  // States for backend data
=======
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [userAccount, setUserAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const token = localStorage.getItem('token');
<<<<<<< HEAD
    const headers = { 'Authorization': `Bearer :token` }; // Using standard backticks for headers

    try {
      const benRes = await fetch('http://localhost:5000/api/auth/beneficiaries', { 
=======
    try {
      const benRes = await fetch('https://bluemarble.onrender.com/api/auth/beneficiaries', { 
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (benRes.ok) {
        const benData = await benRes.json();
        setBeneficiaries(benData);
      }

<<<<<<< HEAD
      const accRes = await fetch('http://localhost:5000/api/auth/accounts', { 
=======
      const accRes = await fetch('https://bluemarble.onrender.com/api/auth/accounts', { 
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
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
<<<<<<< HEAD
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
=======
    if (!amount || parseFloat(amount) <= 0) return;
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35

    setIsProcessing(true);
    const token = localStorage.getItem('token');
    
    try {
<<<<<<< HEAD
      const response = await fetch('http://localhost:5000/api/auth/pay', {
=======
      const response = await fetch('https://bluemarble.onrender.com/api/auth/pay', {
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          reference: reference || 'Bank Transfer',
<<<<<<< HEAD
          beneficiaryId: selectedRecipient._id // Added this so backend knows who you paid
=======
          beneficiaryId: selectedRecipient._id 
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        })
      });

      if (response.ok) {
<<<<<<< HEAD
        setView('success'); // Switch to success screen
        loadData(); // Update balance in background
      } else {
        const data = await response.json();
        alert(data.message || "Payment failed");
      }
    } catch (error) {
      alert("Server error. Please check your connection.");
=======
        setView('success');
        loadData();
      }
    } catch (error) {
      console.error("Payment failed");
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    } finally {
      setIsProcessing(false);
    }
  };

<<<<<<< HEAD
  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-white bg-blue-600">Syncing Secure Payments...</div>;

  // --- 2. Fixed: Moved Success View to its own return block ---
=======
  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#002a8f] text-white">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="font-black text-xs uppercase tracking-[0.3em]">Authenticating Gateway</p>
      </div>
    );
  }

>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
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
<<<<<<< HEAD
      <div className="min-h-screen bg-[#f4f7f9] pb-10">
        <header className="sticky top-0 bg-[#f4f7f9] z-10 flex justify-between items-center p-6 border-b border-white">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="text-blue-600 text-2xl font-light">✕</button>
            <h1 className="text-lg font-bold text-slate-800">Payment Details</h1>
          </div>
          <button 
            onClick={handleFinalPayment}
            disabled={isProcessing}
            className="text-blue-600 font-bold text-xs border border-blue-600 px-4 py-1.5 rounded uppercase tracking-wider disabled:opacity-50"
          >
            {isProcessing ? 'Wait...' : 'Review'}
          </button>
        </header>

        <main className="p-6 space-y-6 max-w-md mx-auto">
          <section className="space-y-2">
            <p className="text-blue-800 font-bold text-[10px] uppercase tracking-[0.1em]">From</p>
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {userAccount?.type?.[0] || 'S'}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{userAccount?.type?.toUpperCase() || 'SAVINGS'}</p>
                  <p className="text-[11px] text-slate-500">{userAccount?.mask || '****'}</p>
                  <p className="text-[10px] font-bold text-slate-800">
                    Available balance <span className="text-slate-500 font-medium ml-1">{userAccount?.balance || 'R 0.00'}</span>
                  </p>
                </div>
              </div>
              <span className="text-slate-300">〉</span>
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-blue-800 font-bold text-[10px] uppercase tracking-[0.1em]">To</p>
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-4 flex items-center gap-3 border-b border-slate-50">
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {selectedRecipient?.initials}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{selectedRecipient?.name}</p>
                  <p className="text-[11px] text-slate-500">Account: {selectedRecipient?.detail}</p>
                </div>
              </div>
              
              <div className="flex items-stretch bg-white">
                <div className="bg-blue-600 text-white px-6 flex items-center text-2xl font-medium">R</div>
=======
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
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
<<<<<<< HEAD
                  className="w-full p-5 text-3xl font-bold text-blue-600 outline-none placeholder:text-blue-200"
=======
                  className="w-full bg-transparent text-5xl font-black text-[#000000] outline-none placeholder:text-slate-200"
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
                />
              </div>
            </div>
          </section>

<<<<<<< HEAD
          <section className="bg-white p-6 rounded-xl border border-slate-100 space-y-4 shadow-sm">
            <div className="border-b border-slate-100 pb-2">
              <label className="text-[10px] font-bold text-blue-600 uppercase">Their reference</label>
              <input 
                type="text" 
                placeholder="Reference for recipient"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full bg-transparent p-1 outline-none font-medium text-slate-800" 
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
               <p className="text-[10px] text-blue-700 font-medium">
                 This transfer will be processed immediately to the bank account ending in {selectedRecipient?.detail?.slice(-4)}.
               </p>
            </div>
          </section>
=======
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
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        </main>
      </div>
    );
  }

  // --- VIEW: MAIN LIST ---
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 pb-32">
      <header className="flex items-center justify-between p-6 text-white">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-2xl font-light">✕</button>
          <h1 className="text-xl font-bold">Pay</h1>
        </div>
      </header>

      <main className="px-6 space-y-6 max-w-lg mx-auto">
        <div className="space-y-4">
          <h2 className="font-bold text-white text-lg px-2">Your beneficiaries</h2>
          
          <button 
            onClick={() => setShowAddPopup(true)}
            className="w-full bg-white/95 rounded-2xl p-6 flex items-center gap-4 shadow-xl active:scale-95 transition-all"
          >
            <div className="w-10 h-10 border-2 border-dashed border-blue-600 rounded-full flex items-center justify-center text-blue-600">+</div>
            <span className="font-bold text-blue-600">Add new beneficiary</span>
          </button>

          <div className="space-y-3">
            {beneficiaries.length > 0 ? (
              beneficiaries.map((person, i) => (
                <div key={i} className="bg-white/95 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-800">
                      {person.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{person.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{person.detail}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePayClick(person)}
                    className="border-2 border-blue-600 text-blue-600 px-5 py-1.5 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                  >
                    PAY
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white/10 rounded-2xl border border-dashed border-white/30 text-white/70">
                No beneficiaries added yet.
              </div>
            )}
          </div>
=======
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
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
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
<<<<<<< HEAD
=======

      {/* Brand Footer */}
      <div className="fixed bottom-10 left-0 right-0 text-center opacity-20">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">blueMarble Global</p>
      </div>
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    </div>
  );
};

export default PaymentPage;