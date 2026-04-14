import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddBeneficiaryPopup from '../components/AddBeneficiaryPopup';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [view, setView] = useState<'list' | 'pay-details'>('list');
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);

  const recentPayments = [
    { name: 'Mom Ntsako', detail: '+27799817898', date: '12 April 2026', initials: 'MN' },
    { name: 'Johannesburg Water', detail: 'Acc: 99281', date: '08 April 2026', initials: 'JW' },
    { name: 'Thabo Mokoena', detail: '+27824419022', date: '01 April 2026', initials: 'TM' },
  ];

  const handlePayClick = (person: any) => {
    setSelectedRecipient(person);
    setView('pay-details');
  };

  if (view === 'pay-details') {
    return (
      <div className="min-h-screen bg-[#f4f7f9] pb-10">
        {/* Header matching your screenshot */}
        <header className="sticky top-0 bg-[#f4f7f9] z-10 flex justify-between items-center p-6 border-b border-white">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="text-blue-600 text-2xl font-light">✕</button>
            <h1 className="text-lg font-bold text-slate-800">Payment Details</h1>
          </div>
          <button className="text-blue-600 font-bold text-xs border border-blue-600 px-4 py-1.5 rounded uppercase tracking-wider">Review</button>
        </header>

        <main className="p-6 space-y-6 max-w-md mx-auto">
          {/* FROM SECTION */}
          <section className="space-y-2">
            <p className="text-blue-800 font-bold text-[10px] uppercase tracking-[0.1em]">From</p>
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">P</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">SAVINGS</p>
                  <p className="text-[11px] text-slate-500">20121997091</p>
                  <p className="text-[10px] font-bold text-slate-800">Available balance <span className="text-slate-500 font-medium ml-1">R 86 002.62</span></p>
                </div>
              </div>
              <span className="text-slate-300">〉</span>
            </div>
          </section>

          {/* TO SECTION with AMOUNT */}
          <section className="space-y-2">
            <p className="text-blue-800 font-bold text-[10px] uppercase tracking-[0.1em]">To</p>
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-4 flex items-center gap-3 border-b border-slate-50">
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {selectedRecipient?.initials}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{selectedRecipient?.name}</p>
                  <p className="text-[11px] text-slate-500">{selectedRecipient?.detail}</p>
                </div>
              </div>
              
              {/* Amount Strip */}
              <div className="flex items-stretch bg-white">
                <div className="bg-blue-600 text-white px-6 flex items-center text-2xl font-medium">R</div>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full p-5 text-3xl font-bold text-blue-600 outline-none placeholder:text-blue-200"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic px-1">R 50.00 to R 5 000.00 in denominations of R 10.00</p>
          </section>

          {/* PIN GENERATION SECTION */}
          <section className="bg-white p-6 rounded-xl border border-slate-100 space-y-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Cash collection PIN</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">Select a PIN or generate it (Remember to send the PIN if you're paying someone)</p>
              </div>
              <div className="text-blue-600 border border-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">i</div>
            </div>

            <div className="flex justify-center gap-4 py-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 border-b-2 border-slate-200 h-8"></div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[10px] text-slate-400 text-center px-4">Avoid using consecutive numbers (1 2 3 4) or repeating numbers (1 2 2 4)</p>
              <button className="text-blue-600 font-bold text-[10px] border border-blue-200 py-3 rounded-lg hover:bg-blue-50 transition-colors uppercase tracking-wider">Generate Pin</button>
            </div>
          </section>

          {/* REFERENCE SECTION */}
          <section className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-blue-800 font-bold text-[10px] uppercase mb-4 tracking-wider">References</p>
            <div className="border-b border-slate-100 pb-2">
              <label className="text-[10px] text-slate-400 font-bold">My reference</label>
              <input 
                type="text" 
                defaultValue={selectedRecipient?.name.split(' ')[0].toLowerCase()} 
                className="w-full block font-bold text-slate-800 outline-none bg-transparent" 
              />
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 pb-32">
      <header className="flex items-center justify-between p-6 text-white">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-2xl font-light">✕</button>
          <h1 className="text-xl font-bold">Pay</h1>
        </div>
      </header>

      <main className="px-6 space-y-6 max-w-lg mx-auto">
       

        <div className="space-y-4">
          <h2 className="font-bold text-white text-lg px-2">Recently paid</h2>
          
          <button 
            onClick={() => setShowAddPopup(true)}
            className="w-full bg-white/95 rounded-2xl p-6 flex items-center gap-4 shadow-xl"
          >
            <div className="w-10 h-10 border-2 border-dashed border-blue-600 rounded-full flex items-center justify-center text-blue-600">+</div>
            <span className="font-bold text-blue-600">Add new beneficiary</span>
          </button>

          <div className="space-y-3">
            {recentPayments.map((person, i) => (
              <div key={i} className="bg-white/95 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-800">
                    {person.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{person.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{person.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handlePayClick(person)}
                  className="border-2 border-blue-600 text-blue-600 px-5 py-1.5 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                >
                  PAY
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showAddPopup && <AddBeneficiaryPopup onClose={() => setShowAddPopup(false)} />}
    </div>
  );
};

export default PaymentPage;