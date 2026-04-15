import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Filter, ChevronLeft } from 'lucide-react';

const History: React.FC = () => {
  const brandBlue = '#052ce0';

  const transactions = [
    { id: 1, desc: 'Salary Deposit', amt: '+ R 32,000.00', date: '12 April 2026', type: 'in', category: 'Income' },
    { id: 2, desc: 'Rent Payment', amt: '- R 8,500.00', date: '01 April 2026', type: 'out', category: 'Housing' },
    { id: 3, desc: 'Grocery Store', amt: '- R 1,200.00', date: '28 March 2026', type: 'out', category: 'Shopping' },
    { id: 4, desc: 'Electricity Purchase', amt: '- R 500.00', date: '25 March 2026', type: 'out', category: 'Utilities' },
    { id: 5, desc: 'Netflix Subscription', amt: '- R 199.00', date: '20 March 2026', type: 'out', category: 'Entertainment' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8 relative">
      {/* Decorative Header Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <button 
          onClick={() => window.history.back()} 
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:bg-[#052CE0] transition-all duration-300"
          title="Go Back"
        >
          <ChevronLeft className="w-5 h-5 text-[#052CE0] group-hover:text-white transition-colors" />
        </button>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-bold text-[#4a5a7a] hover:bg-white transition-all">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a2a4a] tracking-tight">Transaction History</h1>
        <p className="text-[#4a5a7a] text-sm mt-2">Track your spending and deposits</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Account Summary Card */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-[#718096] font-bold text-xs uppercase tracking-widest mb-1">Total Available Balance</p>
            <h2 className="text-4xl font-black text-[#1A202C]">R 45,670.89</h2>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-[10px] text-emerald-600 font-bold uppercase">This Month In</p>
              <p className="text-emerald-700 font-bold">+R 32,000</p>
            </div>
            <div className="px-4 py-2 bg-red-50 rounded-lg border border-red-100">
              <p className="text-[10px] text-red-600 font-bold uppercase">This Month Out</p>
              <p className="text-red-700 font-bold">-R 10,399</p>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-[#1a2a4a]">Recent Activity</h3>
            <span className="text-xs font-bold text-[#052CE0] bg-blue-50 px-3 py-1 rounded-full">April 2026</span>
          </div>

          <div className="divide-y divide-gray-50">
            {transactions.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-5 hover:bg-gray-50/80 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className={`p-3 rounded-2xl shadow-sm ${
                    item.type === 'in' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                  }`}>
                    {item.type === 'in' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <p className="font-bold text-[#1a2a4a] group-hover:text-[#052ce0] transition-colors">{item.desc}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-bold text-[#a0aec0]">{item.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-[11px] font-bold text-[#052ce0]/70 uppercase">{item.category}</span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className={`font-black text-lg ${
                    item.type === 'in' ? 'text-emerald-500' : 'text-[#1a2a4a]'
                  }`}>
                    {item.amt}
                  </p>
                  <p className="text-[10px] font-bold text-[#a0aec0] uppercase">Successful</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <button className="w-full py-5 text-sm font-bold text-[#052ce0] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            <span>View Full Statement</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
      
      {/* Footer Info */}
      <p className="text-center text-[#a0aec0] text-xs mt-10">
        Showing last 30 days of activity. For older records, please request a formal statement.
      </p>
    </div>
  );
};

export default History;