import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAccounts, buyAirtime, buyElectricity, buyVoucher } from '../services/api';
import BottomNav from '../components/BottomNav'; // Consistency with other pages

interface Account {
  _id: string;
  type: string;
  mask: string;
  balance: string;
  color?: string;
}

const Buy = () => {
  const navigate = useNavigate();
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

  const DASHBOARD_BLUE = "#002a8f";

  const loadAccounts = async () => {
    try {
      const response = await getUserAccounts();
      const rawData = Array.isArray(response.data) ? response.data : [];
      const validatedData = rawData.map((acc: any, index: number) => ({
        ...acc,
        _id: String(acc._id || acc.id || `buy-acc-${index}`),
        type: acc.type || 'Account',
        balance: acc.balance || 'R 0.00'
      }));
      setAccounts(validatedData);
      if (validatedData.length > 0 && !selectedAccountId) {
        setSelectedAccountId(validatedData[0]._id);
      }
    } catch (err) {
      setMessage({ text: 'Failed to load accounts.', type: 'error' });
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => { loadAccounts(); }, []);

  const parseBalance = (balanceStr: string): number => {
    return parseFloat(String(balanceStr).replace(/[^\d.-]/g, '')) || 0;
  };

  const selectedAccount = accounts.find(acc => acc._id === selectedAccountId);
  const availableBalance = selectedAccount ? parseBalance(selectedAccount.balance) : 0;

  const handlePurchase = async () => {
    const numAmount = parseFloat(amount);
    if (!selectedAccountId || !provider) return setMessage({ text: 'Selection missing', type: 'error' });
    if (isNaN(numAmount) || numAmount <= 0) return setMessage({ text: 'Invalid amount', type: 'error' });
    if (numAmount > availableBalance) return setMessage({ text: 'Insufficient funds', type: 'error' });

    setIsLoading(true);
    try {
      let response;
      if (category === 'airtime') response = await buyAirtime(provider, phone, numAmount);
      else if (category === 'electricity') response = await buyElectricity(provider, meter, numAmount);
      else response = await buyVoucher(provider, numAmount, email);

      await loadAccounts();
      alert(`Purchase successful!`);
      setAmount(''); setPhone(''); setMeter(''); setEmail('');
      setMessage({ text: 'Success!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.response?.data?.message || 'Failed.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

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
              </button>
            ))}
          </div>
        </div>

        {/* Category Selection Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-3xl">
          {(['airtime', 'electricity', 'voucher'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setProvider(''); }}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                category === cat ? 'bg-[#002a8f] text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Purchase Form */}
        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 space-y-6">
          {message && (
            <div className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4">
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
            </div>

            {/* Quick Amounts */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {[50, 100, 250, 500].map(amt => (
                <button key={amt} onClick={() => setAmount(amt.toString())}
                  className="px-6 py-3 bg-white border-2 border-slate-100 text-[#000000] rounded-full text-[10px] font-black uppercase tracking-widest hover:border-[#002a8f] transition-all shrink-0">
                  R{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handlePurchase}
              disabled={isLoading || !amount || !provider}
              className="w-full py-6 bg-[#002a8f] text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-30"
            >
              {isLoading ? 'Processing...' : `Confirm Purchase`}
            </button>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Buy;