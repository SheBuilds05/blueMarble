import React, { useState } from 'react';

// 1. Separate Component for the Statement Popup
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
            <button onClick={onClose} className="text-2xl">✕</button>
            <div className="bg-white/20 p-2 rounded-lg">💳</div>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">{account.type}</p>
          <h3 className="text-3xl font-black">{account.balance}</h3>
        </div>

        {/* Transaction List */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
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
          <button className="w-full mt-8 py-4 bg-slate-50 rounded-2xl text-slate-400 font-black text-[10px] tracking-widest uppercase">
            Download Full Statement
          </button>
        </div>
      </div>
    </div>
  );
};

const AccountsPage: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const accounts = [
    { id: 1, type: 'Savings Account', mask: '**** 8821', balance: 'R 45,290.00', color: 'from-blue-400 to-blue-600' },
    { id: 2, type: 'Cheque Account', mask: '**** 4412', balance: 'R 12,402.50', color: 'from-blue-900 to-blue-800' },
    { id: 3, type: 'Investment Portfolio', mask: '**** 9983', balance: 'R 66,900.00', color: 'from-slate-800 to-slate-950' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-32">
      {/* Existing Header */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded-md"><div className="w-5 h-5 bg-white"></div></div>
          <span className="font-black text-blue-900 text-xl">Standard Bank</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white overflow-hidden shadow-md">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" />
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-black text-blue-900 mb-6">My Accounts</h2>

        <div className="space-y-4">
          {accounts.map((acc) => (
            <div 
              key={acc.id} 
              onClick={() => setSelectedAccount(acc)}
              className={`bg-gradient-to-r ${acc.color} p-8 rounded-[2.5rem] shadow-xl text-white cursor-pointer active:scale-95 transition-all relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] opacity-70 uppercase font-black tracking-widest">{acc.type}</p>
                  <p className="text-xs font-mono opacity-70">{acc.mask}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-xl">💳</div>
              </div>
              <h3 className="text-3xl font-black">{acc.balance}</h3>
            </div>
          ))}
        </div>
      </main>

      {/* 2. THE POPUP LOGIC */}
      {selectedAccount && (
        <TransactionModal 
          account={selectedAccount} 
          onClose={() => setSelectedAccount(null)} 
        />
      )}

      {/* Floating Nav */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-full p-2 shadow-2xl flex justify-between items-center relative">
          <NavItem label="Home" icon="🏠" />
          <NavItem label="Account" active icon="👤" />
          <div className="w-16"></div> {/* Space for center button */}
          <button className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white w-14 h-14 rounded-full border-4 border-[#f4f7f9] flex items-center justify-center text-2xl shadow-xl">+</button>
          <NavItem label="History" icon="🕒" />
          <NavItem label="Cards" icon="💳" />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ label, icon, active = false }: any) => (
  <div className={`flex flex-col items-center px-4 py-1 ${active ? 'text-blue-600' : 'text-slate-300'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

export default AccountsPage;