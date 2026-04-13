import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ServiceProvider {
  id: string;
  name: string;
  type: 'airtime' | 'electricity' | 'voucher';
}

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

  // Service providers
  const airtimeProviders: ServiceProvider[] = [
    { id: 'mtn', name: 'MTN', type: 'airtime' },
    { id: 'vodacom', name: 'Vodacom', type: 'airtime' },
    { id: 'cellc', name: 'Cell C', type: 'airtime' },
    { id: 'telkom', name: 'Telkom', type: 'airtime' },
  ];

  const electricityProviders: ServiceProvider[] = [
    { id: 'eskom', name: 'Eskom', type: 'electricity' },
    { id: 'citypower', name: 'City Power', type: 'electricity' },
  ];

  const voucherOptions = [
    { id: 'amazon', name: 'Amazon', minAmount: 50 },
    { id: 'netflix', name: 'Netflix', minAmount: 100 },
    { id: 'spotify', name: 'Spotify', minAmount: 50 },
    { id: 'google', name: 'Google Play', minAmount: 50 },
    { id: 'steam', name: 'Steam', minAmount: 100 },
    { id: 'takealot', name: 'Takealot', minAmount: 100 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handlePurchase = () => {
    const numAmount = parseFloat(amount);
    
    // Validation based on category
    if (selectedCategory === 'airtime') {
      if (!selectedProvider) {
        setMessage({ text: 'Please select a network provider', type: 'error' });
        return;
      }
      if (!phoneNumber || phoneNumber.length < 10) {
        setMessage({ text: 'Please enter a valid phone number', type: 'error' });
        return;
      }
    }
    
    if (selectedCategory === 'electricity') {
      if (!selectedProvider) {
        setMessage({ text: 'Please select a provider', type: 'error' });
        return;
      }
      if (!meterNumber || meterNumber.length < 10) {
        setMessage({ text: 'Please enter a valid meter number', type: 'error' });
        return;
      }
    }
    
    if (selectedCategory === 'voucher') {
      if (!selectedProvider) {
        setMessage({ text: 'Please select a voucher', type: 'error' });
        return;
      }
      if (!email) {
        setMessage({ text: 'Please enter your email address', type: 'error' });
        return;
      }
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }
    
    if (numAmount > (user?.balance || 0)) {
      setMessage({ text: 'Insufficient funds', type: 'error' });
      return;
    }

    if (numAmount > 5000) {
      setMessage({ text: 'Maximum purchase amount is R5,000 per transaction', type: 'error' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newBalance = (user?.balance || 0) - numAmount;
      updateBalance(newBalance);
      
      let purchaseDetails = '';
      if (selectedCategory === 'airtime') {
        purchaseDetails = `${selectedProvider} airtime for ${phoneNumber}`;
      } else if (selectedCategory === 'electricity') {
        purchaseDetails = `${selectedProvider} electricity for meter ${meterNumber}`;
      } else {
        purchaseDetails = `${selectedProvider} voucher sent to ${email}`;
      }
      
      addNotification({
        title: 'Purchase Successful',
        message: `${formatCurrency(numAmount)} spent on ${purchaseDetails}`,
        type: 'transaction'
      });
      
      setMessage({ 
        text: `Successfully purchased ${purchaseDetails}!`, 
        type: 'success' 
      });
      
      // Reset form
      setSelectedProvider('');
      setPhoneNumber('');
      setMeterNumber('');
      setAmount('');
      setEmail('');
      
      setTimeout(() => setMessage(null), 4000);
      setIsLoading(false);
    }, 1000);
  };

  const getCategoryLabel = () => {
    switch (selectedCategory) {
      case 'airtime': return 'Airtime';
      case 'electricity': return 'Electricity';
      case 'voucher': return 'Voucher';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000919] via-[#0a1525] to-[#000919] p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-wide mb-2">Buy Services</h1>
        <div className="w-12 h-px bg-[#052CE0] mx-auto mb-3"></div>
        <p className="text-white/40 text-sm font-light">Purchase airtime, electricity & gift vouchers</p>
      </div>

      {/* Balance Card */}
      <div className="max-w-md mx-auto mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <span className="text-[#666666] text-xs uppercase tracking-wider">Available Balance</span>
          <span className="text-[#1a1a2e] text-3xl md:text-4xl font-light block mt-2">{formatCurrency(user?.balance || 0)}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-lg mx-auto mb-8">
        <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
          {[
            { id: 'airtime', label: 'Airtime' },
            { id: 'electricity', label: 'Electricity' },
            { id: 'voucher', label: 'Vouchers' },
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id as typeof selectedCategory);
                setSelectedProvider('');
                setPhoneNumber('');
                setMeterNumber('');
                setAmount('');
                setEmail('');
                setMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-[#052CE0] text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Form */}
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-[#1a1a2e] text-xl font-light mb-6 pb-2 border-b border-[#e0e0e0]">
          Purchase {getCategoryLabel()}
        </h2>
        
        {message && (
          <div className={`p-3 rounded-lg mb-6 text-sm ${
            message.type === 'success' 
              ? 'bg-[#052CE0]/5 border border-[#052CE0]/20 text-[#1a1a2e]' 
              : 'bg-[#f5f5f5] border border-[#e0e0e0] text-[#666666]'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-[#888888] text-xs uppercase tracking-wider mb-2">Select Provider</label>
            <select 
              value={selectedProvider} 
              onChange={(e) => setSelectedProvider(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg text-[#1a1a2e] text-sm focus:outline-none focus:border-[#052CE0] disabled:opacity-50 disabled:bg-[#f5f5f5] appearance-none cursor-pointer"
            >
              <option value="">Choose {getCategoryLabel()} provider</option>
              {(selectedCategory === 'airtime' ? airtimeProviders : selectedCategory === 'electricity' ? electricityProviders : voucherOptions).map(provider => (
                <option key={provider.id} value={provider.name}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {/* Airtime - Phone Number */}
          {selectedCategory === 'airtime' && (
            <div>
              <label className="block text-[#888888] text-xs uppercase tracking-wider mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="071 234 5678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg text-[#1a1a2e] text-sm placeholder-[#aaaaaa] focus:outline-none focus:border-[#052CE0] disabled:opacity-50 disabled:bg-[#f5f5f5]"
              />
            </div>
          )}

          {/* Electricity - Meter Number */}
          {selectedCategory === 'electricity' && (
            <div>
              <label className="block text-[#888888] text-xs uppercase tracking-wider mb-2">Meter Number</label>
              <input
                type="text"
                placeholder="Enter your meter number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg text-[#1a1a2e] text-sm placeholder-[#aaaaaa] focus:outline-none focus:border-[#052CE0] disabled:opacity-50 disabled:bg-[#f5f5f5]"
              />
            </div>
          )}

          {/* Voucher - Email */}
          {selectedCategory === 'voucher' && (
            <div>
              <label className="block text-[#888888] text-xs uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg text-[#1a1a2e] text-sm placeholder-[#aaaaaa] focus:outline-none focus:border-[#052CE0] disabled:opacity-50 disabled:bg-[#f5f5f5]"
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-[#888888] text-xs uppercase tracking-wider mb-2">Amount (R)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] text-sm">R</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                className="w-full pl-8 pr-4 py-3 bg-white border border-[#e0e0e0] rounded-lg text-[#1a1a2e] text-sm focus:outline-none focus:border-[#052CE0] disabled:opacity-50 disabled:bg-[#f5f5f5]"
              />
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[50, 100, 200, 500, 1000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                disabled={isLoading}
                className="px-4 py-1.5 bg-[#f5f5f5] border border-[#e0e0e0] rounded-lg text-[#666666] text-xs hover:bg-[#052CE0] hover:text-white hover:border-[#052CE0] transition-all disabled:opacity-50"
              >
                R{amt}
              </button>
            ))}
          </div>

          {/* Purchase Button */}
          <button 
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full py-3 bg-[#052CE0] hover:bg-[#052CE0]/90 text-white text-sm font-medium tracking-wide rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Processing...' : `Purchase ${getCategoryLabel()}`}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 pt-6 border-t border-[#e0e0e0]">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[#888888] text-xs">Instant Delivery</p>
            </div>
            <div>
              <p className="text-[#888888] text-xs">No Fees</p>
            </div>
            <div>
              <p className="text-[#888888] text-xs">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;