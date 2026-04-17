import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Pay', icon: '$', path: '/pay' },
    { label: 'Buy', icon: '🛍️', path: '#' },
    { label: 'Deposit', icon: '⬇️', path: '#' },
    { label: 'Withdraw', icon: '⬆️', path: '#' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 text-xl font-light">✕</button>
        <h2 className="text-2xl font-bold text-slate-900 mb-10">Quick Actions</h2>
        
        <div className="grid grid-cols-2 gap-10">
          {actions.map((action) => (
            <button 
              key={action.label}
              onClick={() => {
                if(action.path !== '#') navigate(action.path);
                onClose();
              }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-600/30 transition-all duration-300">
                {action.icon}
              </div>
              <span className="font-bold text-slate-800 text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;