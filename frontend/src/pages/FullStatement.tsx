import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// This now perfectly matches your Transaction.ts model
interface Transaction {
  _id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  description: string;
  category: 'Groceries' | 'Rent' | 'Salary' | 'Entertainment' | 'Other';
  date: string;
}

const FullStatement: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/transactions/history')
      .then(res => res.json())
      .then(data => {
        // Debugging: This will show in your browser console (F12) 
        // to verify if 'amount' exists in the objects
        console.log("Statement Data Received:", data);
        setTransactions(data);
      })
      .catch(err => console.error("Statement fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => window.print();

  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(num || 0);

  // Calculate Summary Totals
  const totalIn = transactions
    .filter(t => t.type === 'deposit')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    
  const totalOut = transactions
    .filter(t => t.type !== 'deposit')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      {/* Hidden during print */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-[#052ce0] font-bold transition-colors">
          <ChevronLeft size={20} /> Back to History
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#052ce0] text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
        >
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* Printable Area */}
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-sm print:shadow-none border border-gray-200 print:border-none rounded-sm">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#052ce0] italic tracking-tighter">BlueMarble</h1>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Official Digital Statement</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-gray-800 uppercase">Account Statement</h2>
            <p className="text-xs text-gray-500 font-medium">Generated: {new Date().toLocaleDateString('en-ZA')}</p>
          </div>
        </div>

        {/* Account Info & Summary */}
        <div className="grid grid-cols-2 gap-10 mb-12">
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-2">Account Details</h3>
            <p className="text-lg font-bold text-gray-800">Mathapelo</p>
            <p className="text-sm text-gray-500">Fullstack Developer | Johannesburg</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center text-right">
            <div className="flex justify-between text-emerald-600 mb-1">
              <span className="text-[10px] font-bold uppercase">Deposits (+)</span>
              <span className="font-bold">{formatCurrency(totalIn)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span className="text-[10px] font-bold uppercase">Withdrawals (-)</span>
              <span className="font-bold">{formatCurrency(totalOut)}</span>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-3 text-left text-[10px] font-black text-gray-400 uppercase">Date</th>
              <th className="py-3 text-left text-[10px] font-black text-gray-400 uppercase">Description</th>
              <th className="py-3 text-left text-[10px] font-black text-gray-400 uppercase">Category</th>
              <th className="py-3 text-right text-[10px] font-black text-gray-400 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t._id} className="group">
                  <td className="py-4 text-xs text-gray-600">
                    {new Date(t.date).toLocaleDateString('en-ZA')}
                  </td>
                  <td className="py-4 text-sm font-bold text-gray-800">{t.description}</td>
                  <td className="py-4 text-[10px] font-bold text-gray-400 uppercase">{t.category}</td>
                  <td className={`py-4 text-right font-mono font-bold ${t.type === 'deposit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {t.type === 'deposit' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-400 font-medium italic">
                  {loading ? "Accessing secure records..." : "No transaction history found for this account."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Signature/End Line */}
        <div className="mt-20 pt-8 border-t border-gray-100 flex justify-between items-end">
          <div className="text-[9px] text-gray-400 max-w-sm">
            This statement is an official record of the BlueMarble Banking System. 
            Issued from Johannesburg, Gauteng.
          </div>
          <div className="text-center">
            <div className="w-32 border-b border-gray-400 mb-1"></div>
            <p className="text-[9px] text-gray-400 uppercase font-bold">Authorized Signature</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          .max-w-4xl { max-width: 100% !important; border: none !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default FullStatement;