import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Lock, Bell,
  Globe, ChevronRight, LogOut, X, Check, Loader2, ShieldCheck
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://bluemarble.onrender.com/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUserData(data);
        } else {
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
    <div className="min-h-screen flex items-center justify-center bg-[#002a8f]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-white animate-spin opacity-50" />
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Securing Connection</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#002a8f] text-white selection:bg-white selection:text-[#002a8f]">
      <div className="max-w-2xl mx-auto px-6 py-12 pb-32">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white/10 backdrop-blur-xl rounded-[1.5rem] border border-white/10 hover:bg-white/20 transition-all active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black uppercase tracking-tighter">Settings</h1>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Portal Preferences</p>
          </div>
        </div>

        <main className="space-y-10">
          {/* Profile Card */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] flex items-center gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
            
            <div className="w-20 h-20 rounded-[2rem] border-2 border-white/20 overflow-hidden shadow-inner">
              <img
                src={userData?.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"}
                className="w-full h-full object-cover"
                alt="User"
              />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                {userData?.firstName} {userData?.surname}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck size={12} className="text-emerald-400" />
                <p className="text-[10px] text-white/50 font-black tracking-widest uppercase">
                  {userData?.employment || "Verified Client"}
                </p>
              </div>
            </div>
          </div>

          {/* ACCOUNT SECTION */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-6">Security & Identity</h3>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden">
              <button
                onClick={() => setShowPersonalModal(true)}
                className="w-full flex items-center justify-between p-7 hover:bg-white/5 border-b border-white/5 group transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-white group-hover:text-[#002a8f] transition-all">
                    <User size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-wide">Personal Profile</p>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-tight">Manage identity & contact</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-white/20" />
              </button>

              <button
                onClick={() => alert("Security protocols active.")}
                className="w-full flex items-center justify-between p-7 hover:bg-white/5 group transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-white group-hover:text-[#002a8f] transition-all">
                    <Lock size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-wide">Access Control</p>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-tight">Biometrics & Keys</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-white/20" />
              </button>
            </div>
          </section>

          {/* PREFERENCES SECTION */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-6">App Experience</h3>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden">
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-full flex items-center justify-between p-7 hover:bg-white/5 border-b border-white/5 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl transition-all ${notificationsEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/20'}`}>
                    <Bell size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-wide">Push Notifications</p>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-tight">{notificationsEnabled ? 'Real-time alerts active' : 'Alerts disabled'}</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-all border ${notificationsEnabled ? 'bg-emerald-500 border-emerald-400' : 'bg-white/10 border-white/10'}`}>
                  <div className={`absolute top-1 w-3.5 h-3.5 bg-white rounded-full shadow-lg transition-all ${notificationsEnabled ? 'right-1' : 'left-1'}`} />
                </div>
              </button>

              <button
                onClick={() => setShowLangModal(true)}
                className="w-full flex items-center justify-between p-7 hover:bg-white/5 group transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-white group-hover:text-[#002a8f] transition-all">
                    <Globe size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-wide">Regional Language</p>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-tight">{selectedLang}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-white/20" />
              </button>
            </div>
          </section>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 p-6 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] text-red-400 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-[0.98]"
          >
            <LogOut size={18} /> End Secure Session
          </button>
        </main>

        {/* PERSONAL MODAL */}
        {showPersonalModal && userData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#002a8f]/80 backdrop-blur-xl">
            <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-8 bg-[#002a8f] text-white flex justify-between items-center">
                <div>
                  <h2 className="font-black uppercase tracking-tighter text-lg">Identity</h2>
                  <p className="text-[8px] font-black opacity-40 uppercase tracking-[0.3em]">Official Records</p>
                </div>
                <button onClick={() => setShowPersonalModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-gray-400 tracking-widest block">Legal Name</label>
                  <p className="text-[#002a8f] font-black text-lg">{userData.firstName} {userData.surname}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-gray-400 tracking-widest block">Digital Mail</label>
                  <p className="text-gray-800 font-bold text-sm">{userData.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-gray-400 tracking-widest block">Phone Link</label>
                  <p className="text-gray-800 font-bold text-sm">{userData.phone}</p>
                </div>
                <button
                  onClick={() => setShowPersonalModal(false)}
                  className="w-full py-5 bg-[#002a8f] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Confirm & Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LANGUAGE MODAL */}
        {showLangModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002a8f]/90 backdrop-blur-xl">
            <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-[#002a8f] font-black uppercase tracking-tighter text-lg">Region</h2>
                <button onClick={() => setShowLangModal(false)} className="text-gray-300 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-4 space-y-1">
                {saLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setSelectedLang(lang); setShowLangModal(false); }}
                    className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all ${selectedLang === lang ? 'bg-[#002a8f] text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    <span className="text-xs font-black uppercase tracking-wide">{lang}</span>
                    {selectedLang === lang && <Check size={16} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;