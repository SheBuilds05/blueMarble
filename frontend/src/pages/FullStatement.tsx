import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  _id: string;
  description: string;
  amount: number; // Matches your Transactions.ts model
  date: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  category: string;
}

const FullStatement: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/transactions/history')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched Data:", data); // Helpful for debugging
        setTransactions(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(num || 0);

  // Calculate totals for the header summary
  const totalIn = transactions
    .filter(t => t.type === 'deposit')
    .reduce((acc, t) => acc + (t.amount || 0), 0);
    
  const totalOut = transactions
    .filter(t => t.type !== 'deposit')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      {/* Action Bar - Hidden during Print */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-700 font-bold">
          <ChevronLeft size={20} /> Back
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#052ce0] text-white px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          <Download size={18} /> Download Statement (PDF)
        </button>
      </div>

      {/* The Printable Statement Document */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl p-8 md:p-16 rounded-sm border border-gray-100 print:shadow-none print:border-none">
        
        {/* Statement Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-900 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#052ce0] tracking-tighter italic">BlueMarble</h1>
            <p className="text-sm text-gray-500 font-bold mt-1">SECURE DIGITAL BANKING</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-widest">Official Statement</h2>
            <p className="text-gray-500 text-sm">Date Issued: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* User & Summary Details */}
        <div className="grid grid-cols-2 gap-8 mb-12 text-sm">
          <div>
            <p className="font-bold text-gray-400 uppercase text-[10px]">Account Holder</p>
            <p className="text-lg font-bold text-gray-800">Mathapelo</p>
            <p className="text-gray-500 italic text-xs">Johannesburg, Gauteng</p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex justify-end gap-4 text-emerald-600">
              <span className="font-bold uppercase text-[10px]">Total In:</span>
              <span className="font-bold">{formatCurrency(totalIn)}</span>
            </div>
            <div className="flex justify-end gap-4 text-red-600">
              <span className="font-bold uppercase text-[10px]">Total Out:</span>
              <span className="font-bold">{formatCurrency(totalOut)}</span>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-4 text-[11px] font-black uppercase text-gray-400">Date</th>
              <th className="py-4 text-[11px] font-black uppercase text-gray-400">Description</th>
              <th className="py-4 text-[11px] font-black uppercase text-gray-400">Category</th>
              <th className="py-4 text-[11px] font-black uppercase text-gray-400 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t._id}>
                  <td className="py-4 text-sm text-gray-600">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 font-bold text-gray-800">{t.description}</td>
                  <td className="py-4 text-xs font-bold text-gray-400 uppercase">{t.category}</td>
                  <td className={`py-4 text-right font-mono font-bold ${t.type === 'deposit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {/* Updated logic: Uses t.amount with fallback to 0 if data is missing */}
                    {t.type === 'deposit' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">No transaction data available for this period.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-100 text-[10px] text-gray-400 text-center">
          <p>BlueMarble is an authorized financial services provider. This document is an electronically generated statement.</p>
          <p className="mt-1 font-bold">End of Statement</p>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; padding: 0 !important; }
          .print\\:hidden { display: none !important; }
          .max-w-4xl { max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default FullStatement;