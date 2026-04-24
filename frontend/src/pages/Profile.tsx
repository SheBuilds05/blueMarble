import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Edit3, Save, CheckCircle2, Loader2, AlertCircle, User } from 'lucide-react';

// Updated interface: removed registerCode
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
        console.error("Failed to load profile:", err);
        setError("Could not connect to the server. Ensure the backend is running.");
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
        setError("Failed to save changes. Please try again.");
      }
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#052ce0]">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#052ce0] p-6 text-center">
      <AlertCircle className="w-16 h-16 text-white/50 mb-4" />
      <h2 className="text-white text-xl font-bold mb-2">Profile Unavailable</h2>
      <p className="text-white/70 mb-6">{error || "We couldn't find your profile data."}</p>
      <button onClick={() => navigate(-1)} className="bg-white text-[#052ce0] px-8 py-3 rounded-full font-bold shadow-lg">
        Go Back
      </button>
    </div>
  );

  const Field = ({ label, field, disabled = false }: { label: string; field: keyof ProfileData; disabled?: boolean }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-white/50">
        {label}
      </label>
      {editing && !disabled ? (
        <input
          value={(draft?.[field] as string) || ''}
          onChange={e => setDraft(prev => prev ? ({ ...prev, [field]: e.target.value }) : null)}
          className="bg-white/40 border-2 border-white/20 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-white placeholder-white/30 outline-none focus:border-white/60 focus:bg-white/50 transition-all shadow-inner"
        />
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-white shadow-sm flex justify-between items-center">
          {(profile[field] as string) || <span className="text-white/20 italic">Not set</span>}
          {disabled && editing && <span className="text-[8px] opacity-30 uppercase font-black">Locked</span>}
        </div>
      )}
    </div>
  );

  return (
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
        </div>

        {editing && (
          <button 
            onClick={handleSave}
            className="w-full mt-10 bg-white text-[#052ce0] py-5 rounded-[1.5rem] font-black text-lg flex justify-center items-center gap-3 shadow-2xl hover:bg-blue-50 transition-all active:scale-[0.98]"
          >
            <Save size={20} /> Save Changes
          </button>
        )}
        
        {saved && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-2xl animate-bounce">
            <CheckCircle2 /> Profile Updated!
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;