import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { buyAirtime, buyElectricity, buyVoucher, getUserProfile } from '../services/api';

interface Account {
  id: string;
  name: string;
  type: 'savings' | 'cheque' | 'investment';
  balance: number;
  accountNumber: string;
}

const Buy = () => {
  const { addNotification } = useAuth();
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

  // Load accounts from backend
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await getUserProfile();
        const userAccounts = response.data.user?.accounts || [];
        // Filter only savings and cheque accounts (no investment)
        const spendableAccounts = userAccounts.filter(
          (acc: Account) => acc.type === 'savings' || acc.type === 'cheque'
        );
        setAccounts(spendableAccounts);
        if (spendableAccounts.length > 0) {
          setSelectedAccountId(spendableAccounts[0].id);
        }
      } catch (err) {
        console.error('Failed to load accounts:', err);
        setMessage({ text: 'Could not load account data', type: 'error' });
      } finally {
        setLoadingAccounts(false);
      }
    };
    loadAccounts();
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(val);

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  const handlePurchase = async () => {
    const numAmount = parseFloat(amount);
    
    // Validation
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
    if (numAmount > (selectedAccount?.balance || 0)) {
      setMessage({ text: `Insufficient funds in ${selectedAccount?.name}`, type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      let response;
      let newBalanceValue = (selectedAccount?.balance || 0) - numAmount;

      if (category === 'airtime') {
        response = await buyAirtime(provider, phone, numAmount);
        newBalanceValue = response.data.newBalance || newBalanceValue;
        addNotification({
          title: 'Airtime Purchase',
          message: `R${numAmount} airtime purchased for ${phone} from ${selectedAccount?.name}`,
          type: 'transaction',
        });
      } else if (category === 'electricity') {
        response = await buyElectricity(provider, meter, numAmount);
        newBalanceValue = response.data.newBalance || newBalanceValue;
        addNotification({
          title: 'Electricity Purchase',
          message: `R${numAmount} electricity for meter ${meter} from ${selectedAccount?.name}`,
          type: 'transaction',
        });
      } else {
        response = await buyVoucher(provider, numAmount, email);
        newBalanceValue = response.data.newBalance || newBalanceValue;
        addNotification({
          title: 'Voucher Purchase',
          message: `${provider} voucher worth R${numAmount} sent to ${email} from ${selectedAccount?.name}`,
          type: 'transaction',
        });
      }

      // Update local accounts state
      setAccounts(prev =>
        prev.map(acc =>
          acc.id === selectedAccountId
            ? { ...acc, balance: newBalanceValue }
            : acc
        )
      );

      setMessage({ text: 'Purchase successful!', type: 'success' });
      
      // Reset form
      setProvider('');
      setPhone('');
      setMeter('');
      setEmail('');
      setAmount('');
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Purchase error:', error);
      setMessage({
        text: error.response?.data?.error || 'Purchase failed',
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
          <h2 className="text-xl font-bold text-[#1a2a4a] mb-2">No Spendable Accounts</h2>
          <p className="text-gray-600 mb-4">You need a Savings or Cheque account to make purchases.</p>
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

        {/* Account Selection Card */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pay from</label>
          <div className="grid grid-cols-2 gap-3">
            {accounts.map(acc => (
              <button
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedAccountId === acc.id
                    ? 'border-[#052CE0] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-[#1a2a4a]">{acc.name}</div>
                <div className="text-sm text-gray-500">{formatCurrency(acc.balance)}</div>
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

          {/* Provider Select */}
          <select
            value={provider}
            onChange={e => setProvider(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#052CE0] focus:border-[#052CE0] outline-none"
          >
            <option value="">Select provider</option>
            {category === 'airtime' && ['MTN', 'Vodacom', 'Cell C', 'Telkom'].map(p => (
              <option key={p}>{p}</option>
            ))}
            {category === 'electricity' && ['Eskom', 'City Power'].map(p => (
              <option key={p}>{p}</option>
            ))}
            {category === 'voucher' && ['Netflix', 'Spotify', 'Amazon', 'Takealot', 'Google Play', 'Steam'].map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>

          {/* Category-specific fields */}
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

          {/* Amount Input */}
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

          {/* Quick Amount Buttons */}
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

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={isLoading || !selectedAccountId}
            className="w-full py-3 bg-[#052CE0] hover:bg-[#052CE0]/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : `Buy ${category}`}
          </button>

          {/* Info Section */}
          <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-gray-100">
            <div>
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500">Instant Delivery</p>
            </div>
            <div>
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500">No Fees</p>
            </div>
            <div>
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L9.172 14.828M12 21a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;