import React, { useState } from 'react';

const AddBeneficiaryPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<'selection' | 'bank-form' | 'bank-list' | 'company-search' | 'cell-form' | 'payshap-form'>('selection');
  const [selectedBank, setSelectedBank] = useState('STANDARD BANK');
  const [searchTerm, setSearchTerm] = useState('');

  const methods = [
    { id: 'local', title: 'A Local Bank', desc: 'Pay to a South African bank account', icon: '🏛️' },
    { id: 'company', title: 'Approved Company', desc: 'Pay a utility or registered business', icon: '🏢' },
    { id: 'cell', title: 'Cell Phone Number', desc: 'Instant money to any mobile number', icon: '📱' },
    { id: 'payshap', title: 'PayShap', desc: 'Fast payment using a ShapID', icon: '💠' },
  ];

  const saBanks = [
    "ABSA BANK", "CAPITEC BANK", "FIRST NATIONAL BANK (FNB)", "INVESTEC BANK", "NEDBANK", "STANDARD BANK", "TYME BANK"
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {step !== 'selection' && (
              <button onClick={() => step === 'bank-list' ? setStep('bank-form') : setStep('selection')} className="text-slate-400 text-xl">←</button>
            )}
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              {step === 'selection' ? "Who would you like to pay?" : 
               step === 'company-search' ? "Company Search" : "Beneficiary Details"}
            </h2>
          </div>
          <button onClick={onClose} className="bg-slate-100 p-2 rounded-full text-slate-400">✕</button>
        </div>

        {/* 1. MAIN SELECTION */}
        {step === 'selection' && (
          <div className="space-y-4">
            {methods.map((method) => (
              <button 
                key={method.id}
                onClick={() => {
                  if (method.id === 'local') setStep('bank-form');
                  else if (method.id === 'company') setStep('company-search');
                  else if (method.id === 'cell') setStep('cell-form');
                  else if (method.id === 'payshap') setStep('payshap-form');
                }}
                className="w-full flex items-center gap-5 p-5 rounded-3xl border-2 border-slate-50 hover:bg-blue-50/50 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">{method.icon}</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{method.title}</h4>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{method.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 2. LOCAL BANK FORM (RE-ADDED DETAILS) */}
        {step === 'bank-form' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-2">👤</div>
              <p className="text-sm font-bold text-slate-800 tracking-tight">New Beneficiary</p>
            </div>
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <label className="text-[10px] font-bold text-blue-600 uppercase">Account holder name</label>
                <input type="text" placeholder="Enter name" className="w-full bg-transparent p-1 outline-none font-medium" />
              </div>
              <button onClick={() => setStep('bank-list')} className="w-full border-b border-slate-100 pb-2 flex justify-between items-center text-left">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bank</label>
                  <p className="font-bold text-slate-800">{selectedBank}</p>
                </div>
                <span className="text-blue-600 text-lg">〉</span>
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-b border-slate-100 pb-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Branch name</label>
                  <p className="font-bold text-slate-800 text-xs tracking-tighter">ALL BRANCHES</p>
                </div>
                <div className="border-b border-slate-100 pb-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Branch code</label>
                  <p className="font-bold text-slate-800 text-xs">00051001</p>
                </div>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Account number</label>
                <input type="number" placeholder="Enter account number" className="w-full bg-transparent p-1 outline-none font-medium" />
              </div>
              {/* References Re-Added */}
              <div className="border-b border-slate-100 pb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Their reference</label>
                <input type="text" className="w-full bg-transparent p-1 outline-none font-medium" />
              </div>
              <div className="border-b border-slate-100 pb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">My reference</label>
                <input type="text" className="w-full bg-transparent p-1 outline-none font-medium" />
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl">REVIEW</button>
          </div>
        )}

        {/* 3. APPROVED COMPANY SEARCH */}
        {step === 'company-search' && (
          <div className="space-y-8 pt-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input type="text" placeholder="Search" className="w-full bg-slate-50 rounded-2xl py-3 pl-10 pr-4 outline-none border-2 border-transparent focus:border-blue-200 text-sm" />
            </div>
            <div className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="text-4xl text-blue-600">🏢</div>
              <h3 className="font-bold text-slate-800 text-lg">Search Business Directory</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[250px]">Find the bank details for the companies, municipal services and schools.</p>
            </div>
          </div>
        )}

        {/* 4. CELL PHONE FORM (restored) */}
        {step === 'cell-form' && (
          <div className="space-y-6">
             <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-2">👤</div>
              <p className="font-bold text-slate-800">Who would you like to pay?</p>
            </div>
            <div className="space-y-4">
               <div className="border-b border-slate-100 pb-2 flex items-center gap-2">
                  <span className="font-bold text-slate-800">+27</span>
                  <input type="tel" placeholder="Cell phone number" className="w-full bg-transparent outline-none font-medium text-lg" />
               </div>
               <div className="border-b border-slate-100 pb-2">
                <label className="text-[10px] font-bold text-blue-600 uppercase">Beneficiary name</label>
                <input type="text" className="w-full bg-transparent p-1 outline-none font-medium" />
              </div>
               <div className="border-b border-slate-100 pb-2">
                <label className="text-[10px] font-bold text-blue-600 uppercase">Beneficiary surname</label>
                <input type="text" className="w-full bg-transparent p-1 outline-none font-medium" />
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl">REVIEW</button>
          </div>
        )}

        {/* 5. PAYSHAP FORM (restored) */}
        {step === 'payshap-form' && (
           <div className="space-y-6">
             <div className="flex flex-col items-center mb-4">
               <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-2">💠</div>
               <p className="font-bold text-slate-800">Who would you like to pay?</p>
             </div>
             <div className="space-y-4">
               <div className="border-b border-slate-100 pb-2">
                 <label className="text-[10px] font-bold text-blue-600 uppercase">ShapID (Proxy)</label>
                 <input type="text" placeholder="Enter ShapID" className="w-full bg-transparent p-1 outline-none font-medium" />
               </div>
               <div className="border-b border-slate-100 pb-2">
                 <label className="text-[10px] font-bold text-blue-600 uppercase">Beneficiary name</label>
                 <input type="text" className="w-full bg-transparent p-1 outline-none font-medium" />
               </div>
             </div>
             <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl">REVIEW</button>
           </div>
        )}

      </div>
    </div>
  );
};

export default AddBeneficiaryPopup;