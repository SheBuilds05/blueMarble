import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ChevronLeft, Loader2, FileText } from 'lucide-react';

// Locally defined interface to ensure zero import errors
interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  category: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ income: 0, expenses: 0, balance: 0 });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Fetching from your actual API
        const response = await fetch('http://localhost:5000/api/transactions/history');
        const data: Transaction[] = await response.json();
        
        setTransactions(data);

        // Calculate everything dynamically from the live data
        const income = data
          .filter((t: Transaction) => t.type === 'deposit')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        
        const expenses = data
          .filter((t: Transaction) => t.type !== 'deposit')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

        setTotals({ 
          income, 
          expenses, 
          balance: income - expenses 
        });
      } catch (error) {
        console.error("Error fetching live data:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { 
      style: 'currency', 
      currency: 'ZAR' 
    }).format(amount);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <Loader2 className="w-10 h-10 text-[#052ce0] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER & NAV */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-600 group transition-all"
          >
            <ChevronLeft className="text-blue-600 group-hover:text-white" />
          </button>

          <button 
            onClick={() => navigate('/full-statement')} 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-sm"
          >
            <FileText size={16} />
            <span>Full Statement</span>
          </button>
        </div>

        {/* BALANCE SUMMARY CARD */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Available Balance</p>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">{formatCurrency(totals.balance)}</h2>
            </div>
            <div className="flex gap-3">
              <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-center">
                <p className="text-[10px] text-emerald-600 font-bold uppercase">Income</p>
                <p className="text-emerald-700 font-bold">+{formatCurrency(totals.income)}</p>
              </div>
              <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100 text-center">
                <p className="text-[10px] text-red-600 font-bold uppercase">Expenses</p>
                <p className="text-red-700 font-bold">-{formatCurrency(totals.expenses)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY LIST */}
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
              Live Feed
            </span>
          </div>
          
          <div className="divide-y max-h-[500px] overflow-y-auto custom-scrollbar">
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${item.type === 'deposit' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {item.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">{item.description}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-1">
                        {item.category} • {new Date(item.date).toLocaleDateString('en-ZA')}
                      </p>
                    </div>
                  </div>
                  <p className={`font-black text-lg ${item.type === 'deposit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {item.type === 'deposit' ? '+' : '-'} {formatCurrency(item.amount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-400 font-bold italic">No transactions found in your database.</p>
                <p className="text-slate-300 text-sm">New activity will appear here automatically.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;