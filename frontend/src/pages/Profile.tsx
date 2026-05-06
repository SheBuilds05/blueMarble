import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { ChevronLeft, X, Edit3, Save, CheckCircle2, Loader2, AlertCircle, User } from 'lucide-react';

// Updated interface: removed registerCode
=======
import { ChevronLeft, X, Edit3, Save, CheckCircle2, Loader2, AlertCircle, User, ShieldCheck } from 'lucide-react';

>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
interface ProfileData {
  _id?: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [draft, setDraft] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError("No User ID found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
<<<<<<< HEAD
        const response = await fetch(`http://localhost:5000/api/profile/${userId}`);
=======
        const response = await fetch(`https://bluemarble.onrender.com/api/profile/${userId}`);
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        if (!response.ok) throw new Error(`Server responded with ${response.status}`);
        
        const data = await response.json();
        setProfile(data);
        setDraft(data);
      } catch (err) {
<<<<<<< HEAD
        console.error("Failed to load profile:", err);
        setError("Could not connect to the server. Ensure the backend is running.");
=======
        setError("Could not connect to the secure server.");
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    if (!draft || !userId) return;

    try {
<<<<<<< HEAD
      const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
=======
      const response = await fetch(`https://bluemarble.onrender.com/api/profile/${userId}`, {
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfile(updatedData);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
<<<<<<< HEAD
        setError("Failed to save changes. Please try again.");
=======
        setError("Failed to save changes.");
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      }
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading) return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-[#052ce0]">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
=======
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#002a8f]">
      <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Decrypting Profile</p>
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    </div>
  );

  if (error || !profile) return (
<<<<<<< HEAD
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#052ce0] p-6 text-center">
      <AlertCircle className="w-16 h-16 text-white/50 mb-4" />
      <h2 className="text-white text-xl font-bold mb-2">Profile Unavailable</h2>
      <p className="text-white/70 mb-6">{error || "We couldn't find your profile data."}</p>
      <button onClick={() => navigate(-1)} className="bg-white text-[#052ce0] px-8 py-3 rounded-full font-bold shadow-lg">
        Go Back
=======
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#002a8f] p-8 text-center">
      <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-white/50" />
      </div>
      <h2 className="text-white text-xl font-black uppercase tracking-tighter mb-2">Access Denied</h2>
      <p className="text-white/40 text-xs font-bold mb-8 max-w-xs">{error || "User session expired."}</p>
      <button onClick={() => navigate(-1)} className="w-full max-w-xs bg-white text-[#002a8f] py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl">
        Return to Portal
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
      </button>
    </div>
  );

  const Field = ({ label, field, disabled = false }: { label: string; field: keyof ProfileData; disabled?: boolean }) => (
<<<<<<< HEAD
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-white/50">
=======
    <div className="flex flex-col gap-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-4 text-white/40">
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        {label}
      </label>
      {editing && !disabled ? (
        <input
          value={(draft?.[field] as string) || ''}
          onChange={e => setDraft(prev => prev ? ({ ...prev, [field]: e.target.value }) : null)}
<<<<<<< HEAD
          className="bg-white/40 border-2 border-white/20 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-white placeholder-white/30 outline-none focus:border-white/60 focus:bg-white/50 transition-all shadow-inner"
        />
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-white shadow-sm flex justify-between items-center">
          {(profile[field] as string) || <span className="text-white/20 italic">Not set</span>}
          {disabled && editing && <span className="text-[8px] opacity-30 uppercase font-black">Locked</span>}
=======
          className="bg-white/10 border-2 border-white/10 rounded-[2rem] px-8 py-5 text-sm font-black text-white placeholder-white/20 outline-none focus:border-white/30 focus:bg-white/15 transition-all shadow-inner"
        />
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-black text-white flex justify-between items-center group">
          <span className="tracking-wide">{(profile[field] as string) || "—"}</span>
          {disabled && editing && (
             <div className="flex items-center gap-2 opacity-30">
               <ShieldCheck size={12} />
               <span className="text-[8px] uppercase font-black tracking-widest">Fixed</span>
             </div>
          )}
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        </div>
      )}
    </div>
  );

  return (
<<<<<<< HEAD
    <div className="min-h-screen w-full pb-44 overflow-x-hidden" style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}>
      <div className="max-w-xl mx-auto p-6 pt-12">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
           <button onClick={() => navigate('/dashboard')} className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors shadow-lg">
             <ChevronLeft />
           </button>
           <button onClick={() => { setEditing(!editing); setDraft(profile); }} className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors shadow-lg">
             {editing ? <X /> : <Edit3 />}
           </button>
        </div>

        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/30 flex items-center justify-center text-white mb-4 shadow-2xl">
            <User size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{profile.firstName} {profile.surname}</h1>
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">Verified Member</p>
        </div>
        
        {/* FORM FIELDS */}
        <div className="grid grid-cols-1 gap-6">
          <Field label="First Name" field="firstName" />
          <Field label="Surname" field="surname" />
          <Field label="Email Address" field="email" disabled={true} /> 
          <Field label="Mobile Number" field="phone" />
=======
    <div className="min-h-screen bg-[#002a8f] pb-44 selection:bg-white selection:text-[#002a8f]">
      <div className="max-w-xl mx-auto p-8 pt-12">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-16">
            <button onClick={() => navigate('/dashboard')} className="p-4 bg-white/10 rounded-[1.5rem] text-white hover:bg-white/20 transition-all active:scale-90">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Member Settings</h1>
            <button onClick={() => { setEditing(!editing); setDraft(profile); }} className={`p-4 rounded-[1.5rem] transition-all active:scale-90 ${editing ? 'bg-white text-[#002a8f]' : 'bg-white/10 text-white'}`}>
              {editing ? <X size={20} /> : <Edit3 size={20} />}
            </button>
        </div>

        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center mb-14">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-white/20 to-transparent rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-28 h-28 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 flex items-center justify-center text-white mb-6 shadow-2xl">
              <User size={48} strokeWidth={1} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{profile.firstName} {profile.surname}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Active Account</p>
          </div>
        </div>
        
        {/* FORM FIELDS */}
        <div className="grid grid-cols-1 gap-8">
          <Field label="Legal First Name" field="firstName" />
          <Field label="Legal Surname" field="surname" />
          <Field label="Verified Email" field="email" disabled={true} /> 
          <Field label="Contact Number" field="phone" />
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        </div>

        {editing && (
          <button 
            onClick={handleSave}
<<<<<<< HEAD
            className="w-full mt-10 bg-white text-[#052ce0] py-5 rounded-[1.5rem] font-black text-lg flex justify-center items-center gap-3 shadow-2xl hover:bg-blue-50 transition-all active:scale-[0.98]"
          >
            <Save size={20} /> Save Changes
=======
            className="w-full mt-12 bg-white text-[#002a8f] py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex justify-center items-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Save size={16} /> Save Securely
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
          </button>
        )}
        
        {saved && (
<<<<<<< HEAD
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-2xl animate-bounce">
            <CheckCircle2 /> Profile Updated!
          </div>
        )}
      </div>
=======
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-10 py-5 rounded-[2rem] flex items-center gap-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CheckCircle2 size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Identity Updated</span>
          </div>
        )}
      </div>

      {/* Brand Slogan */}
      <div className="fixed bottom-10 left-0 right-0 text-center opacity-10 pointer-events-none">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">blueMarble Global</p>
      </div>
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    </div>
  );
};

export default Profile;