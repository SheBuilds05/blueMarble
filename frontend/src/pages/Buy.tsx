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

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await getUserAccounts();
        setAccounts(response.data);
        if (response.data.length > 0) {
          setSelectedAccountId(response.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load accounts:', err);
        setMessage({ text: 'Failed to load accounts. Please refresh.', type: 'error' });
      } finally {
        setLoadingAccounts(false);
      }
    };
    loadAccounts();
  }, []);

  const parseBalance = (balanceStr: string): number => {
    return parseFloat(balanceStr.replace('R', '').trim());
  };

  const selectedAccount = accounts.find(acc => acc._id === selectedAccountId);
  const availableBalance = selectedAccount ? parseBalance(selectedAccount.balance) : 0;

  const handlePurchase = async () => {
    const numAmount = parseFloat(amount);
    
    if (!selectedAccountId) {
      setMessage({ text: 'Select an account to pay from', type: 'error' });
      return;
    }
    if (!provider) {
      setMessage({ text: 'Select a provider', type: 'error' });
      return;
    }
    if (category === 'airtime' && !phone) {
      setMessage({ text: 'Enter phone number', type: 'error' });
      return;
    }
    if (category === 'electricity' && !meter) {
      setMessage({ text: 'Enter meter number', type: 'error' });
      return;
    }
    if (category === 'voucher' && !email) {
      setMessage({ text: 'Enter email address', type: 'error' });
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage({ text: 'Enter valid amount', type: 'error' });
      return;
    }
    if (numAmount > availableBalance) {
      setMessage({ text: `Insufficient funds. Available: ${selectedAccount?.balance}`, type: 'error' });
      return;
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

      // Show success message
      alert('Purchase successful!');
      
      // Reset form
      setProvider('');
      setPhone('');
      setMeter('');
      setEmail('');
      setAmount('');
      setMessage({ text: 'Purchase completed successfully!', type: 'success' });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Purchase error:', error);
      setMessage({
        text: error.response?.data?.message || 'Purchase failed. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingAccounts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] flex items-center justify-center">
        <div className="text-[#1a2a4a] text-lg">Loading accounts...</div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-md">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-[#1a2a4a] mb-2">No Accounts Found</h2>
          <p className="text-gray-600 mb-4">Please contact support to set up your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#052CE0] to-[#1e40af] shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 15v6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1a2a4a]">Buy Services</h1>
          <p className="text-gray-500 mt-1">Airtime, electricity &amp; vouchers</p>
        </div>

        {/* Account Selection */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pay from</label>
          <div className="grid grid-cols-2 gap-3">
            {accounts.map(acc => (
              <button
                key={acc._id}
                onClick={() => setSelectedAccountId(acc._id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedAccountId === acc._id
                    ? 'border-[#052CE0] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-[#1a2a4a]">{acc.type}</div>
                <div className="text-sm text-gray-500">{acc.balance}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6">
          {(['airtime', 'electricity', 'voucher'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setProvider('');
                setMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                category === cat
                  ? 'bg-[#052CE0] text-white shadow-md'
                  : 'bg-white text-gray-700 shadow hover:shadow-md'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Purchase Form */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <select
            value={provider}
            onChange={e => setProvider(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#052CE0] outline-none"
          >
            <option value="">Select provider</option>
            {category === 'airtime' && ['MTN', 'Vodacom', 'Cell C', 'Telkom'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
            {category === 'electricity' && ['Eskom', 'City Power'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
            {category === 'voucher' && ['Netflix', 'Spotify', 'Amazon', 'Takealot', 'Google Play', 'Steam'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {category === 'airtime' && (
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#052CE0] outline-none"
            />
          )}

          {category === 'electricity' && (
            <input
              type="text"
              placeholder="Meter number"
              value={meter}
              onChange={e => setMeter(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#052CE0] outline-none"
            />
          )}

          {category === 'voucher' && (
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#052CE0] outline-none"
            />
          )}

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg text-lg font-bold focus:ring-2 focus:ring-[#052CE0] outline-none"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {[50, 100, 200, 500, 1000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                className="px-3 py-1.5 bg-gray-100 hover:bg-[#052CE0] hover:text-white rounded-full text-sm transition-all"
              >
                R{amt}
              </button>
            ))}
          </div>

          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full py-3 bg-[#052CE0] hover:bg-[#052CE0]/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : `Buy ${category}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buy;