<<<<<<< HEAD
import React, { useState } from 'react';

interface Account {
  id: string;
=======
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, transferFunds } from '../services/api';

interface Account {
  id: string;
  _id?: string;
>>>>>>> sibongokuhle
  name: string;
  type: 'savings' | 'cheque' | 'investment';
  balance: number;
  accountNumber: string;
}

<<<<<<< HEAD
interface Notification {
  title: string;
  message: string;
  type: 'transaction';
}

const Deposit = () => {
  // Dummy accounts data in ZAR
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Main Savings',
      type: 'savings',
      balance: 12500.75,
      accountNumber: 'SAV-****-1234',
    },
    {
      id: '2',
      name: 'Everyday Cheque',
      type: 'cheque',
      balance: 3450.50,
      accountNumber: 'CHQ-****-5678',
    },
    {
      id: '3',
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 50000.00,
      accountNumber: 'INV-****-9012',
    },
  ]);

=======
const Deposit = () => {
  const { addNotification } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
>>>>>>> sibongokuhle
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

<<<<<<< HEAD
  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  const toAccount = accounts.find(acc => acc.id === toAccountId);
  const availableToAccounts = accounts.filter(acc => acc.id !== fromAccountId);
=======
  // Load accounts from backend
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await getUserProfile();
        const rawAccounts = response.data.user?.accounts || [];
        
        const sanitizedAccounts = rawAccounts.map((acc: any) => ({
          ...acc,
          id: acc.id ? String(acc.id) : String(acc._id)
        }));

        setAccounts(sanitizedAccounts);
      } catch (err) {
        console.error('Failed to load accounts:', err);
        setError('Could not load account data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, []);
>>>>>>> sibongokuhle

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
<<<<<<< HEAD
      minimumFractionDigits: 2
    }).format(amount);
  };

  const addNotification = (notification: Notification) => {
    console.log('Notification:', notification);
    alert(`${notification.title}: ${notification.message}`);
  };

  const handleTransfer = () => {
    if (!fromAccountId || !toAccountId) {
      setMessage({ text: 'Please select both accounts', type: 'error' });
      return;
    }
    
=======
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const fromAccount = accounts.find(acc => String(acc.id) === String(fromAccountId));
  const toAccount = accounts.find(acc => String(acc.id) === String(toAccountId));
  const availableToAccounts = accounts.filter(acc => String(acc.id) !== String(fromAccountId));

  const handleTransfer = () => {
    if (!fromAccountId || !toAccountId) {
      setMessage({ text: 'Please select both source and destination accounts', type: 'error' });
      return;
    }
>>>>>>> sibongokuhle
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }
<<<<<<< HEAD
    
=======
>>>>>>> sibongokuhle
    if (transferAmount > (fromAccount?.balance || 0)) {
      setMessage({ text: `Insufficient funds in ${fromAccount?.name}`, type: 'error' });
      return;
    }
<<<<<<< HEAD

    setShowConfirmation(true);
  };

  const confirmTransfer = () => {
    setIsLoading(true);
    const transferAmount = parseFloat(amount);

    setTimeout(() => {
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === fromAccountId) return { ...acc, balance: acc.balance - transferAmount };
        if (acc.id === toAccountId) return { ...acc, balance: acc.balance + transferAmount };
        return acc;
      });
      
      setAccounts(updatedAccounts);
      addNotification({
        title: 'Transfer Successful',
        message: `${formatCurrency(transferAmount)} transferred to ${toAccount?.name}`,
        type: 'transaction'
      });
      
      setMessage({ text: 'Transfer completed successfully', type: 'success' });
