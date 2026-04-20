import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    idNumber: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Password Validation Logic
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password must be 8+ characters with numbers and symbols (@,#,$,%,&,!,*)',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    try {
      // 2. Call your Express Backend
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. SUCCESS POP-UP
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Welcome to BlueMarble Banking',
          timer: 3000,
          showConfirmButton: false
        });
        
        setTimeout(() => navigate('/login'), 3000);
      } else {
        // 4. ERROR POP-UP (e.g., Email already exists)
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: data.message || 'Something went wrong!',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Could not connect to the banking server.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 p-4">
      <div className="bg-blue-600 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl w-full max-w-lg flex flex-col items-center border border-blue-400/30">
        
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-blue-100 mb-8 text-center text-sm">Join BlueMarble banking today</p>

        <form onSubmit={handleRegister} className="w-full space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider">First Name</label>
              <input name="firstName" type="text" required onChange={handleChange} placeholder="John" className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-white" />
            </div>
            <div className="flex-1 space-y-1">
              <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider">Surname</label>
              <input name="surname" type="text" required onChange={handleChange} placeholder="Doe" className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-white" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider">Email</label>
            <input name="email" type="email" required onChange={handleChange} placeholder="name@example.com" className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-white" />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider">ID Number</label>
            <input name="idNumber" type="text" required onChange={handleChange} placeholder="1234567890123" className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-white" />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider">Phone</label>
            <input name="phone" type="tel" required onChange={handleChange} placeholder="+27 12 345 6789" className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-white" />
          </div>

          {/* Password with Toggle */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                onChange={handleChange} 
                className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none pr-12" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 text-xs">
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider">Verify Password</label>
            <div className="relative">
              <input 
                name="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                required 
                onChange={handleChange} 
                className="w-full p-3 bg-white/10 border border-blue-400/50 rounded-xl text-white outline-none pr-12" 
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 text-xs">
                {showConfirmPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl shadow-xl hover:bg-blue-50 mt-4 active:scale-95 transition-all">
            Register Now
          </button>
        </form>

        <p className="mt-6 text-sm text-blue-100">
          Already have an account?{" "}
          <span onClick={() => navigate('/login')} className="text-white font-bold cursor-pointer hover:underline">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;