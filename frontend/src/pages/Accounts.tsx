import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

// --- 1. Transaction Modal Component ---
const TransactionModal = ({ account, onClose }: { account: any, onClose: () => void }) => {
  // We'll keep these as dummy data for now until you create your Transaction Schema
  const transactions = [
    { id: 1, merchant: 'Shoprite Checkers', loc: 'Newton Park', time: '12:45', amount: '-R 450.00', type: 'swipe' },
    { id: 2, merchant: 'ATM Withdrawal', loc: 'Standard Bank JHB', time: '09:15', amount: '-R 1,000.00', type: 'atm' },
    { id: 3, merchant: 'Interest Earned', loc: 'Internal', time: '00:00', amount: '+R 125.45', type: 'deposit' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        {/* Modal Header */}
        <div className={`p-8 text-white bg-gradient-to-r ${account.color}`}>
          <div className="flex justify-between items-start mb-4">
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
            <div className="bg-white/20 p-2 rounded-lg">💳</div>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">{account.type}</p>
          <h3 className="text-3xl font-black">{account.balance}</h3>
        </div>

        {/* Transaction List */}
        <div className="p-8 max-h-[60vh] overflow-y-auto bg-white">
          <h4 className="text-slate-900 font-black mb-6">Recent Transactions</h4>
          <div className="space-y-6">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl">
                    {tx.type === 'swipe' ? '🛒' : tx.type === 'atm' ? '🏧' : '💰'}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">{tx.merchant}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.loc} • {tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${tx.amount.includes('+') ? 'text-green-600' : 'text-slate-900'}`}>
                    {tx.amount}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Today</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. Main Accounts Page Component ---
const AccountsPage: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/accounts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

    fetchAccounts();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-[#052CE0]">Loading Your Secure Data...</div>;

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-32 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      <nav className="flex justify-between items-center p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-[#052CE0] transition-all duration-300">
            <svg className="w-5 h-5 text-[#052CE0] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-[#052CE0] p-1 rounded-md"><div className="w-4 h-4 bg-white"></div></div>
            <span className="font-black text-[#1a2a4a] text-lg">My Accounts</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-white border-2 border-white overflow-hidden shadow-md">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" />
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto mt-4">
        <div className="space-y-4">
          {accounts.length > 0 ? accounts.map((acc) => (
            <div 
              key={acc.id} 
              onClick={() => setSelectedAccount(acc)}
              className={`bg-gradient-to-r ${acc.color} p-8 rounded-[2.5rem] shadow-xl text-white cursor-pointer active:scale-95 transition-all relative overflow-hidden group`}
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-[10px] opacity-70 uppercase font-black tracking-widest">{acc.type}</p>
                  <p className="text-xs font-mono opacity-70">{acc.mask}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">💳</div>
              </div>
              <h3 className="text-3xl font-black relative z-10">{acc.balance}</h3>
            </div>
          )) : (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-bold">No active accounts found.</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">💡</div>
              <div>
                <p className="text-xs font-black text-[#1a2a4a] uppercase tracking-widest">Financial Tip</p>
                <p className="text-sm text-slate-500">Your secure connection is active. All data is encrypted.</p>
              </div>
           </div>
        </div>
      </main>

      {selectedAccount && (
        <TransactionModal 
          account={selectedAccount} 
          onClose={() => setSelectedAccount(null)} 
        />
      )}

      <BottomNav />
    </div>
  );
};

export default AccountsPage;