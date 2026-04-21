import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for navigation
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

  // --- STEP 1: VERIFY ID ---
  const handleVerifyID = async () => {
    if (!formData.idNumber || formData.idNumber.length < 13) {
      Swal.fire('Invalid ID', 'Please enter a valid 13-digit ID number', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: formData.idNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        // PRE-FILL THE NAME FROM DATABASE
        setFormData(prev => ({ ...prev, firstName: data.firstName || '' }));
        setStep(2);
        Swal.fire({
          icon: 'success',
          title: `Identity Verified`,
          text: `Welcome, ${data.firstName}. Please complete your registration.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else if (response.status === 409) {
        Swal.fire({
          icon: 'info',
          title: 'Already Registered',
          text: 'You already have an account. Please sign in.',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#052CE0'
        }).then((result) => { if (result.isConfirmed) navigate('/login'); });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Client Not Found',
          html: `We couldn't find an account for this ID.<br/><br/>
                 <a href="/open-account" style="color: #2563eb; font-weight: bold;">Click here to open an account</a>`,
          confirmButtonColor: '#2563eb'
        });
      }
    } catch (err) {
      Swal.fire('Error', 'Server connection failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- STEP 2: FINAL REGISTER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match!', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Mobile banking activated!', timer: 2000 });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        Swal.fire('Failed', data.message || 'Registration error', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Could not connect to server.', 'error');
    }
  };

  return (
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
            <input name="email" value={formData.email} type="email" placeholder="Email Address" onChange={handleChange} required className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:border-white transition-colors" />
            <input name="phone" value={formData.phone} type="tel" placeholder="Phone Number" onChange={handleChange} required className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:border-white transition-colors" />
            
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
      </div>
    </div>
  );
};

export default RegisterPage;