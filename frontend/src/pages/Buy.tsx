import React, { useState, useEffect } from 'react';
import { getUserAccounts, buyAirtime, buyElectricity, buyVoucher } from '../services/api';

interface Account {
  _id: string;
  type: string;
  mask: string;
  balance: string;
  color?: string;
}

const Buy = () => {
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

  // Load and Validate Accounts
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
      console.error('Failed to load accounts:', err);
      setMessage({ text: 'Failed to load accounts. Please refresh.', type: 'error' });
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // Robust parsing to handle "R 1,200.00" or "500"
  const parseBalance = (balanceStr: string): number => {
    return parseFloat(String(balanceStr).replace(/[^\d.-]/g, '')) || 0;
  };

  const selectedAccount = accounts.find(acc => acc._id === selectedAccountId);
  const availableBalance = selectedAccount ? parseBalance(selectedAccount.balance) : 0;

  const handlePurchase = async () => {
    const numAmount = parseFloat(amount);
    
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

    setIsLoading(true);
    try {
      let response;
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
    } finally {
      setIsLoading(false);
    }
  };

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
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1 rounded-xl">
          {(['airtime', 'electricity', 'voucher'] as const).map(cat => (
            <button
              key={`cat-${cat}`}
              onClick={() => { setCategory(cat); setProvider(''); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                category === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-5">
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4">
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
            </div>

            {/* Quick Amounts */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {[50, 100, 250, 500].map(amt => (
                <button key={`amt-${amt}`} onClick={() => setAmount(amt.toString())}
                  className="px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-full text-xs font-bold transition-all shrink-0">
                  R{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handlePurchase}
              disabled={isLoading || !amount || !provider}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : `Buy ${category.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;