import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Account {
  id: string;
  name: string;
  type: 'savings' | 'cheque' | 'investment';
  balance: number;
  accountNumber: string;
}

const Deposit = () => {
  const { user, addNotification } = useAuth();
  
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

  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  const toAccount = accounts.find(acc => acc.id === toAccountId);
  const availableToAccounts = accounts.filter(acc => acc.id !== fromAccountId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleTransfer = () => {
    if (!fromAccountId) {
      setMessage({ text: 'Please select a source account', type: 'error' });
      return;
    }
    if (!toAccountId) {
      setMessage({ text: 'Please select a destination account', type: 'error' });
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
    
    if (transferAmount > (fromAccount?.balance || 0)) {
      setMessage({ text: `Insufficient funds in ${fromAccount?.name}`, type: 'error' });
      return;
    }

    if (transferAmount > 50000) {
      setMessage({ text: 'Maximum transfer amount is R50,000 per transaction', type: 'error' });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmTransfer = () => {
    setIsLoading(true);
    const transferAmount = parseFloat(amount);

    setTimeout(() => {
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === fromAccountId) {
          return { ...acc, balance: acc.balance - transferAmount };
        }
        if (acc.id === toAccountId) {
          return { ...acc, balance: acc.balance + transferAmount };
        }
        return acc;
      });
      
      setAccounts(updatedAccounts);
      
      addNotification({
        title: 'Transfer Successful',
        message: `${formatCurrency(transferAmount)} transferred from ${fromAccount?.name} to ${toAccount?.name}`,
        type: 'transaction'
      });
      
      setMessage({ 
        text: `Successfully transferred ${formatCurrency(transferAmount)} to ${toAccount?.name}`, 
        type: 'success' 
      });
      
      setFromAccountId('');
      setToAccountId('');
      setAmount('');
      setDescription('');
      setShowConfirmation(false);
      
      setTimeout(() => setMessage(null), 4000);
      setIsLoading(false);
    }, 1000);
  };

  const cancelTransfer = () => {
    setShowConfirmation(false);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8">
      {/* Decorative Header Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#052CE0] to-[#1e40af] shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1a2a4a] tracking-tight mb-2">Transfer Funds</h1>
        <p className="text-[#4a5a7a] text-sm">Move money between your accounts instantly</p>
      </div>

      {/* Stats Row - Soft blended cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[#4a5a7a] text-xs uppercase tracking-wider mb-1">Total Balance</p>
          <p className="text-[#1a2a4a] text-xl font-semibold">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[#4a5a7a] text-xs uppercase tracking-wider mb-1">Savings</p>
          <p className="text-[#1a2a4a] text-xl font-semibold">{formatCurrency(accounts[0].balance)}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[#4a5a7a] text-xs uppercase tracking-wider mb-1">Cheque</p>
          <p className="text-[#1a2a4a] text-xl font-semibold">{formatCurrency(accounts[1].balance)}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[#4a5a7a] text-xs uppercase tracking-wider mb-1">Investment</p>
          <p className="text-[#1a2a4a] text-xl font-semibold">{formatCurrency(accounts[2].balance)}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Accounts Overview */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/40 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-[#1a2a4a] font-semibold">Your Accounts</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {accounts.map(account => (
                <div key={account.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[#1a2a4a] font-medium">{account.name}</p>
                      <p className="text-[#4a5a7a] text-xs">{account.accountNumber}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      account.type === 'savings' ? 'bg-blue-100 text-[#052CE0]' :
                      account.type === 'cheque' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {account.type === 'savings' ? 'Savings' : account.type === 'cheque' ? 'Cheque' : 'Investment'}
                    </span>
                  </div>
                  <p className="text-[#1a2a4a] text-lg font-semibold">{formatCurrency(account.balance)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm">
            <p className="text-[#052CE0] text-sm font-medium mb-1">💡 Quick Tip</p>
            <p className="text-[#4a5a7a] text-xs">Transfers between your accounts are instant and free of charge.</p>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-[#052CE0]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#052CE0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h2 className="text-[#1a2a4a] text-xl font-semibold">Transfer Details</h2>
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
              {/* From Account */}
              <div>
                <label className="block text-[#4a5a7a] text-sm font-medium mb-2">From Account</label>
                <div className="relative">
                  <select 
                    value={fromAccountId} 
                    onChange={(e) => {
                      setFromAccountId(e.target.value);
                      setToAccountId('');
                    }}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] text-sm focus:outline-none focus:border-[#052CE0] focus:ring-2 focus:ring-[#052CE0]/20 disabled:opacity-50 appearance-none cursor-pointer"
                  >
                    <option value="">Select source account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {formatCurrency(account.balance)}
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

              {/* To Account */}
              <div>
                <label className="block text-[#4a5a7a] text-sm font-medium mb-2">To Account</label>
                <div className="relative">
                  <select 
                    value={toAccountId} 
                    onChange={(e) => setToAccountId(e.target.value)}
                    disabled={!fromAccountId || isLoading}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] text-sm focus:outline-none focus:border-[#052CE0] focus:ring-2 focus:ring-[#052CE0]/20 disabled:opacity-50 disabled:bg-gray-100 appearance-none cursor-pointer"
                  >
                    <option value="">Select destination account</option>
                    {availableToAccounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {formatCurrency(account.balance)}
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

              {/* Amount */}
              <div>
                <label className="block text-[#4a5a7a] text-sm font-medium mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5a7a] font-medium">R</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] text-lg focus:outline-none focus:border-[#052CE0] focus:ring-2 focus:ring-[#052CE0]/20 disabled:opacity-50"
                  />
                </div>
                {fromAccount && (
                  <p className="text-[#4a5a7a] text-xs mt-2">Available: {formatCurrency(fromAccount.balance)}</p>
                )}
              </div>

              {/* Quick Amounts */}
              <div>
                <label className="block text-[#4a5a7a] text-xs mb-2">Quick select</label>
                <div className="flex flex-wrap gap-2">
                  {[50, 100, 500, 1000, 5000].map(amt => (
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
                  {fromAccount && (
                    <button
                      type="button"
                      onClick={() => setAmount(fromAccount.balance.toString())}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-100 hover:bg-[#052CE0] hover:text-white rounded-lg text-[#4a5a7a] text-sm transition-all disabled:opacity-50"
                    >
                      Max
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#4a5a7a] text-sm font-medium mb-2">Reference (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Monthly savings, Emergency fund"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1a2a4a] text-sm placeholder-[#aaaaaa] focus:outline-none focus:border-[#052CE0] focus:ring-2 focus:ring-[#052CE0]/20 disabled:opacity-50"
                />
              </div>

              {/* Transfer Button */}
              <button 
                onClick={handleTransfer}
                disabled={isLoading || !fromAccountId || !toAccountId || !amount}
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
                  'Transfer Funds'
                )}
              </button>
            </div>

            {/* Recent Transfers */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#1a2a4a] font-semibold text-sm">Recent Transfers</h3>
                <button className="text-[#052CE0] text-xs hover:underline">View all</button>
              </div>
              <div className="space-y-3">
                {[
                  { from: 'Main Savings', to: 'Everyday Cheque', amount: 500, date: 'Today', type: 'transfer' },
                  { from: 'Everyday Cheque', to: 'Investment Portfolio', amount: 200, date: 'Yesterday', type: 'transfer' },
                  { from: 'Investment Portfolio', to: 'Main Savings', amount: 1000, date: 'Apr 10', type: 'transfer' },
                ].map((transfer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#052CE0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#1a2a4a] text-sm font-medium">{transfer.from} → {transfer.to}</p>
                        <p className="text-[#4a5a7a] text-xs">{transfer.date}</p>
                      </div>
                    </div>
                    <p className="text-red-500 font-medium">-R{transfer.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={cancelTransfer}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-[#1a2a4a] text-lg font-semibold">Confirm Transfer</h3>
              </div>
              <button onClick={cancelTransfer} className="text-[#4a5a7a] hover:text-[#1a2a4a] text-2xl transition-colors">×</button>
            </div>
            <div className="p-5">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#4a5a7a] text-sm">From</span>
                  <span className="text-[#1a2a4a] font-medium">{fromAccount?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#4a5a7a] text-sm">To</span>
                  <span className="text-[#1a2a4a] font-medium">{toAccount?.name}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-[#4a5a7a] text-sm">Amount</span>
                  <span className="text-[#052CE0] text-xl font-bold">{formatCurrency(parseFloat(amount))}</span>
                </div>
                {description && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#4a5a7a] text-sm">Reference</span>
                    <span className="text-[#1a2a4a] text-sm">{description}</span>
                  </div>
                )}
              </div>
              <p className="text-[#4a5a7a] text-xs text-center">This action cannot be undone</p>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={cancelTransfer} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-[#4a5a7a] font-medium transition-all">
                Cancel
              </button>
              <button onClick={confirmTransfer} className="flex-1 py-2.5 bg-gradient-to-r from-[#052CE0] to-[#1e40af] hover:from-[#052CE0]/90 hover:to-[#1e40af]/90 rounded-xl text-white font-medium transition-all shadow-md">
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;