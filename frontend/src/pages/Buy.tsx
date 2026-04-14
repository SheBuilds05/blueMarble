import React, { useState } from 'react';

interface ServiceProvider {
  id: string;
  name: string;
  type: 'airtime' | 'electricity' | 'voucher';
}

interface Notification {
  title: string;
  message: string;
  type: 'transaction';
}

const Buy = () => {
  const [balance, setBalance] = useState(15000.00); // Default balance in ZAR
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

  const addNotification = (notification: Notification) => {
    // Simple console notification instead of auth context
    console.log('Notification:', notification);
    // You can replace this with your own notification system (e.g., toast, alert, etc.)
    alert(`${notification.title}: ${notification.message}`);
  };

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
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
    
    if (numAmount > balance) {
      setMessage({ text: 'Insufficient funds', type: 'error' });
      return;
    }

    if (numAmount > 5000) {
      setMessage({ text: 'Maximum purchase amount is R5,000 per transaction', type: 'error' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newBalance = balance - numAmount;
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
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8">
      {/* Decorative Header Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#052CE0] to-[#1e40af] shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 15v6" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1a2a4a] tracking-tight mb-2">Buy Services</h1>
        <div className="w-12 h-px bg-[#052CE0] mx-auto mb-3"></div>
        <p className="text-[#4a5a7a] text-sm">Purchase airtime, electricity & gift vouchers</p>
      </div>

      {/* Balance Card */}
      <div className="max-w-md mx-auto mb-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 text-center border border-white/40">
          <span className="text-[#4a5a7a] text-xs uppercase tracking-wider">Available Balance</span>
          <span className="text-[#1a2a4a] text-3xl md:text-4xl font-semibold block mt-2">{formatCurrency(balance)}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-lg mx-auto mb-8">
        <div className="flex gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
          {[
            { id: 'airtime', label: 'Airtime', icon: '📱' },
            { id: 'electricity', label: 'Electricity', icon: '⚡' },
            { id: 'voucher', label: 'Vouchers', icon: '🎁' },
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
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-[#052CE0] text-white shadow-sm'
                  : 'text-[#4a5a7a] hover:text-[#1a2a4a] hover:bg-gray-100'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Form */}
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-xl border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-[#052CE0]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#052CE0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 15v6" />
            </svg>
          </div>
          <h2 className="text-[#1a2a4a] text-xl font-semibold">Purchase {getCategoryLabel()}</h2>
        </div>
        
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {message.text}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-[#4a5a7a] text-sm font-medium mb-2">Select Provider</label>
            <div className="relative">
              <select 
                value={selectedProvider} 
                onChange={(e) => setSelectedProvider(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] text-sm focus:outline-none focus:border-[#052CE0] focus:ring-2 focus:ring-[#052CE0]/20 disabled:opacity-50 disabled:bg-gray-100 appearance-none cursor-pointer"
              >
                <option value="">Choose {getCategoryLabel()} provider</option>
                {(selectedCategory === 'airtime' ? airtimeProviders : selectedCategory === 'electricity' ? electricityProviders : voucherOptions).map(provider => (
                  <option key={provider.id} value={provider.name}>
                    {provider.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-[#4a5a7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Airtime - Phone Number */}
          {selectedCategory === 'airtime' && (
            <div>
              <label className="block text-[#4a5a7a] text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="071 234 5678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] text-sm placeholder-[#aaaaaa] focus:outline-none focus:border-[#052CE0] focus:ring-2 focus:ring-[#052CE0]/20 disabled:opacity-50 disabled:bg-gray-100"
              />
            </div>
          )}

          {/* Electricity - Meter Number */}
          {selectedCategory === 'electricity' && (
            <div>
              <label className="block text-[#4a5a7a] text-sm font-medium mb-2">Meter Number</label>
              <input
                type="text"
                placeholder="Enter your meter number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] text-sm placeholder-[#aaaaaa] focus:outline-none focus:border-[#052CE0] focus:ring-2 focus:ring-[#052CE0]/20 disabled:opacity-50 disabled:bg-gray-100"
              />
            </div>
          )}

          {/* Voucher - Email */}
          {selectedCategory === 'voucher' && (
            <div>
              <label className="block text-[#4a5a7a] text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] text-sm placeholder-[#aaaaaa] focus:outline-none focus:border-[#052CE0] focus:ring-2 focus:ring-[#052CE0]/20 disabled:opacity-50 disabled:bg-gray-100"
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-[#4a5a7a] text-sm font-medium mb-2">Amount (R)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5a7a] font-medium">R</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] text-lg focus:outline-none focus:border-[#052CE0] focus:ring-2 focus:ring-[#052CE0]/20 disabled:opacity-50 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Quick Amounts */}
          <div>
            <label className="block text-[#4a5a7a] text-xs mb-2">Quick select</label>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 500, 1000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-100 hover:bg-[#052CE0] hover:text-white rounded-lg text-[#4a5a7a] text-sm transition-all disabled:opacity-50"
                >
                  R{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Purchase Button */}
          <button 
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-[#052CE0] to-[#1e40af] hover:from-[#052CE0]/90 hover:to-[#1e40af]/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              `Purchase ${getCategoryLabel()}`
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-[#4a5a7a] text-xs">Instant Delivery</p>
            </div>
            <div>
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#052CE0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[#4a5a7a] text-xs">No Fees</p>
            </div>
            <div>
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L9.172 14.828M12 21a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
              </div>
              <p className="text-[#4a5a7a] text-xs">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;