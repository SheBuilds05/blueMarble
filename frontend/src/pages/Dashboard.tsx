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

  // Dummy accounts data (you can later replace with user?.accounts)
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
    if (!fromAccountId || !toAccountId) {
      setMessage({ text: 'Please select source and destination accounts', type: 'error' });
      return;
    }
    if (fromAccountId === toAccountId) {
      setMessage({ text: 'Cannot transfer to the same account', type: 'error' });
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage({ text: 'Enter a valid amount', type: 'error' });
      return;
    }
    if (numAmount > (fromAccount?.balance || 0)) {
      setMessage({ text: `Insufficient funds in ${fromAccount?.name}`, type: 'error' });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmTransfer = () => {
    setIsLoading(true);
    const numAmount = parseFloat(amount);
    setTimeout(() => {
      const updated = accounts.map(acc => {
        if (acc.id === fromAccountId) return { ...acc, balance: acc.balance - numAmount };
        if (acc.id === toAccountId) return { ...acc, balance: acc.balance + numAmount };
        return acc;
      });
      setAccounts(updated);
      addNotification({
        title: 'Transfer Successful',
        message: `${formatCurrency(numAmount)} transferred from ${fromAccount?.name} to ${toAccount?.name}`,
        type: 'transaction'
      });
      setMessage({ text: `Transferred ${formatCurrency(numAmount)} to ${toAccount?.name}`, type: 'success' });
      setFromAccountId('');
      setToAccountId('');
      setAmount('');
      setDescription('');
      setShowConfirmation(false);
      setTimeout(() => setMessage(null), 3000);
      setIsLoading(false);
    }, 800);
  };

  const cancelTransfer = () => setShowConfirmation(false);
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1a2a4a]">Transfer Funds</h1>
        <p className="text-gray-500">Move money between your accounts</p>
      </div>

      {/* Total balance */}
      <div className="max-w-md mx-auto mb-8 bg-white rounded-xl shadow p-4 text-center">
        <span className="text-gray-500 text-sm">Total balance</span>
        <div className="text-2xl font-bold text-[#1a2a4a]">{formatCurrency(totalBalance)}</div>
      </div>

      {/* Account cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-[#052CE0]">
            <h3 className="font-semibold">{acc.name}</h3>
            <p className="text-gray-400 text-xs">{acc.accountNumber}</p>
            <p className="text-xl font-bold mt-2">{formatCurrency(acc.balance)}</p>
          </div>
        ))}
      </div>

      {/* Transfer form */}
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Transfer Details</h2>
        {message && (
          <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <div className="space-y-4">
          <select
            value={fromAccountId}
            onChange={e => { setFromAccountId(e.target.value); setToAccountId(''); }}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">From account</option>
            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} – {formatCurrency(acc.balance)}</option>)}
          </select>
          <select
            value={toAccountId}
            onChange={e => setToAccountId(e.target.value)}
            disabled={!fromAccountId}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">To account</option>
            {availableToAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} – {formatCurrency(acc.balance)}</option>)}
          </select>
          <input
            type="number"
            placeholder="Amount (R)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Reference (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <button
            onClick={handleTransfer}
            disabled={!fromAccountId || !toAccountId || !amount || isLoading}
            className="w-full bg-[#052CE0] text-white py-3 rounded-lg font-semibold hover:bg-[#052CE0]/90 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Transfer Funds'}
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={cancelTransfer}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Confirm Transfer</h3>
            <div className="space-y-2 mb-4">
              <p><span className="text-gray-500">From:</span> {fromAccount?.name}</p>
              <p><span className="text-gray-500">To:</span> {toAccount?.name}</p>
              <p><span className="text-gray-500">Amount:</span> <span className="font-bold">{formatCurrency(parseFloat(amount))}</span></p>
              {description && <p><span className="text-gray-500">Ref:</span> {description}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={cancelTransfer} className="flex-1 py-2 border rounded-lg">Cancel</button>
              <button onClick={confirmTransfer} className="flex-1 py-2 bg-[#052CE0] text-white rounded-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;