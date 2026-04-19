import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Buy = () => {
  const { user, updateBalance, addNotification } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'airtime' | 'electricity' | 'voucher'>('airtime');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const API_BASE = 'http://localhost:5000/api';

  const airtimeProviders = ['MTN', 'Vodacom', 'Cell C', 'Telkom'];
  const electricityProviders = ['Eskom', 'City Power'];
  const voucherOptions = ['Netflix', 'Spotify', 'Amazon', 'Takealot'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getToken = () => localStorage.getItem('token');

  const handlePurchase = async () => {
    const numAmount = parseFloat(amount);
    
    // Validation
    if (selectedCategory === 'airtime') {
      if (!selectedProvider) return setMessage({ text: 'Select a network provider', type: 'error' });
      if (!phoneNumber || phoneNumber.length < 10) return setMessage({ text: 'Enter a valid phone number', type: 'error' });
    }
    if (selectedCategory === 'electricity') {
      if (!selectedProvider) return setMessage({ text: 'Select a provider', type: 'error' });
      if (!meterNumber || meterNumber.length < 10) return setMessage({ text: 'Enter a valid meter number', type: 'error' });
    }
    if (selectedCategory === 'voucher') {
      if (!selectedProvider) return setMessage({ text: 'Select a voucher', type: 'error' });
      if (!email) return setMessage({ text: 'Enter your email address', type: 'error' });
    }
    if (isNaN(numAmount) || numAmount <= 0) return setMessage({ text: 'Enter a valid amount', type: 'error' });
    if (numAmount > (user?.balance || 0)) return setMessage({ text: 'Insufficient funds', type: 'error' });
    if (numAmount > 5000) return setMessage({ text: 'Maximum purchase is R5,000', type: 'error' });

    setIsLoading(true);
    setMessage(null);

    try {
      let endpoint = '';
      let body: any = { provider: selectedProvider, amount: numAmount };
      
      if (selectedCategory === 'airtime') {
        endpoint = '/buy/airtime';
        body.phoneNumber = phoneNumber;
      } else if (selectedCategory === 'electricity') {
        endpoint = '/buy/electricity';
        body.meterNumber = meterNumber;
      } else {
        endpoint = '/buy/voucher';
        body.voucherType = selectedProvider;
        body.email = email;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Purchase failed');

      // Update balance in context
      updateBalance(data.newBalance);
      
      // Add notification
      addNotification({
        title: 'Purchase Successful',
        message: `${formatCurrency(numAmount)} spent on ${selectedProvider} ${selectedCategory}`,
        type: 'transaction'
      });

      setMessage({ text: 'Purchase successful!', type: 'success' });
      
      // Reset form
      setSelectedProvider('');
      setPhoneNumber('');
      setMeterNumber('');
      setAmount('');
      setEmail('');
      
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryLabel = () => selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      {/* Back Button */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center">
        <button 
          onClick={() => window.history.back()} 
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:bg-[#052CE0] transition-all duration-300"
        >
          <svg className="w-5 h-5 text-[#052CE0] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="ml-3 text-[#1a2a4a] font-semibold text-lg md:hidden">Back</span>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#052CE0] to-[#1e40af] shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 15v6" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1a2a4a] tracking-tight mb-2">Buy Services</h1>
        <p className="text-[#4a5a7a] text-sm">Airtime, Electricity & Vouchers</p>
      </div>

      {/* Balance */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-5 text-center border border-white/40">
          <span className="text-[#4a5a7a] text-xs uppercase tracking-widest font-bold">Wallet Balance</span>
          <span className="text-[#1a2a4a] text-3xl font-bold block mt-1">{formatCurrency(user?.balance || 0)}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-lg mx-auto mb-6">
        <div className="flex gap-2 p-1.5 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
          {[
            { id: 'airtime', label: 'Airtime', icon: '📱' },
            { id: 'electricity', label: 'Power', icon: '⚡' },
            { id: 'voucher', label: 'Vouchers', icon: '🎁' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id as any); setMessage(null); }}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                selectedCategory === cat.id ? 'bg-[#052CE0] text-white shadow-md' : 'text-[#4a5a7a] hover:bg-gray-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-5">
          {/* Provider */}
          <div>
            <label className="block text-[#4a5a7a] text-xs font-bold uppercase mb-2">Provider</label>
            <select 
              value={selectedProvider} 
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] focus:ring-2 focus:ring-[#052CE0]/20 outline-none"
            >
              <option value="">Select {getCategoryLabel()}</option>
              {(selectedCategory === 'airtime' ? airtimeProviders : selectedCategory === 'electricity' ? electricityProviders : voucherOptions).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Conditional Fields */}
          {selectedCategory === 'airtime' && (
            <div>
              <label className="block text-[#4a5a7a] text-xs font-bold uppercase mb-2">Phone Number</label>
              <input type="tel" placeholder="071 234 5678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
            </div>
          )}
          {selectedCategory === 'electricity' && (
            <div>
              <label className="block text-[#4a5a7a] text-xs font-bold uppercase mb-2">Meter Number</label>
              <input type="text" placeholder="Enter meter number" value={meterNumber} onChange={(e) => setMeterNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
            </div>
          )}
          {selectedCategory === 'voucher' && (
            <div>
              <label className="block text-[#4a5a7a] text-xs font-bold uppercase mb-2">Send to Email</label>
              <input type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-[#4a5a7a] text-xs font-bold uppercase mb-2">Amount (ZAR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5a7a] font-bold">R</span>
              <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-[#1a2a4a] outline-none" />
            </div>
          </div>

          {/* Buy Button */}
          <button 
            onClick={handlePurchase}
            disabled={isLoading || !amount}
            className="w-full py-4 bg-[#052CE0] hover:bg-[#1e40af] text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Processing...' : `Purchase ${getCategoryLabel()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buy;