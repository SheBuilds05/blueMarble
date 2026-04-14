import React from 'react';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blueMarble-primary to-blueMarble-dark p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 shadow-2xl w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-500 mb-8 text-center text-sm">Join BlueMarble banking today</p>

        <form className="w-full space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Full Name</label>
            <input type="text" placeholder="John Doe" className="w-full p-4 bg-gray-100 rounded-xl outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Email</label>
            <input type="email" placeholder="name@example.com" className="w-full p-4 bg-gray-100 rounded-xl outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-4 bg-gray-100 rounded-xl outline-none" />
          </div>

          <button className="w-full bg-blueMarble-primary text-white font-bold py-4 rounded-xl shadow-lg mt-4">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;