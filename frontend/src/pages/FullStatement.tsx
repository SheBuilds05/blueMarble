import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Import the live helpers we created
import { fetchLiveTransactions, calculateBalanceFromData, Transaction } from '../utils/bankData';

const FullStatement: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadLiveStatement = async () => {
      try {
        // Use the reusable fetcher from bankData.ts
        const data = await fetchLiveTransactions();
        setTransactions(data);
        
        // Use the reusable calculator from bankData.ts
        const total = calculateBalanceFromData(data);
        setBalance(total);
      } catch (error) {
        console.error("Error loading live statement:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLiveStatement();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-blue-600 mb-6 font-bold hover:underline group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to History
        </button>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center">
              <FileText className="mr-3 text-blue-600" /> Full Statement
            </h1>
            <p className="text-slate-500">
              Official Live Record • {new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={() => window.print()} 
            className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <Download size={18} className="mr-2" /> Download PDF
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-8 bg-[#052ce0] text-white">
            <p className="opacity-80 uppercase text-xs font-bold tracking-widest">Net Account Balance</p>
            <h2 className="text-4xl font-bold">
              R {balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b text-slate-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-5">Date</th>
                  <th className="p-5">Description</th>
                  <th className="p-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-5 text-slate-500 text-sm">
                        {new Date(t.date).toLocaleDateString('en-ZA')}
                      </td>
                      <td className="p-5 font-bold text-slate-800">{t.description}</td>
                      <td className={`p-5 text-right font-black ${t.type === 'deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {t.type === 'deposit' ? '+' : '-'} R {t.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-slate-400 italic">
                      No live transaction data available in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <p className="mt-6 text-center text-xs text-slate-400 font-medium">
          This statement is generated in real-time from your secure database records.
        </p>
      </div>
    </div>
  );
};

export default FullStatement;