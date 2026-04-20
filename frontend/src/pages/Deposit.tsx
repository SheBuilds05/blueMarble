import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, transferFunds } from '../services/api';

interface Account {
  id: string;
  _id?: string;
  name: string;
  type: 'savings' | 'cheque' | 'investment';
  balance: number;
  accountNumber: string;
}

const Deposit = () => {
  const { addNotification } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load accounts from backend
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await getUserProfile();
        // Extract accounts and ensure they have a consistent ID string
        const rawAccounts = response.data.user?.accounts || [];
        
        const sanitizedAccounts = rawAccounts.map((acc: any) => ({
          ...acc,
          // Handle cases where MongoDB uses _id instead of id
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Helper selectors
  const fromAccount = accounts.find(acc => String(acc.id) === String(fromAccountId));
  const toAccount = accounts.find(acc => String(acc.id) === String(toAccountId));
  const availableToAccounts = accounts.filter(acc => String(acc.id) !== String(fromAccountId));

  const handleTransfer = () => {
    if (!fromAccountId || !toAccountId) {
      setMessage({ text: 'Please select both source and destination accounts', type: 'error' });
      return;
    }
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }
    if (transferAmount > (fromAccount?.balance || 0)) {
      setMessage({ text: `Insufficient funds in ${fromAccount?.name}`, type: 'error' });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    setIsLoading(true);
    const transferAmount = parseFloat(amount);

    try {
      const response = await transferFunds(fromAccountId, toAccountId, transferAmount, description);
      const result = response.data;

      // Update local state with the new balances returned by the backend
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
      
      // Reset form
      setFromAccountId('');
      setToAccountId('');
      setAmount('');
      setDescription('');
      
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

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse text-blue-600 font-medium">Syncing accounts...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Transfer Funds</h1>
            <p className="text-slate-500">Move money between your BlueMarble accounts</p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              {message && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">From Account</label>
                  <select 
                    value={fromAccountId} 
                    onChange={(e) => setFromAccountId(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Select source account</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name} — {formatCurrency(acc.balance)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">To Account</label>
                  <select 
                    value={toAccountId} 
                    onChange={(e) => setToAccountId(e.target.value)}
                    disabled={!fromAccountId}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                  >
                    <option value="">Select destination</option>
                    {availableToAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R</span>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xl font-bold text-slate-900"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleTransfer}
                  disabled={isLoading || !amount || !fromAccountId || !toAccountId}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isLoading ? 'Processing...' : 'Transfer Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Account Summary Sidebar */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 px-2">Account Summary</h3>
            {accounts.map(acc => (
              <div key={acc.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{acc.type}</div>
                <div className="text-sm font-medium text-slate-900">{acc.name}</div>
                <div className="text-lg font-bold text-slate-900">{formatCurrency(acc.balance)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Overlay */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Review Transfer</h3>
            <p className="text-slate-500 text-sm mb-6">Please confirm the details below are correct.</p>
            
            <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Transferring</span>
                <span className="font-bold text-slate-900">{formatCurrency(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">To Account</span>
                <span className="font-bold text-blue-600">{toAccount?.name}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirmation(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
              <button onClick={confirmTransfer} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;