import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Edit3, Save, CheckCircle2, Loader2, AlertCircle, User, ShieldCheck } from 'lucide-react';

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
        const response = await fetch(`https://bluemarble.onrender.com/api/profile/${userId}`);
        if (!response.ok) throw new Error(`Server responded with ${response.status}`);
        
        const data = await response.json();
        setProfile(data);
        setDraft(data);
      } catch (err) {
        setError("Could not connect to the secure server.");
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
      const response = await fetch(`https://bluemarble.onrender.com/api/profile/${userId}`, {
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
        setError("Failed to save changes.");
      }
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#002a8f]">
      <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Decrypting Profile</p>
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#002a8f] p-8 text-center">
      <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-white/50" />
      </div>
      <h2 className="text-white text-xl font-black uppercase tracking-tighter mb-2">Access Denied</h2>
      <p className="text-white/40 text-xs font-bold mb-8 max-w-xs">{error || "User session expired."}</p>
      <button onClick={() => navigate(-1)} className="w-full max-w-xs bg-white text-[#002a8f] py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl">
        Return to Portal
      </button>
    </div>
  );

  const Field = ({ label, field, disabled = false }: { label: string; field: keyof ProfileData; disabled?: boolean }) => (
    <div className="flex flex-col gap-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-4 text-white/40">
        {label}
      </label>
      {editing && !disabled ? (
        <input
          value={(draft?.[field] as string) || ''}
          onChange={e => setDraft(prev => prev ? ({ ...prev, [field]: e.target.value }) : null)}
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
        </div>
      )}
    </div>
  );

  return (
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
        </div>

        {editing && (
          <button 
            onClick={handleSave}
            className="w-full mt-12 bg-white text-[#002a8f] py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex justify-center items-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Save size={16} /> Save Securely
          </button>
        )}
        
        {saved && (
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
    </div>
  );
};

export default Profile;