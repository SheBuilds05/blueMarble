import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { getUserAccounts, buyAirtime, buyElectricity, buyVoucher } from '../services/api';
=======
import { useNavigate } from 'react-router-dom';
import { getUserAccounts, buyAirtime, buyElectricity, buyVoucher } from '../services/api';
import BottomNav from '../components/BottomNav'; // Consistency with other pages
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35

interface Account {
  _id: string;
  type: string;
  mask: string;
  balance: string;
  color?: string;
}

const Buy = () => {
<<<<<<< HEAD
=======
  const navigate = useNavigate();
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [category, setCategory] = useState<'airtime' | 'electricity' | 'voucher'>('airtime');
  const [provider, setProvider] = useState('');
  const [phone, setPhone] = useState('');
  const [meter, setMeter] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

<<<<<<< HEAD
  // Load and Validate Accounts
=======
  const DASHBOARD_BLUE = "#002a8f";

>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  const loadAccounts = async () => {
    try {
      const response = await getUserAccounts();
      const rawData = Array.isArray(response.data) ? response.data : [];
<<<<<<< HEAD

=======
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      const validatedData = rawData.map((acc: any, index: number) => ({
        ...acc,
        _id: String(acc._id || acc.id || `buy-acc-${index}`),
        type: acc.type || 'Account',
        balance: acc.balance || 'R 0.00'
      }));
<<<<<<< HEAD

      setAccounts(validatedData);
      
=======
      setAccounts(validatedData);
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      if (validatedData.length > 0 && !selectedAccountId) {
        setSelectedAccountId(validatedData[0]._id);
      }
    } catch (err) {
<<<<<<< HEAD
      console.error('Failed to load accounts:', err);
      setMessage({ text: 'Failed to load accounts. Please refresh.', type: 'error' });
=======
      setMessage({ text: 'Failed to load accounts.', type: 'error' });
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    } finally {
      setLoadingAccounts(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    loadAccounts();
  }, []);

  // Robust parsing to handle "R 1,200.00" or "500"
=======
  useEffect(() => { loadAccounts(); }, []);

>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  const parseBalance = (balanceStr: string): number => {
    return parseFloat(String(balanceStr).replace(/[^\d.-]/g, '')) || 0;
  };

  const selectedAccount = accounts.find(acc => acc._id === selectedAccountId);
  const availableBalance = selectedAccount ? parseBalance(selectedAccount.balance) : 0;

  const handlePurchase = async () => {
    const numAmount = parseFloat(amount);
<<<<<<< HEAD
    
    if (!selectedAccountId) return setMessage({ text: 'Select an account', type: 'error' });
    if (!provider) return setMessage({ text: 'Select a provider', type: 'error' });
    if (category === 'airtime' && !phone) return setMessage({ text: 'Enter phone number', type: 'error' });
    if (category === 'electricity' && !meter) return setMessage({ text: 'Enter meter number', type: 'error' });
    if (category === 'voucher' && !email) return setMessage({ text: 'Enter email address', type: 'error' });
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return setMessage({ text: 'Enter a valid amount', type: 'error' });
    }
    
    if (numAmount > availableBalance) {
      return setMessage({ text: `Insufficient funds. Available: ${selectedAccount?.balance}`, type: 'error' });
    }
=======
    if (!selectedAccountId || !provider) return setMessage({ text: 'Selection missing', type: 'error' });
    if (isNaN(numAmount) || numAmount <= 0) return setMessage({ text: 'Invalid amount', type: 'error' });
    if (numAmount > availableBalance) return setMessage({ text: 'Insufficient funds', type: 'error' });
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35

    setIsLoading(true);
    try {
      let response;
<<<<<<< HEAD
      if (category === 'airtime') {
        response = await buyAirtime(provider, phone, numAmount);
      } else if (category === 'electricity') {
        response = await buyElectricity(provider, meter, numAmount);
      } else {
        response = await buyVoucher(provider, numAmount, email);
      }

      console.log('Purchase response:', response.data);
      
      // ✅ Update the local account balance with the new balance from response
      if (response.data && response.data.newBalance !== undefined) {
        setAccounts(prevAccounts => 
          prevAccounts.map(acc => 
            acc._id === selectedAccountId 
              ? { ...acc, balance: `R ${response.data.newBalance.toFixed(2)}` }
              : acc
          )
        );
      }
      
      // ✅ Also refresh accounts from backend to ensure consistency
      await loadAccounts();
      
      alert(`${category.toUpperCase()} purchase successful!`);
      
      // Reset Form
      setAmount('');
      setPhone('');
      setMeter('');
      setEmail('');
      
      setMessage({ text: 'Purchase completed successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      console.error('Purchase error:', error);
      setMessage({
        text: error.response?.data?.message || 'Purchase failed.',
        type: 'error',
      });
=======
      if (category === 'airtime') response = await buyAirtime(provider, phone, numAmount);
      else if (category === 'electricity') response = await buyElectricity(provider, meter, numAmount);
      else response = await buyVoucher(provider, numAmount, email);

      await loadAccounts();
      alert(`Purchase successful!`);
      setAmount(''); setPhone(''); setMeter(''); setEmail('');
      setMessage({ text: 'Success!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.response?.data?.message || 'Failed.', type: 'error' });
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  if (loadingAccounts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Loading accounts...</div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Accounts Found</h2>
          <p className="text-slate-600 mb-4">Please contact support to set up your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Buy Services</h1>
        </div>

        {/* Account Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pay From</label>
          <div className="grid grid-cols-2 gap-3">
            {accounts.map(acc => (
              <button
                key={`buy-pay-${acc._id}`}
                onClick={() => setSelectedAccountId(acc._id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedAccountId === acc._id ? 'border-blue-600 bg-blue-50' : 'border-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="text-xs font-bold text-slate-800">{acc.type}</div>
                <div className="text-sm font-bold text-blue-600">{acc.balance}</div>
=======
  if (loadingAccounts) return (
    <div className="min-h-screen flex items-center justify-center bg-[#001d66]">
      <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-32">
      {/* Dashboard Style Header */}
      <nav className="bg-[#002a8f] p-8 pb-14 rounded-b-[3.5rem] shadow-2xl">
        <div className="max-w-lg mx-auto flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white font-black">
            ←
          </button>
          <div>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Services</p>
            <h1 className="font-black text-white text-2xl uppercase tracking-tighter">Buy & Top-up</h1>
          </div>
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto -mt-8 space-y-6">
        {/* Account Selection Cards */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100">
          <label className="block text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.2em] mb-4 ml-2">Pay From</label>
          <div className="grid grid-cols-2 gap-3">
            {accounts.map(acc => (
              <button
                key={acc._id}
                onClick={() => setSelectedAccountId(acc._id)}
                className={`p-4 rounded-[2rem] text-left transition-all border-4 ${
                  selectedAccountId === acc._id ? 'border-[#002a8f] bg-[#002a8f] text-white' : 'border-slate-50 bg-slate-50 text-[#000000]'
                }`}
              >
                <div className={`text-[10px] font-black uppercase tracking-tighter ${selectedAccountId === acc._id ? 'text-white/60' : 'text-slate-400'}`}>{acc.type}</div>
                <div className="text-sm font-black mt-1 uppercase tracking-tighter">{acc.balance}</div>
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
              </button>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1 rounded-xl">
          {(['airtime', 'electricity', 'voucher'] as const).map(cat => (
            <button
              key={`cat-${cat}`}
              onClick={() => { setCategory(cat); setProvider(''); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                category === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
=======
        {/* Category Selection Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-3xl">
          {(['airtime', 'electricity', 'voucher'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setProvider(''); }}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                category === cat ? 'bg-[#002a8f] text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

<<<<<<< HEAD
        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-5">
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
=======
        {/* Main Purchase Form */}
        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 space-y-6">
          {message && (
            <div className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
              {message.text}
            </div>
          )}

          <div className="space-y-4">
<<<<<<< HEAD
            <select
              value={provider}
              onChange={e => setProvider(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm font-medium"
            >
              <option value="">Select Provider</option>
              {category === 'airtime' && ['MTN', 'Vodacom', 'Cell C', 'Telkom'].map(p => (
                <option key={`prov-${p}`} value={p}>{p}</option>
              ))}
              {category === 'electricity' && ['Eskom', 'City Power'].map(p => (
                <option key={`prov-${p}`} value={p}>{p}</option>
              ))}
              {category === 'voucher' && ['Netflix', 'Spotify', 'Amazon', 'Takealot', 'Google Play'].map(p => (
                <option key={`prov-${p}`} value={p}>{p}</option>
              ))}
            </select>

            {category === 'airtime' && (
              <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
            )}

            {category === 'electricity' && (
              <input type="text" placeholder="Meter Number" value={meter} onChange={e => setMeter(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
            )}

            {category === 'voucher' && (
              <input type="email" placeholder="Recipient Email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
            )}

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">R</span>
              <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-slate-50 rounded-2xl text-xl font-bold outline-none" />
=======
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Provider</label>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="w-full p-5 bg-slate-50 rounded-3xl font-black text-[#000000] uppercase text-sm border-none ring-2 ring-slate-100 focus:ring-[#002a8f] outline-none transition-all"
              >
                <option value="">Select Service</option>
                {category === 'airtime' && ['MTN', 'Vodacom', 'Cell C', 'Telkom'].map(p => <option key={p} value={p}>{p}</option>)}
                {category === 'electricity' && ['Eskom', 'City Power'].map(p => <option key={p} value={p}>{p}</option>)}
                {category === 'voucher' && ['Netflix', 'Spotify', 'Amazon', 'Google Play'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {category === 'airtime' && (
              <input type="tel" placeholder="PHONE NUMBER" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full p-5 bg-slate-50 rounded-3xl font-black text-[#000000] uppercase text-sm ring-2 ring-slate-100 outline-none" />
            )}

            {category === 'electricity' && (
              <input type="text" placeholder="METER NUMBER" value={meter} onChange={e => setMeter(e.target.value)}
                className="w-full p-5 bg-slate-50 rounded-3xl font-black text-[#000000] uppercase text-sm ring-2 ring-slate-100 outline-none" />
            )}

            {category === 'voucher' && (
              <input type="email" placeholder="RECIPIENT EMAIL" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full p-5 bg-slate-50 rounded-3xl font-black text-[#000000] uppercase text-sm ring-2 ring-slate-100 outline-none" />
            )}

            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#002a8f] text-xl">R</span>
              <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full pl-12 pr-6 py-6 bg-slate-50 rounded-3xl text-2xl font-black text-[#000000] outline-none ring-2 ring-slate-100" />
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
            </div>

            {/* Quick Amounts */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {[50, 100, 250, 500].map(amt => (
<<<<<<< HEAD
                <button key={`amt-${amt}`} onClick={() => setAmount(amt.toString())}
                  className="px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-full text-xs font-bold transition-all shrink-0">
=======
                <button key={amt} onClick={() => setAmount(amt.toString())}
                  className="px-6 py-3 bg-white border-2 border-slate-100 text-[#000000] rounded-full text-[10px] font-black uppercase tracking-widest hover:border-[#002a8f] transition-all shrink-0">
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
                  R{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handlePurchase}
              disabled={isLoading || !amount || !provider}
<<<<<<< HEAD
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : `Buy ${category.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>
=======
              className="w-full py-6 bg-[#002a8f] text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-30"
            >
              {isLoading ? 'Processing...' : `Confirm Purchase`}
            </button>
          </div>
        </div>
      </main>
      <BottomNav />
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    </div>
  );
};

export default Buy;