import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate, Link } from 'react-router-dom'; // Added Link for navigation
=======
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Fingerprint, ChevronLeft, ArrowRight } from 'lucide-react';
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
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

<<<<<<< HEAD
  // --- STEP 1: VERIFY ID ---
  const handleVerifyID = async () => {
    if (!formData.idNumber || formData.idNumber.length < 13) {
      Swal.fire('Invalid ID', 'Please enter a valid 13-digit ID number', 'warning');
=======
  const handleVerifyID = async () => {
    if (!formData.idNumber || formData.idNumber.length < 13) {
      Swal.fire({
        title: 'Invalid ID',
        text: 'Please enter a valid 13-digit ID number',
        icon: 'warning',
        confirmButtonColor: '#002a8f'
      });
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      return;
    }

    setIsLoading(true);
    try {
<<<<<<< HEAD
      const response = await fetch('http://localhost:5000/api/auth/verify-id', {
=======
      const response = await fetch('https://bluemarble.onrender.com/api/auth/verify-id', {
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: formData.idNumber }),
      });

      const data = await response.json();

      if (response.ok) {
<<<<<<< HEAD
        // PRE-FILL THE NAME FROM DATABASE
=======
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        setFormData(prev => ({ ...prev, firstName: data.firstName || '' }));
        setStep(2);
        Swal.fire({
          icon: 'success',
<<<<<<< HEAD
          title: `Identity Verified`,
          text: `Welcome, ${data.firstName}. Please complete your registration.`,
          timer: 2000,
          showConfirmButton: false
=======
          title: 'Identity Verified',
          text: `Welcome, ${data.firstName}. Set up your access.`,
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-[2rem]' }
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        });
      } else if (response.status === 409) {
        Swal.fire({
          icon: 'info',
<<<<<<< HEAD
          title: 'Already Registered',
          text: 'You already have an account. Please sign in.',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#052CE0'
=======
          title: 'Already Active',
          text: 'This profile is already registered for mobile banking.',
          confirmButtonText: 'SIGN IN',
          confirmButtonColor: '#002a8f',
          customClass: { popup: 'rounded-[2rem]' }
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        }).then((result) => { if (result.isConfirmed) navigate('/login'); });
      } else {
        Swal.fire({
          icon: 'error',
<<<<<<< HEAD
          title: 'Client Not Found',
          html: `We couldn't find an account for this ID.<br/><br/>
                 <a href="/open-account" style="color: #2563eb; font-weight: bold;">Click here to open an account</a>`,
          confirmButtonColor: '#2563eb'
        });
      }
    } catch (err) {
      Swal.fire('Error', 'Server connection failed.', 'error');
=======
          title: 'No Profile Found',
          html: `<p style="font-size: 14px; color: #64748b;">We couldn't find an account for this ID.</p><br/><a href="/open-account" style="color: #002a8f; font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Open an Account</a>`,
          confirmButtonColor: '#002a8f'
        });
      }
    } catch (err) {
      Swal.fire('Error', 'Secure connection failed.', 'error');
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  // --- STEP 2: FINAL REGISTER ---
=======
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
<<<<<<< HEAD
      Swal.fire('Error', 'Passwords do not match!', 'error');
=======
      Swal.fire({ title: 'Mismatch', text: 'Passwords do not match.', icon: 'error', confirmButtonColor: '#002a8f' });
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      return;
    }

    try {
<<<<<<< HEAD
      const response = await fetch('http://localhost:5000/api/auth/register', {
=======
      const response = await fetch('https://bluemarble.onrender.com/api/auth/register', {
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
<<<<<<< HEAD
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Mobile banking activated!', timer: 2000 });
=======
        Swal.fire({ icon: 'success', title: 'Activation Successful', text: 'Mobile banking is now active!', timer: 2000, showConfirmButton: false });
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        setTimeout(() => navigate('/login'), 2000);
      } else {
        Swal.fire('Failed', data.message || 'Registration error', 'error');
      }
    } catch (error) {
<<<<<<< HEAD
      Swal.fire('Error', 'Could not connect to server.', 'error');
=======
      Swal.fire('Error', 'Could not connect to secure server.', 'error');
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 p-4 font-sans text-white">
      <div className="bg-blue-600/40 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl w-full max-w-lg border border-blue-400/30">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter italic">BlueMarble</h1>
          <p className="text-blue-100 text-sm mt-1">{step === 1 ? "Identity Verification" : "Secure Your Account"}</p>
        </div>

        {step === 1 ? (
          /* --- VIEW 1: ID VERIFICATION --- */
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest">ID Number</label>
              <input 
                name="idNumber"
                type="text" 
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="13-digit identity number"
                className="w-full p-4 bg-white/10 border border-blue-400/50 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white transition-all placeholder:text-blue-200/50"
              />
            </div>
            <button 
              onClick={handleVerifyID} 
              disabled={isLoading} 
              className="w-full bg-white text-blue-700 font-black py-4 rounded-2xl shadow-xl hover:bg-blue-50 active:scale-95 transition-all"
            >
              {isLoading ? "VERIFYING..." : "VERIFY IDENTITY"}
            </button>

            <div className="text-center mt-6">
              <p className="text-blue-100 text-sm">
                Already have mobile banking?{' '}
                <Link to="/login" className="font-bold text-white underline decoration-blue-400 hover:text-blue-200 transition-colors">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        ) : (
          /* --- VIEW 2: FULL REGISTRATION --- */
          <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="flex gap-4">
              <input name="firstName" value={formData.firstName} placeholder="First Name" onChange={handleChange} required className="w-1/2 p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:border-white transition-colors" />
              <input name="surname" value={formData.surname} placeholder="Surname" onChange={handleChange} required className="w-1/2 p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:border-white transition-colors" />
            </div>
        
            <input name="phone" value={formData.phone} type="tel" placeholder="Phone Number" onChange={handleChange} required className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:border-white transition-colors" />
            
            <div className="space-y-1">
    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest ml-1">Email Address</label>
    <input 
      name="email" 
      type="email" 
      value={formData.email} 
      placeholder="e.g. khensani@example.com" 
      onChange={handleChange} 
      required 
      className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:border-white transition-colors placeholder:text-blue-200/50" 
    />
  </div>


            <div className="relative">
              <input name="password" value={formData.password} type={showPassword ? "text" : "password"} placeholder="Set Password" onChange={handleChange} required className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:border-white transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-4 text-[10px] text-blue-200 font-bold hover:text-white transition-colors">{showPassword ? "HIDE" : "SHOW"}</button>
            </div>

            <div className="relative">
              <input name="confirmPassword" value={formData.confirmPassword} type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" onChange={handleChange} required className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:border-white transition-colors" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-4 text-[10px] text-blue-200 font-bold hover:text-white transition-colors">{showConfirmPassword ? "HIDE" : "SHOW"}</button>
            </div>

            <button type="submit" className="w-full bg-white text-blue-700 font-black py-4 rounded-2xl shadow-xl mt-4 hover:bg-blue-50 active:scale-95 transition-all">
              ACTIVATE BANKING
            </button>
            
            <div className="flex flex-col items-center gap-3 mt-4">
              <button type="button" onClick={() => setStep(1)} className="text-blue-200 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                Back to ID Check
              </button>
              <p className="text-blue-100 text-sm">
                Already registered?{' '}
                <Link to="/login" className="font-bold text-white underline decoration-blue-400 hover:text-blue-200 transition-colors">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        )}
=======
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
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      </div>
    </div>
  );
};

export default RegisterPage;