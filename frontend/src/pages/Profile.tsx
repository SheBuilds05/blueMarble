import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Edit3, Save, CheckCircle2, Loader2 } from 'lucide-react';

interface ProfileData {
  idNumber: string;
  passportNumber: string;
  dateOfBirth: string;
  nationality: string;
  firstName: string;
  lastName: string;
  employmentStatus: string;
  incomeBracket: string;
  mobile: string;
  email: string;
  preferredContact: string;
  streetAddress: string;
  suburb: string;
  city: string;
  postalCode: string;
  province: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Initialize with empty strings instead of hardcoded data
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [draft, setDraft] = useState<ProfileData | null>(null);

  // 1. Fetch Profile on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Assuming you store the user ID in localStorage after login
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5000/api/profile/${userId}`);
        const data = await response.json();
        setProfile(data);
        setDraft(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. Save Changes to Database
  const handleSave = async () => {
    if (!draft) return;
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });

      if (response.ok) {
        setProfile({ ...draft });
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      alert("Error saving profile updates.");
    }
  };

  const handleCancel = () => {
    setDraft(profile ? { ...profile } : null);
    setEditing(false);
  };

  if (loading || !profile || !draft) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#052ce0]">
        <Loader2 className="text-white animate-spin" size={48} />
      </div>
    );
  }

  const Field = ({ label, field }: { label: string; field: keyof ProfileData }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-white/50">
        {label}
      </label>
      {editing ? (
        <input
          value={draft[field]}
          onChange={e => setDraft(prev => prev ? ({ ...prev, [field]: e.target.value }) : null)}
          className="bg-white/40 border-2 border-white/20 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-white placeholder-white/30 outline-none focus:border-white/60 focus:bg-white/50 transition-all shadow-inner"
        />
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-white shadow-sm">
          {profile[field]}
        </div>
      )}
    </div>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-14 last:mb-0">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#052ce0] drop-shadow-sm">
          {title}
        </h3>
        <div className="flex-1 h-[1px] bg-white/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen w-full pb-44 overflow-x-hidden"
      style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}
    >
      <div className="flex justify-between items-center px-6 py-8 md:px-12 mb-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight drop-shadow-md">My Profile</h2>
        <button onClick={() => navigate('/dashboard')} className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90">
          <X size={20} />
        </button>
      </div>

      <main className="px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-white/30 backdrop-blur-2xl border border-white/40 p-10 rounded-[3rem] shadow-2xl mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div 
            className="w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl rotate-3 relative z-10"
            style={{ background: 'linear-gradient(135deg, #052ce0, #2563eb)', border: '4px solid rgba(255,255,255,0.4)' }}
          >
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl font-black text-white tracking-tight leading-none drop-shadow-md">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-[11px] mt-3 font-black uppercase tracking-[0.25em] text-white/80 bg-white/10 inline-block px-4 py-1.5 rounded-full border border-white/10">
              blueMarble Platinum Member
            </p>
          </div>
          <div className="flex gap-3 z-10">
            {editing ? (
              <>
                <button onClick={handleCancel} className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 hover:bg-emerald-600 transition-all flex items-center gap-2">
                  <Save size={16} /> Save Changes
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-[#052ce0] text-white shadow-[0_10px_20px_rgba(5,46,224,0.3)] hover:brightness-110 transition-all flex items-center gap-2">
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {saved && (
          <div className="mb-10 flex items-center gap-3 p-6 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-3xl text-emerald-100 text-sm font-bold animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={22} />
            Your profile information has been updated successfully.
          </div>
        )}

        <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-10 md:p-16 rounded-[4rem] shadow-2xl">
          <Section title="Identity Verification">
            <Field label="SA ID Number" field="idNumber" />
            <Field label="Passport Number" field="passportNumber" />
            <Field label="Date of Birth" field="dateOfBirth" />
            <Field label="Nationality" field="nationality" />
          </Section>

          <Section title="Personal Information">
            <Field label="Legal First Name" field="firstName" />
            <Field label="Legal Last Name" field="lastName" />
            <Field label="Employment Status" field="employmentStatus" />
            <Field label="Monthly Income Range" field="incomeBracket" />
          </Section>

          <Section title="Communication">
            <Field label="Verified Mobile" field="mobile" />
            <Field label="Email Address" field="email" />
            <Field label="Preferred Contact" field="preferredContact" />
          </Section>

          <Section title="Residential Address">
            <Field label="Street & Number" field="streetAddress" />
            <Field label="Suburb" field="suburb" />
            <Field label="City" field="city" />
            <Field label="Postal Code" field="postalCode" />
          </Section>
        </div>
      </main>
    </div>
  );
};

export default Profile;