=======
    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    setIsLoading(true);
    const transferAmount = parseFloat(amount);

    try {
      const response = await transferFunds(fromAccountId, toAccountId, transferAmount, description);
      const result = response.data;

      if (result.newBalances) {
        setAccounts(prev => prev.map(acc => ({
          ...acc,
          balance: result.newBalances[acc.id] !== undefined ? result.newBalances[acc.id] : acc.balance,
        })));
      }

      addNotification({
        title: 'Transfer Successful',
        message: `R${transferAmount} transferred from ${fromAccount?.name} to ${toAccount?.name}`,
        type: 'transaction',
      });

      setMessage({ text: 'Transfer completed successfully!', type: 'success' });
      
>>>>>>> sibongokuhle
      setFromAccountId('');
      setToAccountId('');
      setAmount('');
      setDescription('');
<<<<<<< HEAD
      setShowConfirmation(false);
      setIsLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8 relative">
      {/* Decorative Header Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      {/* Exit/Back Button Area */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center">
        <button 
          onClick={() => window.history.back()} 
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:bg-[#052CE0] transition-all duration-300"
          title="Go Back"
        >
          <svg 
            className="w-5 h-5 text-[#052CE0] group-hover:text-white transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="ml-3 text-[#1a2a4a] font-semibold text-lg md:hidden">Back</span>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#052CE0] to-[#1e40af] shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1a2a4a] tracking-tight mb-2">Transfer Funds</h1>
        <p className="text-[#4a5a7a] text-sm">Internal movement within your accounts</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Accounts Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/40 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-[#1a2a4a] font-semibold">Live Balances</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {accounts.map(account => (
                <div key={account.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[#1a2a4a] font-medium text-sm">{account.name}</p>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#052CE0] bg-blue-50 px-2 py-0.5 rounded">
                      {account.type}
                    </span>
                  </div>
                  <p className="text-[#1a2a4a] text-lg font-bold">{formatCurrency(account.balance)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-[#4a5a7a] text-xs font-bold uppercase mb-2">From Account</label>
                <select 
                  value={fromAccountId} 
                  onChange={(e) => { setFromAccountId(e.target.value); setToAccountId(''); }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] focus:ring-2 focus:ring-[#052CE0]/20 outline-none"
                >
                  <option value="">Select Source</option>
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({formatCurrency(acc.balance)})</option>)}
=======
      
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      console.error('Transfer error:', error);
      setMessage({
        text: error.response?.data?.error || 'Transfer failed. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#052CE0] to-[#1e40af] shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1a2a4a]">Transfer Funds</h1>
          <p className="text-gray-500 mt-1">Move money between your BlueMarble accounts</p>
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
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} — {formatCurrency(acc.balance)}</option>
                  ))}
>>>>>>> sibongokuhle
                </select>
              </div>

              <div>
<<<<<<< HEAD
                <label className="block text-[#4a5a7a] text-xs font-bold uppercase mb-2">To Account</label>
=======
                <label className="block text-sm font-medium text-gray-700 mb-2">To Account</label>
>>>>>>> sibongokuhle
                <select 
                  value={toAccountId} 
                  onChange={(e) => setToAccountId(e.target.value)}
                  disabled={!fromAccountId}
<<<<<<< HEAD
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] focus:ring-2 focus:ring-[#052CE0]/20 outline-none disabled:opacity-50"
                >
                  <option value="">Select Destination</option>
                  {availableToAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
=======
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#052CE0] focus:border-[#052CE0] outline-none disabled:opacity-50 disabled:bg-gray-100"
                >
                  <option value="">Select destination</option>
                  {availableToAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
>>>>>>> sibongokuhle
                </select>
              </div>

              <div>
<<<<<<< HEAD
                <label className="block text-[#4a5a7a] text-xs font-bold uppercase mb-2">Amount (ZAR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5a7a] font-bold">R</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-[#1a2a4a] outline-none"
=======
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg text-lg font-bold focus:ring-2 focus:ring-[#052CE0] outline-none"
>>>>>>> sibongokuhle
                  />
                </div>
              </div>

              <button 
                onClick={handleTransfer}
<<<<<<< HEAD
                disabled={isLoading || !amount}
                className="w-full py-4 bg-[#052CE0] hover:bg-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
              >
                {isLoading ? 'Processing...' : 'Transfer Funds'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-[#1a2a4a] mb-4">Confirm Transfer?</h3>
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="flex justify-between text-sm mb-2"><span className="text-[#4a5a7a]">Amount:</span> <span className="font-bold">{formatCurrency(parseFloat(amount))}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#4a5a7a]">To:</span> <span className="font-bold text-[#052CE0]">{toAccount?.name}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmation(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-[#4a5a7a]">Cancel</button>
              <button onClick={confirmTransfer} className="flex-1 py-3 bg-[#052CE0] text-white rounded-xl font-bold">Confirm</button>
=======
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
              <div key={acc.id} className="bg-white rounded-xl shadow p-4 border border-gray-100">
                <div className="text-xs font-bold text-[#052CE0] uppercase tracking-wider mb-1">{acc.type}</div>
                <div className="text-sm font-medium text-[#1a2a4a]">{acc.name}</div>
                <div className="text-lg font-bold text-[#1a2a4a]">{formatCurrency(acc.balance)}</div>
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
                <span className="font-bold text-[#1a2a4a]">{formatCurrency(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">To</span>
                <span className="font-bold text-[#052CE0]">{toAccount?.name}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirmation(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-all">
                Cancel
              </button>
              <button onClick={confirmTransfer} className="flex-1 py-2 bg-[#052CE0] text-white font-medium rounded-lg hover:bg-[#052CE0]/90 transition-all">
                Confirm
              </button>
>>>>>>> sibongokuhle
            </div>
          </div>
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
  
};

export default Deposit;
=======
};

export default Deposit;
>>>>>>> sibongokuhle
