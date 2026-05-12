import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

// --- 1. Create Account Modal Component ---
interface CreateAccountModalProps {
  onClose: () => void;
  onAccountCreated: () => void;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ onClose, onAccountCreated }) => {
  const [type, setType] = useState<string>('Savings');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [step, setStep] = useState<'selection' | 'terms'>('selection');

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/accounts', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: type, accountType: type }) // Matches backend schema key
      });

      if (response.ok) {
        onAccountCreated(); 
        onClose();
      }
    } catch (err) {
      console.error("Failed to create account", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
        {step === 'selection' ? (
          <>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Open New Account</h3>
            <p className="text-slate-500 text-sm mb-6">Choose the type of account you'd like to open today.</p>
            <div className="space-y-4">
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 border-none ring-2 ring-slate-100 focus:ring-[#052CE0] transition-all"
              >
                <option value="Savings">Savings Account</option>
                <option value="Cheque">Cheque Account</option>
                <option value="Investment">Investment Account</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 p-4 rounded-2xl bg-slate-100 font-bold text-slate-500">Cancel</button>
                <button onClick={() => setStep('terms')} className="flex-1 p-4 rounded-2xl bg-[#052CE0] text-white font-bold shadow-lg shadow-blue-200">Continue</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-black text-slate-800 mb-4">Terms & Conditions</h3>
            <div className="bg-slate-50 p-4 rounded-2xl max-h-48 overflow-y-auto mb-6 text-xs text-slate-600 leading-relaxed space-y-3 border border-slate-100">
              <p><strong>1. Account Usage:</strong> This {type} account is subject to daily limits.</p>
              <p><strong>2. Compliance:</strong> By clicking "Accept", you agree to our policies.</p>
              <p><strong>3. Fees:</strong> No monthly service fees for the first 12 months.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('selection')} className="flex-1 p-4 rounded-2xl bg-slate-100 font-bold text-slate-500">Back</button>
              <button 
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="flex-1 p-4 rounded-2xl bg-[#052CE0] text-white font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                {submitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Accept & Open'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- 2. Transaction Modal Component ---
const TransactionModal = ({ account, onClose }: { account: any, onClose: () => void }) => {
  const [realTransactions, setRealTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/auth/transactions/${account._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setRealTransactions(data);
        }
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [account._id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 text-white bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="flex justify-between items-start mb-4">
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">✕</button>
            <div className="bg-white/20 p-2 rounded-lg">💳</div>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">{account.accountType}</p>
          <h3 className="text-3xl font-black">R {account.balance.toLocaleString()}</h3>
        </div>
        <div className="p-8 max-h-[60vh] overflow-y-auto bg-white">
          <h4 className="text-slate-900 font-black mb-6">Recent Transactions</h4>
          <div className="space-y-6">
            {loading ? (
              <p className="text-center py-4 text-slate-400 font-bold italic">Fetching history...</p>
            ) : realTransactions.length === 0 ? (
              <p className="text-center py-4 text-slate-400">No transactions yet.</p>
            ) : (
              realTransactions.map((tx) => (
                <div key={tx._id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl">
                      {tx.type === 'Payment' ? '💸' : '💰'}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{tx.beneficiaryName}</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-slate-900">- R {tx.amount.toFixed(2)}</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase">Successful</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Main Accounts Page Component ---
const AccountsPage: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/accounts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-[#052CE0] animate-pulse">Loading Secure Data...</div>;

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-32 relative">
      <nav className="flex justify-between items-center p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white shadow-sm border flex items-center justify-center hover:bg-[#052CE0] hover:text-white transition-all">←</button>
          <span className="font-black text-[#1a2a4a] text-lg">My Accounts</span>
        </div>
        <button onClick={() => setShowAddModal(true)} className="w-10 h-10 rounded-full bg-[#052CE0] text-white flex items-center justify-center font-bold text-xl shadow-lg active:scale-90 transition-transform">+</button>
      </nav>

      <main className="px-6 max-w-lg mx-auto mt-4">
        <div className="space-y-4">
          {accounts.map((acc) => (
            <div 
              key={acc._id} 
              onClick={() => setSelectedAccount(acc)}
              className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 rounded-[2.5rem] shadow-xl text-white cursor-pointer active:scale-95 transition-all relative overflow-hidden group"
            >
              <div className="relative z-10">
                <p className="text-[10px] opacity-70 uppercase font-black tracking-widest">{acc.accountType}</p>
                <p className="text-xs font-mono opacity-70 mb-6">
                  **** **** **** {acc.cardDetails?.cardNumber?.slice(-4) || '0000'}
                </p>
                <h3 className="text-3xl font-black">R {acc.balance.toLocaleString()}</h3>
                <p className="text-[10px] mt-2 opacity-50 font-mono">ACC: {acc.accountNumber}</p>
              </div>
              <div className="absolute top-8 right-8 bg-white/20 p-2 rounded-xl backdrop-blur-md">💳</div>
            </div>
          ))}
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full p-8 border-2 border-dashed border-slate-300 rounded-[2.5rem] text-slate-400 font-bold hover:bg-white hover:border-[#052CE0] hover:text-[#052CE0] transition-all"
          >
            + Open New Account
          </button>
        </div>
      </main>

      {showAddModal && <CreateAccountModal onClose={() => setShowAddModal(false)} onAccountCreated={fetchAccounts} />}
      {selectedAccount && <TransactionModal account={selectedAccount} onClose={() => setSelectedAccount(null)} />}
      <BottomNav />
    </div>
  );
};

export default AccountsPage;
