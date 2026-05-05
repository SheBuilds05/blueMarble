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
      const response = await fetch('https://bluemarble.onrender.com/api/auth/accounts', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: type, accountType: type })
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
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-white/20">
        {step === 'selection' ? (
          <>
            <h3 className="text-2xl font-black text-[#000000] mb-2 uppercase tracking-tighter">Open New Account</h3>
            <p className="text-slate-500 text-sm mb-6 font-bold">Choose your account type.</p>
            <div className="space-y-4">
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl font-black text-[#000000] border-none ring-2 ring-slate-100 focus:ring-[#002a8f] transition-all"
              >
                <option value="Savings">Savings Account</option>
                <option value="Cheque">Cheque Account</option>
                <option value="Investment">Investment Account</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 p-4 rounded-2xl bg-slate-100 font-black text-[#000000] uppercase text-xs tracking-widest">Cancel</button>
                <button onClick={() => setStep('terms')} className="flex-1 p-4 rounded-2xl bg-[#002a8f] text-white font-black uppercase text-xs tracking-widest shadow-lg">Continue</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-black text-[#000000] mb-4 uppercase tracking-tighter">Terms & Conditions</h3>
            <div className="bg-slate-50 p-4 rounded-2xl max-h-48 overflow-y-auto mb-6 text-xs text-slate-900 leading-relaxed space-y-3 border border-slate-100 font-bold">
              <p><strong>1. Account Usage:</strong> Subject to daily limits.</p>
              <p><strong>2. Compliance:</strong> You agree to our bank policies.</p>
              <p><strong>3. Fees:</strong> No service fees for 12 months.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('selection')} className="flex-1 p-4 rounded-2xl bg-slate-100 font-black text-[#000000] uppercase text-xs tracking-widest">Back</button>
              <button 
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="flex-1 p-4 rounded-2xl bg-[#002a8f] text-white font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2"
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
        const response = await fetch(`https://bluemarble.onrender.com/api/auth/transactions/${account._id}`, {
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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#001d66]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)]">
        <div className="p-8 text-white bg-[#002a8f]">
          <div className="flex justify-between items-start mb-6">
            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white font-black">✕</button>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">💳</div>
          </div>
          <p className="text-[11px] uppercase font-black tracking-[0.3em] opacity-60 mb-1">{account.accountType}</p>
          <h3 className="text-4xl font-black tracking-tighter">R {account.balance.toLocaleString()}</h3>
        </div>
        <div className="p-8 max-h-[50vh] overflow-y-auto bg-white">
          <h4 className="text-[#000000] font-black text-xs uppercase tracking-[0.2em] mb-8">Activity History</h4>
          <div className="space-y-6">
            {loading ? (
              <p className="text-center py-4 text-[#002a8f] font-black animate-pulse uppercase text-[10px]">Syncing Records...</p>
            ) : realTransactions.length === 0 ? (
              <p className="text-center py-8 text-slate-400 font-bold">No recent movement found.</p>
            ) : (
              realTransactions.map((tx) => (
                <div key={tx._id} className="flex justify-between items-center bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center text-xl">
                      {tx.type === 'Payment' ? '💸' : '💰'}
                    </div>
                    <div>
                      <h5 className="font-black text-[#000000] text-sm uppercase tracking-tighter">{tx.beneficiaryName}</h5>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-[#000000]">- R {tx.amount.toFixed(2)}</p>
                    <p className="text-[9px] text-green-600 font-black uppercase tracking-widest">Cleared</p>
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
      const response = await fetch('https://bluemarble.onrender.com/api/auth/accounts', {
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

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#001d66]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="font-black text-white uppercase tracking-[0.4em] text-[10px]">Loading Vault</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32 relative">
      {/* Header Styled like Dashboard */}
      <nav className="bg-[#002a8f] p-8 pb-12 rounded-b-[3.5rem] shadow-2xl">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()} 
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black hover:bg-white/20 transition-all"
            >
              ←
            </button>
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">BlueMarble Vault</p>
              <h1 className="font-black text-white text-2xl uppercase tracking-tighter">My Accounts</h1>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="w-14 h-14 rounded-[1.5rem] bg-white text-[#002a8f] flex items-center justify-center font-black text-2xl shadow-2xl active:scale-90 transition-transform"
          >
            +
          </button>
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto -mt-6">
        <div className="space-y-6">
          {accounts.map((acc) => (
            <div 
              key={acc._id} 
              onClick={() => setSelectedAccount(acc)}
              className="bg-[#002a8f] p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,42,143,0.3)] text-white cursor-pointer active:scale-95 transition-all relative overflow-hidden group"
            >
              {/* Background Accent */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] text-white/60 uppercase font-black tracking-[0.3em] mb-1">{acc.accountType}</p>
                    <p className="text-xs font-black tracking-widest text-white/40">
                      •••• •••• •••• {acc.cardDetails?.cardNumber?.slice(-4) || '8842'}
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xl border border-white/10">💳</div>
                </div>
                
                <h3 className="text-4xl font-black tracking-tighter">R {acc.balance.toLocaleString()}</h3>
                
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <p className="text-[9px] font-black tracking-widest text-white/40 uppercase">ACC: {acc.accountNumber}</p>
                  <span className="text-[9px] font-black bg-white text-[#002a8f] px-3 py-1 rounded-full uppercase tracking-widest">Details</span>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full p-10 border-4 border-dashed border-slate-200 rounded-[3rem] text-[#002a8f]/30 font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:border-[#002a8f] hover:text-[#002a8f] transition-all group"
          >
            <span className="group-hover:scale-110 transition-transform block">+ Add New Account</span>
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