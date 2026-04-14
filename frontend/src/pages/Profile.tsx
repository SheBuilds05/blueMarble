import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Edit3, Save, CheckCircle2 } from 'lucide-react';
 
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
  const [profile, setProfile] = useState<ProfileData>({
    idNumber: '8812150045087',
    passportNumber: 'A12345678',
    dateOfBirth: '15 December 1988',
    nationality: 'South African',
    firstName: 'Rosa',
    lastName: 'Novela',
    employmentStatus: 'Employed',
    incomeBracket: 'R25,000 – R50,000',
    mobile: '+27 82 345 6789',
    email: 'rosa.novela@email.com',
    preferredContact: 'Email',
    streetAddress: '14 Acacia Avenue',
    suburb: 'Sandton',
    city: 'Johannesburg',
    postalCode: '2196',
    province: 'Gauteng',
  });
 
  const [draft, setDraft] = useState<ProfileData>({ ...profile });
 
  const handleSave = () => {
    setProfile({ ...draft });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
 
  const handleCancel = () => {
    setDraft({ ...profile });
    setEditing(false);
  };
 
  const Field = ({ label, field }: { label: string; field: keyof ProfileData }) => (
<div className="flex flex-col gap-2">
<label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-white/50">
        {label}
</label>
      {editing ? (
<input
          value={draft[field]}
          onChange={e => setDraft(prev => ({ ...prev, [field]: e.target.value }))}
          className="bg-white/40 border-2 border-white/20 rounded-2xl px-5 py-3 text-sm font-bold text-white placeholder-white/30 outline-none focus:border-white/60 transition-all"
        />
      ) : (
<div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold text-white">
          {profile[field]}
</div>
      )}
</div>
  );
 
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
<div className="mb-10">
<div className="flex items-center gap-4 mb-6">
<h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#052ce0]">
          {title}
</h3>
<div className="flex-1 h-[1px] bg-white/20" />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children}
</div>
</div>
  );
 
  return (
<div 
      className="min-h-screen px-6 py-8 md:px-12 max-w-4xl mx-auto pb-32"
      style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}
>
      {/* Header */}
<div className="flex justify-between items-center mb-10">
<button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90"
>
<ChevronLeft size={20} />
</button>
<h2 className="text-xl font-bold text-white tracking-tight">My Profile</h2>
<button 
          onClick={() => navigate('/dashboard')}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90"
>
<X size={20} />
</button>
</div>
 
      <div className="max-w-3xl mx-auto">
        {/* Avatar Hero - Matching Dashboard Glassmorphism */}
<div className="bg-white/30 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-xl mb-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
<div 
            className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-2xl rotate-3"
            style={{ background: 'linear-gradient(135deg, #052ce0, #2563eb)', border: '4px solid rgba(255,255,255,0.4)' }}
>
            {profile.firstName[0]}{profile.lastName[0]}
</div>
<div className="flex-1 text-center md:text-left">
<h1 className="text-3xl font-black text-white tracking-tight leading-none">
              {profile.firstName} {profile.lastName}
</h1>
<p className="text-xs mt-2 font-bold uppercase tracking-widest text-white/70">
              blueMarble Silver Member
</p>
<p className="text-[10px] mt-1 font-medium text-white/40 uppercase tracking-wider">
              Member since Jan 2021
</p>
</div>
<div className="flex gap-3">
            {editing ? (
<>
<button
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
>
                  Cancel
</button>
<button
                  onClick={handleSave}
                  className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-600 transition-all flex items-center gap-2"
>
<Save size={14} /> Save
</button>
</>
            ) : (
<button
                onClick={() => setEditing(true)}
                className="px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-[#052ce0] text-white shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center gap-2"
>
<Edit3 size={14} /> Edit Profile
</button>
            )}
</div>
</div>
 
        {/* Success Toast */}
        {saved && (
<div className="mb-8 flex items-center gap-3 p-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-2xl text-emerald-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
<CheckCircle2 size={18} />
            Profile updated successfully
</div>
        )}
 
        {/* Form Sections Container */}
<div className="bg-white/20 backdrop-blur-lg border border-white/30 p-8 md:p-12 rounded-[3rem] shadow-2xl">
<Section title="ID Details">
<Field label="ID Number" field="idNumber" />
<Field label="Passport" field="passportNumber" />
<Field label="Birth Date" field="dateOfBirth" />
<Field label="Nationality" field="nationality" />
</Section>
 
          <Section title="Employment">
<Field label="First Name" field="firstName" />
<Field label="Last Name" field="lastName" />
<Field label="Status" field="employmentStatus" />
<Field label="Income" field="incomeBracket" />
</Section>
 
          <Section title="Contact">
<Field label="Mobile" field="mobile" />
<Field label="Email" field="email" />
<Field label="Preferred Method" field="preferredContact" />
</Section>
 
          <Section title="Address">
<Field label="Street" field="streetAddress" />
<Field label="Suburb" field="suburb" />
<Field label="City" field="city" />
<Field label="Postal Code" field="postalCode" />
</Section>
</div>
 
        {/* Brand Slogan Footer */}
<div className="text-center mt-16 mb-8">
<div className="flex items-center justify-center gap-4 mb-4">
<div className="h-[1px] w-12 bg-white/20" />
<span className="text-[14px] font-black text-white/50 uppercase tracking-[0.4em]">
              blueMarble
</span>
<div className="h-[1px] w-12 bg-white/20" />
</div>
<p className="text-sm md:text-base text-white/80 font-semibold italic tracking-wide">
            "Your World, Your Bank, Your Freedom."
</p>
</div>
</div>
</div>
  );
};
 
export default Profile;