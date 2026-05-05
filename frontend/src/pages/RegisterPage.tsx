import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Fingerprint, ChevronLeft, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Verify ID, 2: Full Form
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    idNumber: '', 
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyID = async () => {
    if (!formData.idNumber || formData.idNumber.length < 13) {
      Swal.fire({
        title: 'Invalid ID',
        text: 'Please enter a valid 13-digit ID number',
        icon: 'warning',
        confirmButtonColor: '#002a8f'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://bluemarble.onrender.com/api/auth/verify-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: formData.idNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, firstName: data.firstName || '' }));
        setStep(2);
        Swal.fire({
          icon: 'success',
          title: 'Identity Verified',
          text: `Welcome, ${data.firstName}. Set up your access.`,
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-[2rem]' }
        });
      } else if (response.status === 409) {
        Swal.fire({
          icon: 'info',
          title: 'Already Active',
          text: 'This profile is already registered for mobile banking.',
          confirmButtonText: 'SIGN IN',
          confirmButtonColor: '#002a8f',
          customClass: { popup: 'rounded-[2rem]' }
        }).then((result) => { if (result.isConfirmed) navigate('/login'); });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No Profile Found',
          html: `<p style="font-size: 14px; color: #64748b;">We couldn't find an account for this ID.</p><br/><a href="/open-account" style="color: #002a8f; font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Open an Account</a>`,
          confirmButtonColor: '#002a8f'
        });
      }
    } catch (err) {
      Swal.fire('Error', 'Secure connection failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ title: 'Mismatch', text: 'Passwords do not match.', icon: 'error', confirmButtonColor: '#002a8f' });
      return;
    }

    try {
      const response = await fetch('https://bluemarble.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Activation Successful', text: 'Mobile banking is now active!', timer: 2000, showConfirmButton: false });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        Swal.fire('Failed', data.message || 'Registration error', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Could not connect to secure server.', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#002a8f] p-6 selection:bg-white selection:text-[#002a8f]">
      <div className="w-full max-w-lg">
        
        {/* Branding Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/10">
            <ShieldCheck className="text-white" size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-2">blueMarble Global</h1>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            {step === 1 ? "Identity Verification" : "Portal Activation"}
          </h2>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Decorative radial glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {step === 1 ? (
            /* --- STEP 1: ID CHECK --- */
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Identity Number</label>
                <div className="relative">
                  <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                  <input 
                    name="idNumber"
                    type="text" 
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="13-digit ID"
                    className="w-full pl-14 pr-6 py-5 bg-white/10 border-2 border-white/5 rounded-[2rem] text-white font-black outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              <button 
                onClick={handleVerifyID} 
                disabled={isLoading} 
                className="group w-full bg-white text-[#002a8f] font-black py-6 rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span className="text-xs uppercase tracking-widest">{isLoading ? "Verifying..." : "Confirm Identity"}</span>
                {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="text-center pt-4 border-t border-white/5">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                  Active User?{' '}
                  <Link to="/login" className="text-white hover:underline ml-1">Log In</Link>
                </p>
              </div>
            </div>
          ) : (
            /* --- STEP 2: DETAILS --- */
            <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[8px] font-black text-white/30 uppercase tracking-widest ml-2">Names</label>
                   <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-white/20" />
                </div>
                <div className="space-y-2 pt-5">
                   <input name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-white/20" />
                </div>
              </div>
          
              <div className="space-y-2">
                 <label className="text-[8px] font-black text-white/30 uppercase tracking-widest ml-2">Communication</label>
                 <input name="email" type="email" value={formData.email} placeholder="Email Address" onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-white/20" />
              </div>

              <input name="phone" value={formData.phone} type="tel" placeholder="Mobile Number" onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-white/20" />
              
              <div className="space-y-2">
                <label className="text-[8px] font-black text-white/30 uppercase tracking-widest ml-2">Security</label>
                <div className="relative">
                  <input name="password" value={formData.password} type={showPassword ? "text" : "password"} placeholder="Set Portal Password" onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-white/20" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <input name="confirmPassword" value={formData.confirmPassword} type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" onChange={handleChange} required className="w-full p-4 bg-white/10 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-white/20" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-white text-[#002a8f] font-black py-6 rounded-[2rem] shadow-xl mt-4 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest">
                Activate Digital Banking
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="w-full flex items-center justify-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                <ChevronLeft size={14} /> Back to Identity Check
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;