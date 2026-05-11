import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Ensure the port matches your running backend (5000)
      const response = await axios.post('http://localhost:5000/api/login', { 
        email, 
        password 
      });

      if (response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.name);
        window.location.href = '/history'; 
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Invalid email or password");
    } // <--- This closes the 'catch' block
  }; // <--- This closes the 'handleLogin' function

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-4 w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition">
          Sign In
        </button>
      </form>
    </div>
  );
}; // <--- This closes the 'Login' component

export default Login;