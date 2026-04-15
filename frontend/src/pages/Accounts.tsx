import React, { useState } from 'react';

// 1. Transaction Modal Component (Statement Popup)
const TransactionModal = ({ account, onClose }: { account: any, onClose: () => void }) => {
  const transactions = [
    { id: 1, merchant: 'Shoprite Checkers', loc: 'Newton Park', time: '12:45', amount: '-R 450.00', type: 'swipe' },
    { id: 2, merchant: 'ATM Withdrawal', loc: 'Standard Bank JHB', time: '09:15', amount: '-R 1,000.00', type: 'atm' },
    { id: 3, merchant: 'Interest Earned', loc: 'Internal', time: '00:00', amount: '+R 125.45', type: 'deposit' },
    { id: 4, merchant: 'Shell Garage', loc: 'Cape Town', time: '18:20', amount: '-R 900.00', type: 'swipe' },
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

  const accounts = [
    { id: 1, type: 'Savings Account', mask: '**** 8821', balance: 'R 45,290.00', color: 'from-[#3b82f6] to-[#052CE0]' },
    { id: 2, type: 'Cheque Account', mask: '**** 4412', balance: 'R 12,402.50', color: 'from-[#1e40af] to-[#1e3a8a]' },
    { id: 3, type: 'Investment Portfolio', mask: '**** 9983', balance: 'R 66,900.00', color: 'from-slate-800 to-slate-950' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-32 relative">
      {/* Decorative Header Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      {/* Navigation Header */}
      <nav className="flex justify-between items-center p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.history.back()} 
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-[#052CE0] transition-all duration-300"
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
          {accounts.map((acc) => (
            <div 
              key={acc.id} 
              onClick={() => setSelectedAccount(acc)}
              className={`bg-gradient-to-r ${acc.color} p-8 rounded-[2.5rem] shadow-xl text-white cursor-pointer active:scale-95 transition-all relative overflow-hidden group`}
            >
              {/* Card Decoration */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-[10px] opacity-70 uppercase font-black tracking-widest">{acc.type}</p>
                  <p className="text-xs font-mono opacity-70">{acc.mask}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">💳</div>
              </div>
              <h3 className="text-3xl font-black relative z-10">{acc.balance}</h3>
              
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter opacity-50">
                <span>View Transactions</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
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

      {/* Transaction Modal Logic */}
      {selectedAccount && (
        <TransactionModal 
          account={selectedAccount} 
          onClose={() => setSelectedAccount(null)} 
        />
      )}

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className="bg-white/90 backdrop-blur-xl rounded-full p-2 shadow-2xl flex justify-between items-center relative border border-white/50">
          <NavItem label="Home" icon="🏠" />
          <NavItem label="Account" active icon="👤" />
          
          {/* Central Action Button */}
          <div className="w-16"></div> 
          <button className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#052CE0] text-white w-14 h-14 rounded-full border-4 border-[#f4f7f9] flex items-center justify-center text-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
            +
          </button>
          
          <NavItem label="History" icon="🕒" />
          <NavItem label="Cards" icon="💳" />
        </div>
      </div>
    </div>
  );
};

// NavItem Component
const NavItem = ({ label, icon, active = false }: any) => (
  <button className={`flex flex-col items-center px-4 py-1 transition-all ${active ? 'text-[#052CE0]' : 'text-slate-300 hover:text-slate-400'}`}>
    <span className="text-xl mb-0.5">{icon}</span>
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    {active && <div className="w-1 h-1 bg-[#052CE0] rounded-full mt-1"></div>}
  </button>
);

export default AccountsPage;