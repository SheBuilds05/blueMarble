import React from 'react';

interface SuccessProps {
  amount: string;
  recipient: string;
  reference: string;
  onClose: () => void;
}

const PaymentSuccess: React.FC<SuccessProps> = ({ amount, recipient, reference, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-300">
      <main className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
        {/* Animated Checkmark Circle */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Payment Successful</h2>
          <p className="text-slate-500 text-sm">Your transfer has been processed.</p>
        </div>

        {/* Receipt Card */}
        <div className="w-full max-w-sm bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Amount</span>
            <span className="text-blue-600 font-bold">R {parseFloat(amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Recipient</span>
            <span className="text-slate-800 font-medium">{recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Reference</span>
            <span className="text-slate-800 font-medium">{reference}</span>
          </div>
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
            <span>Date: {new Date().toLocaleDateString('en-ZA')}</span>
            <span>Auth: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          </div>
        </div>
      </main>

      <footer className="p-8 space-y-3">
        <button 
          onClick={() => window.print()} 
          className="w-full py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold active:scale-95 transition-transform"
        >
          Share Receipt
        </button>
        <button 
          onClick={onClose} 
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold active:scale-95 transition-transform"
        >
          Back to Home
        </button>
      </footer>
    </div>
  );
};

export default PaymentSuccess;