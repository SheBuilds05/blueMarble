import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Landmark, FileText, Upload, CheckCircle2, ShieldCheck } from 'lucide-react';
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
      Swal.fire({
        title: 'Document Required',
        text: 'Please upload a certified copy of your ID to proceed.',
        icon: 'warning',
        confirmButtonColor: '#002a8f'
      });
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => dataToSend.append(key, value));
      dataToSend.append('idCopy', idFile);

      const response = await fetch('https://bluemarble.onrender.com/api/auth/open-account', {
        method: 'POST',
        body: dataToSend, 
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Welcome to blueMarble!',
          html: `
            <div style="text-align: left; background: #f8fafc; padding: 24px; border-radius: 2rem; border: 1px solid #e2e8f0; font-family: inherit;">
              <p style="margin-bottom: 12px;"><strong style="color: #64748b; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;">Account Number</strong><br/><span style="font-size: 20px; font-weight: 900; color: #002a8f;">${data.accountNumber}</span></p>
              <p style="margin-bottom: 12px;"><strong style="color: #64748b; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;">Virtual Card Number</strong><br/><span style="font-size: 16px; font-weight: 800; color: #000000;">${data.cardNumber}</span></p>
              <div style="display: flex; gap: 24px;">
                <p><strong style="color: #64748b; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;">Expiry</strong><br/><span style="font-weight: 800; color: #000000;">${data.expiryDate}</span></p>
                <p><strong style="color: #64748b; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;">CVV</strong><br/><span style="font-weight: 800; color: #000000;">${data.cvv}</span></p>
              </div>
            </div>
            <p style="margin-top: 15px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Take a screenshot. You will need your ID to register.</p>
          `,
          confirmButtonText: 'REGISTER FOR MOBILE BANKING',
          confirmButtonColor: '#002a8f',
          allowOutsideClick: false,
          customClass: {
            popup: 'rounded-[3rem]',
            confirmButton: 'rounded-2xl font-black px-8 py-4 text-xs tracking-widest'
          }
        }).then(() => navigate('/register'));
      } else {
        Swal.fire({
          title: 'Application Error',
          text: data.message || 'We could not process your application.',
          icon: 'error',
          confirmButtonColor: '#002a8f'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Connection Failed',
        text: 'Could not reach the secure server.',
        icon: 'error',
        confirmButtonColor: '#002a8f'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 pb-20">
      
      {!showForm ? (
        <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,42,143,0.1)] max-w-md w-full border border-slate-50 text-center relative overflow-hidden">
          {/* Decorative Background Blob */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#002a8f]/5 rounded-full blur-2xl" />
          
          <div className="w-20 h-20 bg-[#002a8f] text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100">
            <Landmark size={36} strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl font-black text-[#000000] mb-4 tracking-tighter uppercase">New Era</h1>
          <p className="text-slate-400 font-bold text-sm mb-10 leading-relaxed uppercase tracking-wide">
            You aren't a blueMarble client yet. Join the future of digital banking in minutes.
          </p>
          
          <div className="space-y-4 relative z-10">
            <button 
              onClick={() => setShowForm(true)}
              className="w-full bg-[#002a8f] text-white font-black py-6 rounded-[2rem] shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest text-xs"
            >
              Start Application
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-slate-50 text-slate-400 font-black py-6 rounded-[2rem] hover:bg-slate-100 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.08)] max-w-2xl w-full border border-slate-50 relative">
          
          <div className="flex items-center gap-4 mb-10">
             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#002a8f]">
               <ShieldCheck size={24} />
             </div>
             <div>
               <h2 className="text-xl font-black text-[#000000] uppercase tracking-tighter">Secure Application</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verify your legal identity</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Legal Names</label>
              <input name="firstName" required onChange={handleChange} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-[#000000] focus:ring-2 focus:ring-[#002a8f]/10 transition-all outline-none" placeholder="First & Middle Names" />
            </div>

            <div className="md:col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Surname</label>
              <input name="surname" required onChange={handleChange} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-[#000000] outline-none focus:ring-2 focus:ring-[#002a8f]/10" />
            </div>

            <div className="md:col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">13-Digit ID</label>
              <input name="idNumber" required onChange={handleChange} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-[#000000] outline-none focus:ring-2 focus:ring-[#002a8f]/10" />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Certified Identity Document</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-8 cursor-pointer transition-all ${idFile ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-[#002a8f]/30'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${idFile ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300'}`}>
                  {idFile ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  {idFile ? idFile.name : 'PDF or Clear Image (Max 5MB)'}
                </p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Residential Address</label>
              <input name="address" required onChange={handleChange} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-[#000000] outline-none focus:ring-2 focus:ring-[#002a8f]/10" placeholder="Street, Suburb, City, Code" />
            </div>

            <div className="md:col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Occupation</label>
              <select name="employment" onChange={handleChange} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-[#000000] outline-none appearance-none">
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Student">Student</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Initial Deposit (ZAR)</label>
              <input name="balance" type="number" onChange={handleChange} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-[#002a8f] outline-none" placeholder="0.00" />
            </div>

            <div className="md:col-span-2 pt-6 space-y-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#002a8f] text-white font-black py-6 rounded-[2rem] shadow-xl shadow-blue-50 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
              >
                {isLoading ? "Encrypting..." : "Submit Application"}
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] text-center hover:text-slate-400"
              >
                Go Back
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Brand Slogan */}
      <div className="text-center mt-12 opacity-20">
        <p className="text-[10px] font-black text-[#000000] uppercase tracking-[0.5em]">blueMarble Global</p>
      </div>
    </div>
  );
};

export default OpenAccount;