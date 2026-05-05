import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, Filter, ChevronLeft, X, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const History: React.FC = () => {
  const navigate = useNavigate();

  const transactions = [
    { id: 1, desc: 'Salary Deposit', amt: '+ R 32,000.00', date: '12 April 2026', type: 'in', category: 'Income' },
    { id: 2, desc: 'Rent Payment', amt: '- R 8,500.00', date: '01 April 2026', type: 'out', category: 'Housing' },
    { id: 3, desc: 'Grocery Store', amt: '- R 1,200.00', date: '28 March 2026', type: 'out', category: 'Shopping' },
    { id: 4, desc: 'Electricity Purchase', amt: '- R 500.00', date: '25 March 2026', type: 'out', category: 'Utilities' },
    { id: 5, desc: 'Netflix Subscription', amt: '- R 199.00', date: '20 March 2026', type: 'out', category: 'Entertainment' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32 overflow-x-hidden">
      {/* Signature High-Contrast Header */}
      <nav className="bg-[#002a8f] p-8 pb-16 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        {/* Decorative Brand Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        
        <div className="max-w-lg mx-auto flex justify-between items-center relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">Archive</p>
            <h1 className="font-black text-white text-2xl uppercase tracking-tighter">Activity</h1>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10"
          >
            <X size={24} />
          </button>
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto -mt-10 relative z-20">
        {/* Balance Hero Card */}
        <div className="bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,42,143,0.08)] border border-slate-100 mb-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Current Holdings</p>
          <h2 className="text-4xl font-black text-[#000000] tracking-tighter mb-8 leading-none">R 45,670.89</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/50 p-4 rounded-[1.5rem] flex items-center gap-3">
              <div className="text-emerald-500 bg-white p-2 rounded-xl shadow-sm">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-wider">Inflow</p>
                <p className="text-sm font-black text-emerald-700 tracking-tight">+R 32k</p>
              </div>
            </div>
            <div className="bg-red-50/50 p-4 rounded-[1.5rem] flex items-center gap-3">
              <div className="text-red-500 bg-white p-2 rounded-xl shadow-sm">
                <TrendingDown size={16} />
              </div>
              <div>
                <p className="text-[8px] font-black text-red-600/60 uppercase tracking-wider">Outflow</p>
                <p className="text-sm font-black text-red-700 tracking-tight">-R 10k</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and List Title */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div>
            <h3 className="text-xs font-black text-[#000000] uppercase tracking-widest">Recent Activity</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">April 2026</p>
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-[#002a8f] shadow-sm active:scale-95 transition-all">
            <Filter size={18} />
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-[2.2rem] p-5 flex items-center justify-between border border-slate-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                  item.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  {item.type === 'in' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                
                <div>
                  <h4 className="text-sm font-black text-[#000000] leading-none mb-1 uppercase tracking-tight">{item.desc}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-[#002a8f] uppercase tracking-widest">{item.category}</span>
                    <span className="text-[9px] font-bold text-slate-300">•</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.date}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-sm font-black tracking-tighter ${
                  item.type === 'in' ? 'text-emerald-600' : 'text-[#000000]'
                }`}>
                  {item.amt}
                </p>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em]">Verified</p>
              </div>
            </div>
          ))}
        </div>

        {/* Statement Action */}
        <button className="w-full mt-8 py-6 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center gap-3 text-slate-400 hover:border-[#002a8f]/30 hover:text-[#002a8f] transition-all group">
          <FileText size={18} className="group-hover:animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Request Full Statement</span>
        </button>

        {/* Brand Slogan */}
        <div className="text-center mt-12 mb-10 opacity-30">
          <p className="text-[10px] font-black text-[#000000] uppercase tracking-[0.4em]">blueMarble Archive</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default History;