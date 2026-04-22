import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAccounts, transferFunds } from '../services/api';

interface Account {
  _id: string;
  type: string;
  mask: string;
  balance: string;
  color: string;
}

const Deposit = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load accounts from backend
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await getUserAccounts();
        setAccounts(response.data);
      } catch (err) {
        console.error('Failed to load accounts:', err);
        setError('Could not load account data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, []);

  const formatCurrency = (amountStr: string) => {
    if (typeof amountStr === 'string' && amountStr.startsWith('R')) {
      return amountStr;
    }
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(parseFloat(amountStr as any) || 0);
  };

  const parseBalance = (balanceStr: string): number => {
    return parseFloat(balanceStr.replace('R', '').trim());
  };

  const fromAccount = accounts.find(acc => acc._id === fromAccountId);
  const toAccount = accounts.find(acc => acc._id === toAccountId);
  const availableToAccounts = accounts.filter(acc => acc._id !== fromAccountId);

  const handleTransfer = () => {
    if (!fromAccountId || !toAccountId) {
      setMessage({ text: 'Please select both accounts', type: 'error' });
      return;
    }
    if (fromAccountId === toAccountId) {
      setMessage({ text: 'Cannot transfer to the same account', type: 'error' });
      return;
    }
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }
    if (transferAmount > parseBalance(fromAccount?.balance || 'R 0')) {
      setMessage({ text: `Insufficient funds in ${fromAccount?.type}`, type: 'error' });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    setIsLoading(true);
    const transferAmount = parseFloat(amount);

    try {
      const response = await transferFunds(fromAccountId, toAccountId, transferAmount, reference);
      
      alert('Transfer completed successfully!');
      
      setFromAccountId('');
      setToAccountId('');
      setAmount('');
      setReference('');
      
    } catch (error: any) {
      console.error('Transfer error:', error);
      setMessage({
        text: error.response?.data?.message || 'Transfer failed. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] flex items-center justify-center">
        <div className="text-[#1a2a4a] text-lg">Loading accounts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-[#1a2a4a] mb-2">Unable to Load Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-[#052CE0] text-white px-6 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5 text-[#052CE0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-[#1a2a4a] font-medium">Back to Dashboard</span>
          </button>
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#052CE0] to-[#1e40af] shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#1a2a4a]">Transfer Funds</h1>
            <p className="text-gray-500 mt-1">Move money between your accounts</p>
          </div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
                <select 
                  value={fromAccountId} 
                  onChange={(e) => setFromAccountId(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#052CE0] focus:border-[#052CE0] outline-none"
                >
                  <option value="">Select source account</option>
                  {/* The key is correctly placed on the option element */}
                  {accounts.map(acc => (
                    <option key={acc._id} value={acc._id}>
                      {acc.type} ({acc.mask}) — {acc.balance}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Account</label>
                <select 
                  value={toAccountId} 
                  onChange={(e) => setToAccountId(e.target.value)}
                  disabled={!fromAccountId}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#052CE0] focus:border-[#052CE0] outline-none disabled:opacity-50 disabled:bg-gray-100"
                >
                  <option value="">Select destination</option>
                  {/* The key is correctly placed on the option element */}
                  {availableToAccounts.map(acc => (
                    <option key={acc._id} value={acc._id}>
                      {acc.type} ({acc.mask})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg text-lg font-bold focus:ring-2 focus:ring-[#052CE0] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference (Optional)</label>
                <input 
                  type="text" 
                  value={reference} 
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Enter reference"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#052CE0] outline-none"
                />
              </div>

              <button 
                onClick={handleTransfer}
                disabled={isLoading || !amount || !fromAccountId || !toAccountId}
                className="w-full py-3 bg-[#052CE0] hover:bg-[#052CE0]/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Transfer Now'}
              </button>
            </div>
          </div>

          {/* Account Summary Sidebar */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#1a2a4a] px-2">Account Summary</h3>
            {accounts.map(acc => (
              <div key={acc._id} className={`bg-white rounded-xl shadow p-4 border border-gray-100 ${acc.color ? `bg-gradient-to-r ${acc.color}` : ''}`}>
                <div className="text-xs font-bold text-[#052CE0] uppercase tracking-wider mb-1">{acc.type}</div>
                <div className="text-sm font-medium text-[#1a2a4a]">{acc.mask}</div>
                <div className="text-lg font-bold text-[#1a2a4a]">{acc.balance}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Overlay */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-[#1a2a4a] mb-2">Confirm Transfer</h3>
            <p className="text-gray-500 text-sm mb-6">Please confirm the details below.</p>
            
            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-[#1a2a4a]">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">To</span>
                <span className="font-bold text-[#052CE0]">{toAccount?.type}</span>
              </div>
              {reference && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reference</span>
                  <span className="text-gray-600">{reference}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirmation(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-all">
                Cancel
              </button>
              <button onClick={confirmTransfer} className="flex-1 py-2 bg-[#052CE0] text-white font-medium rounded-lg hover:bg-[#052CE0]/90 transition-all">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;