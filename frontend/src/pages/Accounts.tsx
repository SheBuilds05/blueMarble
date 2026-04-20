import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
// 1. Transaction Modal Component (Statement Popup)
// Now accepts dynamic transactions based on the selected account
const TransactionModal = ({ account, onClose }: { account: any, onClose: () => void }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Fetching transactions specific to this account ID
        const response = await fetch(`http://localhost:5000/api/transactions/${account._id || account.id}`);
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [account]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        <div className={`p-8 text-white bg-gradient-to-r ${account.color}`}>
          <div className="flex justify-between items-start mb-4">
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">✕</button>
            <div className="bg-white/20 p-2 rounded-lg">💳</div>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">{account.type}</p>
          <h3 className="text-3xl font-black">
            R {account.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto bg-white">
          <h4 className="text-slate-900 font-black mb-6">Recent Transactions</h4>
          <div className="space-y-6">
            {loading ? (
              <p className="text-center py-10 text-slate-400 font-bold italic">Loading statement...</p>
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx._id || tx.id} className="flex justify-between items-center">
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
                    <p className={`font-black text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                      {tx.amount > 0 ? `+R ${tx.amount}` : `-R ${Math.abs(tx.amount)}`}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Today</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-[10px]">No transactions found</p>
            )}
          </div>
          <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl text-slate-400 font-black text-[10px] tracking-widest uppercase">
            Download Full Statement
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Main Accounts Page Component
const AccountsPage: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5000/api/accounts/${userId}`);
        const data = await response.json();
        
        // Mapping backend data to Nkhensani's visual colors
        const colorMap = [
            'from-[#3b82f6] to-[#052CE0]',
            'from-[#1e40af] to-[#1e3a8a]',
            'from-slate-800 to-slate-950'
        ];

        const enrichedAccounts = data.map((acc: any, index: number) => ({
            ...acc,
            color: colorMap[index % colorMap.length]
        }));

        setAccounts(enrichedAccounts);
      } catch (err) {
        console.error("Database connection failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-32 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      <nav className="flex justify-between items-center p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-[#052CE0] transition-all">
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
          {loading ? (
             <div className="p-20 text-center animate-pulse text-[#052CE0] font-black uppercase tracking-[0.3em] text-xs">Connecting to Vault...</div>
          ) : accounts.map((acc) => (
            <div 
              key={acc._id || acc.id} 
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
              <h3 className="text-3xl font-black relative z-10">
                R {acc.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </h3>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter opacity-50">
                <span>View Transactions</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">💡</div>
              <div>
                <p className="text-xs font-black text-[#1a2a4a] uppercase tracking-widest">Financial Tip</p>
                <p className="text-sm text-slate-500">Your savings increased by 4% this month. Keep it up!</p>
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

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
};



export default AccountsPage;