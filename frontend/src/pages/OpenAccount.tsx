import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OpenAccount: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', 
    surname: '',
    idNumber: '',
    email: '',
    phone: '',
    address: '',
    employment: 'Employed',
    balance: '0'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!idFile) {
      Swal.fire('Missing Document', 'Please upload a certified copy of your ID.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => dataToSend.append(key, value));
      dataToSend.append('idCopy', idFile);

      const response = await fetch('http://localhost:5000/api/auth/open-account', {
        method: 'POST',
        body: dataToSend, 
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: Show the generated account and card details
        Swal.fire({
          icon: 'success',
          title: 'Account Created Successfully!',
          html: `
            <div style="text-align: left; background: #f1f5f9; padding: 20px; border-radius: 15px; border: 1px solid #e2e8f0; font-family: sans-serif;">
              <p style="margin-bottom: 8px;"><strong style="color: #64748b; font-size: 10px; uppercase;">ACCOUNT NUMBER</strong><br/><span style="font-size: 18px; font-weight: 900; color: #0f172a;">${data.accountNumber}</span></p>
              <p style="margin-bottom: 8px;"><strong style="color: #64748b; font-size: 10px; uppercase;">VIRTUAL CARD NUMBER</strong><br/><span style="font-size: 16px; font-weight: 700; color: #0f172a;">${data.cardNumber}</span></p>
              <div style="display: flex; gap: 20px;">
                <p><strong style="color: #64748b; font-size: 10px; uppercase;">EXPIRY</strong><br/><span style="font-weight: 700; color: #0f172a;">${data.expiryDate}</span></p>
                <p><strong style="color: #64748b; font-size: 10px; uppercase;">CVV</strong><br/><span style="font-weight: 700; color: #0f172a;">${data.cvv}</span></p>
              </div>
            </div>
            <p style="margin-top: 15px; font-size: 13px; color: #64748b;">Please save these details. You can now use your ID Number to register for mobile banking.</p>
          `,
          confirmButtonText: 'Register for Mobile Banking',
          confirmButtonColor: '#052CE0',
          allowOutsideClick: false
        }).then(() => navigate('/register'));
      } else {
        Swal.fire('Error', data.message || 'Failed to open account', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Could not connect to the server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      
      {!showForm ? (
        <div className="bg-white p-10 rounded-[3rem] shadow-xl max-w-md w-full border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="text-5xl mb-6">🏦</div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Open an Account</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            It looks like you aren't a BlueMarble client yet. Join thousands of users today and experience modern banking.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setShowForm(true)}
              className="w-full bg-[#052CE0] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
            >
              Start Application
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
            >
              Back to Verification
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl max-w-2xl w-full border border-slate-100 animate-in slide-in-from-bottom duration-500 text-left">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-900">Official Application</h2>
            <p className="text-slate-400 text-sm">Please ensure details match your Identity Document exactly.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Full Names (as on ID card)</label>
              <input name="firstName" required onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" placeholder="e.g. Khensani Ntsako" />
            </div>

            <div className="md:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Surname</label>
              <input name="surname" required onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" placeholder="Manganye" />
            </div>


            <div className="md:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">ID Number</label>
              <input name="idNumber" required onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" placeholder="13-digit ID" />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Certified ID Copy (PDF/Image)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`mt-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${idFile ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
              >
                <span className="text-2xl mb-2">{idFile ? '✅' : '📄'}</span>
                <p className="text-xs font-bold text-slate-500 text-center">
                  {idFile ? idFile.name : 'Click to upload certified copy'}
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,image/*" 
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Residential Address</label>
              <input name="address" required onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" placeholder="Street, Suburb, City, Code" />
            </div>

            <div className="md:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Employment Status</label>
              <select name="employment" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-600">
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Student">Student</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Opening Deposit (ZAR)</label>
              <input name="balance" type="number" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" placeholder="0.00" />
            </div>

            <div className="md:col-span-2 pt-4 space-y-3">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#052CE0] text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-blue-200 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? "UPLOADING..." : "SUBMIT APPLICATION"}
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest text-center"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OpenAccount;