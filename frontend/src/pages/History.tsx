import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import { ArrowUpRight, ArrowDownLeft, Filter, ChevronLeft, Loader2 } from 'lucide-react';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  category: string;
}

const History: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // These will now be calculated from your data
  const [totals, setTotals] = useState({ income: 0, expenses: 0, balance: 45670.89 });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/transactions/history');
        const data: Transaction[] = await response.json();
        
        setTransactions(data);

        // Calculate Income and Expenses from the fetched data
        const income = data
          .filter(t => t.type === 'deposit')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = data
          .filter(t => t.type === 'withdraw' || t.type === 'transfer')
          .reduce((sum, t) => sum + t.amount, 0);

        setTotals(prev => ({ ...prev, income, expenses }));
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader2 className="w-10 h-10 text-[#052ce0] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} // Works with React Router history
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:bg-[#052CE0] transition-all duration-300"
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

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a2a4a] tracking-tight">Transaction History</h1>
        <p className="text-[#4a5a7a] text-sm mt-2">Track your spending and deposits</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Account Summary Card - Now with Dynamic Totals */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-[#718096] font-bold text-xs uppercase tracking-widest mb-1">Total Available Balance</p>
            <h2 className="text-4xl font-black text-[#1A202C]">{formatCurrency(totals.balance)}</h2>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-[10px] text-emerald-600 font-bold uppercase">Income</p>
              <p className="text-emerald-700 font-bold">+{formatCurrency(totals.income)}</p>
            </div>
            <div className="px-4 py-2 bg-red-50 rounded-lg border border-red-100">
              <p className="text-[10px] text-red-600 font-bold uppercase">Expenses</p>
              <p className="text-red-700 font-bold">-{formatCurrency(totals.expenses)}</p>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-[#1a2a4a]">Recent Activity</h3>
            <span className="text-xs font-bold text-[#052CE0] bg-blue-50 px-3 py-1 rounded-full">Active Records</span>
          </div>

          <div className="divide-y divide-gray-50">
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-5 hover:bg-gray-50/80 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl shadow-sm ${
                      item.type === 'deposit' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                    }`}>
                      {item.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-[#1a2a4a] group-hover:text-[#052ce0] transition-colors">{item.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-[#a0aec0]">
                          {new Date(item.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-[11px] font-bold text-[#052ce0]/70 uppercase">{item.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg ${item.type === 'deposit' ? 'text-emerald-500' : 'text-[#1a2a4a]'}`}>
                      {item.type === 'deposit' ? '+' : '-'} {formatCurrency(item.amount)}
                    </p>
                    <p className="text-[10px] font-bold text-[#a0aec0] uppercase">Successful</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400 font-bold">No transactions found.</div>
            )}
          </div>

          {/* Fixed Button - Navigates to a detailed view */}
          <button 
            onClick={() => navigate('/full-statement')}
            className="w-full py-5 text-sm font-bold text-[#052ce0] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>View Full Statement</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
      
      <p className="text-center text-[#a0aec0] text-xs mt-10">
        Showing live activity from BlueMarble Secure Server.
      </p>
    </div>
  );
};

export default History;