import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Lock, Bell,
  Globe, ChevronRight, LogOut, X, Check, Loader2
} from 'lucide-react';
 
const Settings: React.FC = () => {
  const navigate = useNavigate();
 
  // State for user data
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
 
  // Operational states
  const [showLangModal, setShowLangModal] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English (SA)');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
 
  // Fetch User Data from Backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
 
      try {
        // Change this URL to your actual profile endpoint
        const response = await fetch(`https://bluemarble.onrender.com/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
       
        const data = await response.json();
       
        if (response.ok) {
          setUserData(data);
        } else {
          // If token is invalid/expired, boot to login
          navigate('/login');
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
 
    fetchUserProfile();
  }, [navigate]);
 
  const saLanguages = [
    "English (SA)", "isiZulu", "isiXhosa", "Afrikaans",
    "Sepedi", "Setswana", "Sesotho", "Xitsonga", "siSwati", "Tshivenda", "isiNdebele"
  ];
 
  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
 
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#052ce0]">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );
 
  return (
    <div style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }} className="min-h-screen px-6 py-8 md:px-12 max-w-2xl mx-auto pb-32">
     
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
      </div>
 
      <main className="space-y-8">
        {/* Profile Card - Live Data */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 p-6 rounded-[2rem] flex items-center gap-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl border-2 border-white/40 overflow-hidden">
            <img
              src={userData?.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"}
              className="w-full h-full object-cover"
              alt="User"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {userData?.firstName} {userData?.surname}
            </h2>
            <p className="text-[10px] text-[#052ec0] font-black tracking-widest uppercase bg-white/40 px-2 py-1 rounded-md inline-block">
              {userData?.employment || "Verified Member"}
            </p>
          </div>
        </div>
 
        {/* ACCOUNT SECTION */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em] ml-4">ACCOUNT</h3>
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-[2.5rem] overflow-hidden">
            <button
              onClick={() => setShowPersonalModal(true)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/10 border-b border-white/10 group transition-all"
            >
              <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-white/20 rounded-xl transition-all group-hover:bg-white group-hover:text-[#052ec0]">
                    <User size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Personal Information</p>
                  <p className="text-[10px] text-white/40">Names, Email, Phone</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/30" />
            </button>
 
            <button
              onClick={() => alert("Security settings are currently encrypted.")}
              className="w-full flex items-center justify-between p-6 hover:bg-white/10 group transition-all"
            >
              <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-white/20 rounded-xl transition-all group-hover:bg-white group-hover:text-[#052ec0]">
                    <Lock size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Login & Security</p>
                  <p className="text-[10px] text-white/40">Password, Biometrics</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/30" />
            </button>
          </div>
        </div>
 
        {/* PREFERENCES SECTION */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em] ml-4">PREFERENCES</h3>
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-[2.5rem] overflow-hidden">
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/10 border-b border-white/10 group transition-all"
            >
              <div className="flex items-center gap-4 text-white">
                <div className={`p-3 rounded-xl transition-colors ${notificationsEnabled ? 'bg-[#052ce0] text-white' : 'bg-white/20 text-white/50'}`}>
                  <Bell size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Notifications</p>
                  <p className="text-[10px] text-white/40">{notificationsEnabled ? 'Alerts: ON' : 'Alerts: OFF'}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-[#052ce0]' : 'bg-white/20'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notificationsEnabled ? 'right-1' : 'left-1'}`} />
              </div>
            </button>
 
            <button
              onClick={() => setShowLangModal(true)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/10 group"
            >
              <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white group-hover:text-[#052ec0] transition-all">
                  <Globe size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Language</p>
                  <p className="text-[10px] text-white/40">{selectedLang}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/30" />
            </button>
          </div>
        </div>
 
        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 p-5 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-[2rem] text-red-400 font-bold hover:bg-red-500/20 active:scale-95 transition-all mt-4"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </main>
 
      {/* PERSONAL INFORMATION MODAL - Live Data */}
      {showPersonalModal && userData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-6 bg-[#052ce0] text-white flex justify-between items-center">
              <h2 className="font-bold">Personal Details</h2>
              <button onClick={() => setShowPersonalModal(false)}><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] uppercase font-black text-gray-400 block mb-1">Full Name</label>
                <p className="text-gray-800 font-bold">{userData.firstName} {userData.surname}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-gray-400 block mb-1">Email Address</label>
                <p className="text-gray-800 font-bold">{userData.email}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-gray-400 block mb-1">Phone Number</label>
                <p className="text-gray-800 font-bold">{userData.phone}</p>
              </div>
              <button
                onClick={() => setShowPersonalModal(false)}
                className="w-full py-4 bg-[#052ce0] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* LANGUAGE MODAL */}
      {showLangModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#052ce0] w-full max-w-sm rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h2 className="text-white font-bold">Select Language</h2>
              <button onClick={() => setShowLangModal(false)} className="text-white/50 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {saLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setSelectedLang(lang); setShowLangModal(false); }}
                  className="w-full p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 text-white transition-all"
                >
                  <span className={selectedLang === lang ? "font-bold" : "font-normal"}>{lang}</span>
                  {selectedLang === lang && <Check size={18} className="text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default Settings;