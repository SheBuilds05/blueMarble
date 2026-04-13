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
    <div className="min-h-screen bg-gradient-to-br from-[#000919] via-[#0a1525] to-[#000919] p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-wide mb-2">Transfer Funds</h1>
        <div className="w-12 h-px bg-[#052CE0] mx-auto mb-3"></div>
        <p className="text-white/40 text-sm font-light">Move money between your accounts</p>
      </div>

      {/* Total Balance */}
      <div className="max-w-md mx-auto mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <span className="text-[#666666] text-xs uppercase tracking-wider">Total Portfolio Balance</span>
          <span className="text-[#1a1a2e] text-3xl md:text-4xl font-light block mt-2">{formatCurrency(totalBalance)}</span>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 max-w-5xl mx-auto">
        {accounts.map(account => (
          <div 
            key={account.id} 
            className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-[#1a1a2e] font-medium text-base">{account.name}</h3>
                <p className="text-[#888888] text-xs mt-1">{account.accountNumber}</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-[#e0e0e0] flex items-center justify-center">
                <span className="text-[#888888] text-xs">{account.type === 'savings' ? 'SAV' : account.type === 'cheque' ? 'CHQ' : 'INV'}</span>
              </div>
            </div>
            <p className="text-[#1a1a2e] text-xl font-light">{formatCurrency(account.balance)}</p>
          </div>
        ))}
      </div>

      {/* Transfer Form */}
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-[#1a1a2e] text-xl font-light mb-6 pb-2 border-b border-[#e0e0e0]">Transfer Details</h2>
        
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
          {/* From Account */}
          <div>
            <label className="block text-[#888888] text-xs uppercase tracking-wider mb-2">From Account</label>
            <select 
              value={fromAccountId} 
              onChange={(e) => {
                setFromAccountId(e.target.value);
                setToAccountId('');
              }}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg text-[#1a1a2e] text-sm focus:outline-none focus:border-[#052CE0] disabled:opacity-50 disabled:bg-[#f5f5f5] appearance-none cursor-pointer"
            >
              <option value="">Select source account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - {formatCurrency(account.balance)}
                </option>
              ))}
            </select>
          </div>

          {/* To Account */}
          <div>
            <label className="block text-[#888888] text-xs uppercase tracking-wider mb-2">To Account</label>
            <select 
              value={toAccountId} 
              onChange={(e) => setToAccountId(e.target.value)}
              disabled={!fromAccountId || isLoading}
              className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg text-[#1a1a2e] text-sm focus:outline-none focus:border-[#052CE0] disabled:opacity-50 disabled:bg-[#f5f5f5] appearance-none cursor-pointer"
            >
              <option value="">Select destination account</option>
              {availableToAccounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - {formatCurrency(account.balance)}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[#888888] text-xs uppercase tracking-wider mb-2">Amount</label>
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
            {fromAccount && (
              <p className="text-[#888888] text-xs mt-2">Available: {formatCurrency(fromAccount.balance)}</p>
            )}
          </div>

          {/* Quick Amounts */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[50, 100, 500, 1000, 5000].map(amt => (
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
            {fromAccount && (
              <button
                type="button"
                onClick={() => setAmount(fromAccount.balance.toString())}
                disabled={isLoading}
                className="px-4 py-1.5 bg-[#f5f5f5] border border-[#e0e0e0] rounded-lg text-[#666666] text-xs hover:bg-[#052CE0] hover:text-white hover:border-[#052CE0] transition-all disabled:opacity-50"
              >
                Max
              </button>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#888888] text-xs uppercase tracking-wider mb-2">Reference (Optional)</label>
            <input
              type="text"
              placeholder="Add a reference"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg text-[#1a1a2e] text-sm placeholder-[#aaaaaa] focus:outline-none focus:border-[#052CE0] disabled:opacity-50 disabled:bg-[#f5f5f5]"
            />
          </div>

          {/* Transfer Button */}
          <button 
            onClick={handleTransfer}
            disabled={isLoading || !fromAccountId || !toAccountId || !amount}
            className="w-full py-3 bg-[#052CE0] hover:bg-[#052CE0]/90 text-white text-sm font-medium tracking-wide rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Processing...' : 'Transfer Funds'}
          </button>
        </div>

        {/* Recent Transfers */}
        <div className="mt-8 pt-6 border-t border-[#e0e0e0]">
          <h3 className="text-[#888888] text-xs uppercase tracking-wider mb-4">Recent Transfers</h3>
          <div className="space-y-3">
            {[
              { from: 'Main Savings', to: 'Everyday Cheque', amount: 500, date: 'Today' },
              { from: 'Everyday Cheque', to: 'Investment Portfolio', amount: 200, date: 'Yesterday' },
              { from: 'Investment Portfolio', to: 'Main Savings', amount: 1000, date: 'Apr 10' },
            ].map((transfer, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-lg">
                <div>
                  <p className="text-[#1a1a2e] text-sm">{transfer.from} → {transfer.to}</p>
                  <p className="text-[#888888] text-xs mt-1">{transfer.date}</p>
                </div>
                <p className="text-[#666666] text-sm">-R{transfer.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={cancelTransfer}>
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-[#e0e0e0]">
              <h3 className="text-[#1a1a2e] font-light text-lg">Confirm Transfer</h3>
              <button onClick={cancelTransfer} className="text-[#888888] hover:text-[#1a1a2e] text-2xl transition-colors">×</button>
            </div>
            <div className="p-5">
              <div className="bg-[#f9f9f9] rounded-lg p-4 space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-[#888888] text-sm">From</span>
                  <span className="text-[#1a1a2e] text-sm font-medium">{fromAccount?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888] text-sm">To</span>
                  <span className="text-[#1a1a2e] text-sm font-medium">{toAccount?.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#e0e0e0]">
                  <span className="text-[#888888] text-sm">Amount</span>
                  <span className="text-[#052CE0] text-lg font-semibold">{formatCurrency(parseFloat(amount))}</span>
                </div>
                {description && (
                  <div className="flex justify-between">
                    <span className="text-[#888888] text-sm">Reference</span>
                    <span className="text-[#1a1a2e] text-sm">{description}</span>
                  </div>
                )}
              </div>
              <p className="text-[#888888] text-xs text-center">This action cannot be undone</p>
            </div>
            <div className="flex gap-3 p-5 border-t border-[#e0e0e0]">
              <button onClick={cancelTransfer} className="flex-1 py-2.5 bg-[#f5f5f5] border border-[#e0e0e0] rounded-lg text-[#666666] text-sm hover:bg-[#e0e0e0] transition-all">
                Cancel
              </button>
              <button onClick={confirmTransfer} className="flex-1 py-2.5 bg-[#052CE0] rounded-lg text-white text-sm font-medium hover:bg-[#052CE0]/90 transition-all">
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