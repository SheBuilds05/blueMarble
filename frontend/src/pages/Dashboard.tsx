import React, { useState } from 'react';
import QuickActions from '../components/QuickActions';

const Dashboard: React.FC = () => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'account'>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 pb-32">
      {/* Header - Stays same for both tabs */}
      <nav className="flex justify-between items-center p-6 text-white">
        <div className="flex items-center gap-2">
          <div className="bg-blue-800 p-1 rounded-lg">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight">BlueMarble</span>
        </div>
        <div className="flex gap-4">
          <button className="bg-white/20 p-2 rounded-xl backdrop-blur-md">🔔</button>
          <button className="bg-white/20 p-2 rounded-xl backdrop-blur-md">⚙️</button>
          <div className="w-10 h-10 rounded-xl border-2 border-white/50 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" />
          </div>
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto space-y-8">
        {activeTab === 'home' ? (
          <>
            {/* --- HOME VIEW --- */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Net Worth</p>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-1">$124,592.00</h2>
              <p className="text-emerald-500 text-xs font-bold mt-2 flex items-center gap-1">↗ +2.4% from last month</p>
              <div className="flex gap-3 mt-8">
                <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg">Add Money</button>
                <button className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold">Transfer</button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* --- ACCOUNT VIEW (Exact Match to your Image) --- */}
            <h2 className="text-2xl font-bold text-white mb-6">My Accounts</h2>
            
            <div className="space-y-4">
              {/* Savings Account */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-300 p-6 rounded-[2rem] shadow-xl text-white relative">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] font-bold opacity-80 uppercase">Savings Account</p>
                    <p className="text-xs opacity-60">**** 8821</p>
                  </div>
                  <span className="text-xl opacity-60">💳</span>
                </div>
                <h3 className="text-3xl font-bold">$45,290.00</h3>
                <div className="absolute right-6 bottom-6 text-xl opacity-40">〉</div>
              </div>

              {/* Cheque Account */}
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 rounded-[2rem] shadow-xl text-white relative">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] font-bold opacity-80 uppercase">Cheque Account</p>
                    <p className="text-xs opacity-60">**** 4412</p>
                  </div>
                  <span className="text-xl opacity-60">🎫</span>
                </div>
                <h3 className="text-3xl font-bold">$12,402.50</h3>
                <div className="absolute right-6 bottom-6 text-xl opacity-40">〉</div>
              </div>

              {/* Investment Portfolio */}
              <div className="bg-gradient-to-r from-blue-800 to-slate-900 p-6 rounded-[2rem] shadow-xl text-white relative">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] font-bold opacity-80 uppercase">Investment Portfolio</p>
                    <p className="text-xs opacity-60">**** 9903</p>
                  </div>
                  <span className="text-xl opacity-60">⚡</span>
                </div>
                <h3 className="text-3xl font-bold">$66,900.00</h3>
                <div className="absolute right-6 bottom-6 text-xl opacity-40">〉</div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
        <div className="bg-white/90 backdrop-blur-2xl rounded-full h-20 shadow-2xl flex items-center justify-around px-4 relative">
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-bold uppercase">Home</span>
            {activeTab === 'home' && <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>}
          </button>
          
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'account' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <span className="text-xl">👤</span>
            <span className="text-[10px] font-bold uppercase">Account</span>
            {activeTab === 'account' && <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>}
          </button>

          {/* Plus Button */}
          <div className="relative -top-10">
            <button 
              onClick={() => setShowQuickActions(true)}
              className="w-16 h-16 bg-blue-600 text-white rounded-full border-[6px] border-blue-50/50 shadow-2xl flex items-center justify-center text-3xl"
            >
              +
            </button>
          </div>

          <button className="flex flex-col items-center gap-1 text-slate-400">
            <span className="text-xl">🕒</span>
            <span className="text-[10px] font-bold uppercase">History</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <span className="text-xl">💳</span>
            <span className="text-[10px] font-bold uppercase">Cards</span>
          </button>
        </div>
      </div>

      {showQuickActions && <QuickActions onClose={() => setShowQuickActions(false)} />}
    </div>
  );
};

export default Dashboard;