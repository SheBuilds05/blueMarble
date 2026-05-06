import React, { useState } from 'react';

const AddBeneficiaryPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Navigation State
  const [step, setStep] = useState<'selection' | 'bank-form' | 'bank-list' | 'cell-form' | 'payshap-form' | 'company-form'>('selection');
  
  // Shared Form States
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState('');
  
  // Specific Form States
  const [selectedBank, setSelectedBank] = useState('STANDARD BANK');
  const [accountNumber, setAccountNumber] = useState('');
  const [cellNumber, setCellNumber] = useState('');
  const [shapID, setShapID] = useState('');
  const [companyName, setCompanyName] = useState('');

  const methods = [
    { id: 'local', title: 'A Local Bank', desc: 'Pay to a South African bank account', icon: '🏛️' },
    { id: 'company', title: 'Approved Company', desc: 'Pay a utility or registered business', icon: '🏢' },
    { id: 'cell', title: 'Cell Phone Number', desc: 'Instant money to any mobile number', icon: '📱' },
    { id: 'payshap', title: 'PayShap', desc: 'Fast payment using a ShapID', icon: '💠' },
  ];

  const saBanks = ["ABSA BANK", "CAPITEC BANK", "FNB", "INVESTEC", "NEDBANK", "STANDARD BANK", "TYME BANK"];

  // Universal Save Function
  const handleSave = async (type: string, detail: string) => {
    if (!accountName || !detail) return alert("Please fill in all fields");
    
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
<<<<<<< HEAD
      const response = await fetch('http://localhost:5000/api/auth/beneficiaries', {
=======
      const response = await fetch('https://bluemarble.onrender.com/api/auth/beneficiaries', {
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: accountName,
          detail: detail, // Could be Acc Num, Cell Num, or ShapID
          type: type      // Tells the backend what kind of payment this is
        })
      });

      if (response.ok) onClose();
      else alert("Failed to save beneficiary.");
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 text-slate-900">
      <div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {step !== 'selection' && (
              <button onClick={() => setStep('selection')} className="text-slate-400 text-xl">←</button>
            )}
            <h2 className="text-xl font-black">{step === 'selection' ? "Who to pay?" : "Details"}</h2>
          </div>
          <button onClick={onClose} className="bg-slate-100 p-2 rounded-full text-slate-400">✕</button>
        </div>

        {/* 1. MAIN SELECTION */}
        {step === 'selection' && (
          <div className="space-y-4">
            {methods.map((m) => (
              <button 
                key={m.id}
                onClick={() => {
                  if (m.id === 'local') setStep('bank-form');
                  if (m.id === 'cell') setStep('cell-form');
                  if (m.id === 'payshap') setStep('payshap-form');
                  if (m.id === 'company') setStep('company-form');
                }}
                className="w-full flex items-center gap-5 p-5 rounded-3xl border-2 border-slate-50 hover:bg-blue-50 transition-all text-left"
              >
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">{m.icon}</div>
                <div>
                  <h4 className="font-bold text-sm">{m.title}</h4>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 2. BANK FORM */}
        {step === 'bank-form' && (
          <div className="space-y-6">
            <InputField label="Account holder name" value={accountName} onChange={setAccountName} placeholder="Name" />
            <button onClick={() => setStep('bank-list')} className="w-full border-b pb-2 flex justify-between items-center text-left">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Bank</label>
                <p className="font-bold text-slate-800">{selectedBank}</p>
              </div>
              <span className="text-blue-600">〉</span>
            </button>
            <InputField label="Account number" value={accountNumber} onChange={setAccountNumber} placeholder="Number" type="number" />
            <PrimaryButton onClick={() => handleSave('bank', accountNumber)} loading={loading} />
          </div>
        )}

        {/* 3. CELL PHONE FORM */}
        {step === 'cell-form' && (
          <div className="space-y-6 text-center">
             <div className="text-4xl mb-2">📱</div>
             <InputField label="Recipient Name" value={accountName} onChange={setAccountName} placeholder="e.g. Mom" />
             <InputField label="Mobile Number" value={cellNumber} onChange={setCellNumber} placeholder="081 234 5678" type="tel" />
             <PrimaryButton onClick={() => handleSave('cell', cellNumber)} loading={loading} />
          </div>
        )}

        {/* 4. PAYSHAP FORM */}
        {step === 'payshap-form' && (
          <div className="space-y-6">
             <div className="bg-blue-50 p-4 rounded-2xl text-[11px] text-blue-700 font-medium">
               PayShap allows instant payments using a ShapID (Cell number or ID).
             </div>
             <InputField label="Beneficiary Name" value={accountName} onChange={setAccountName} placeholder="Name" />
             <InputField label="ShapID" value={shapID} onChange={setShapID} placeholder="0812345678@shap" />
             <PrimaryButton onClick={() => handleSave('payshap', shapID)} loading={loading} />
          </div>
        )}

        {/* 5. COMPANY FORM */}
        {step === 'company-form' && (
          <div className="space-y-6">
             <InputField label="Company Name" value={accountName} onChange={setAccountName} placeholder="e.g. City Power" />
             <InputField label="Account / Reference" value={companyName} onChange={setCompanyName} placeholder="Your account number" />
             <PrimaryButton onClick={() => handleSave('company', companyName)} loading={loading} />
          </div>
        )}

        {/* BANK LIST SUB-STEP */}
        {step === 'bank-list' && (
          <div className="space-y-2">
            {saBanks.map(bank => (
              <button key={bank} onClick={() => { setSelectedBank(bank); setStep('bank-form'); }} className="w-full p-4 text-left font-bold border-b hover:bg-slate-50 rounded-xl">{bank}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Small Components to keep code clean
const InputField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="border-b border-slate-100 pb-2 text-left">
    <label className="text-[10px] font-bold text-blue-600 uppercase">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent p-1 outline-none font-medium" />
  </div>
);

const PrimaryButton = ({ onClick, loading }: any) => (
  <button onClick={onClick} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-transform">
    {loading ? "SAVING..." : "ADD BENEFICIARY"}
  </button>
);

export default AddBeneficiaryPopup;