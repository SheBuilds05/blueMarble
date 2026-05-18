import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ChevronLeft, Loader2, FileText } from 'lucide-react';
import api from '../services/api';

interface Transaction {
  _id: string;
  beneficiaryName: string;
  amount: number;
  date: string;
  type: 'Deposit' | 'Payment' | 'Purchase' | 'Transfer';
  category?: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState({ income: 0, expenses: 0, balance: 0 });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/transactions');
        const data = response.data;
        
        console.log('Fetched transactions:', data);
        setTransactions(data);
        
        // Calculate based on your schema
        const income = data
          .filter((t: Transaction) => t.type === 'Deposit')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        
        const expenses = data
          .filter((t: Transaction) => t.type !== 'Deposit')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        
        setTotals({ 
          income, 
          expenses, 
          balance: income - expenses 
        });
      } catch (error: any) {
        console.error("Error fetching transactions:", error);
        setError(error.message || 'Failed to load transaction history');
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

  const getTransactionIcon = (type: string) => {
    if (type === 'Deposit') return <ArrowDownLeft size={20} />;
    return <ArrowUpRight size={20} />;
  };

  const getTransactionColor = (type: string) => {
    return type === 'Deposit' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader2 className="w-10 h-10 text-[#052ce0] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Load History</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Make sure backend is running on port 5000
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
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

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
              {transactions.length} {transactions.length === 1 ? 'Transaction' : 'Transactions'}
            </span>
          </div>
          
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getTransactionColor(item.type)}`}>
                      {getTransactionIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">
                        {item.beneficiaryName || item.reference || 'Transaction'}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-1">
                        {item.category || item.type} • {new Date(item.date).toLocaleDateString('en-ZA')}
                      </p>
                    </div>
                  </div>
                  <p className={`font-black text-lg ${item.type === 'Deposit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {item.type === 'Deposit' ? '+' : '-'} {formatCurrency(item.amount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-400 font-bold italic">No transaction history found</p>
                <p className="text-slate-300 text-sm">Add transactions to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;