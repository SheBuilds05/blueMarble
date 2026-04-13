import React, { useState } from 'react';
import { ChevronLeft, X, Edit3, Save, User } from 'lucide-react';

interface ProfileData {
  // ID Details
  idNumber: string;
  passportNumber: string;
  dateOfBirth: string;
  nationality: string;
  // Additional Details
  firstName: string;
  lastName: string;
  employmentStatus: string;
  incomeBracket: string;
  // Contact Details
  mobile: string;
  email: string;
  preferredContact: string;
  // Address Book
  streetAddress: string;
  suburb: string;
  city: string;
  postalCode: string;
  province: string;
}

const Profile: React.FC = () => {
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
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {label}
      </label>
      {editing ? (
        <input
          value={draft[field]}
          onChange={e => setDraft(prev => ({ ...prev, [field]: e.target.value }))}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-white outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
          onFocus={e => (e.target.style.border = '1px solid rgba(255,255,255,0.7)')}
          onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.3)')}
        />
      ) : (
        <div
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-white"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {profile[field]}
        </div>
      )}
    </div>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#93c5fd' }}>
          {title}
        </h3>
        <div className="flex-1 h-px" style={{ background: 'rgba(147,197,253,0.2)' }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #93c5fd 100%)' }}>
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 max-w-4xl mx-auto">
        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold tracking-wide">My profile</h2>
        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
          <X size={20} />
        </button>
      </div>

      <div className="px-6 max-w-3xl mx-auto pb-12">
        {/* Avatar hero */}
        <div
          className="rounded-3xl p-6 mb-6 flex items-center gap-5"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.25)' }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e3a8a, #60a5fa)', border: '3px solid rgba(255,255,255,0.3)' }}
          >
            RN
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-sm mt-1" style={{ color: '#93c5fd' }}>OpenBank Silver Member</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Member since January 2021</p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer hover:scale-105"
                  style={{ background: '#16a34a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', boxShadow: '0 4px 15px rgba(22,163,74,0.4)' }}
                >
                  <Save size={14} /> Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{ background: '#1d4ed8', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', boxShadow: '0 4px 15px rgba(29,78,216,0.4)' }}
              >
                <Edit3 size={14} /> Edit profile
              </button>
            )}
          </div>
        </div>

        {/* Saved toast */}
        {saved && (
          <div
            className="mb-4 px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2"
            style={{ background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.4)', color: '#86efac' }}
          >
            <span>✓</span> Profile updated successfully
          </div>
        )}

        {/* Sections card */}
        <div
          className="rounded-3xl p-8 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <Section title="ID details">
            <Field label="ID number" field="idNumber" />
            <Field label="Passport number" field="passportNumber" />
            <Field label="Date of birth" field="dateOfBirth" />
            <Field label="Nationality" field="nationality" />
          </Section>

          <Section title="Additional details">
            <Field label="First name" field="firstName" />
            <Field label="Last name" field="lastName" />
            <Field label="Employment status" field="employmentStatus" />
            <Field label="Income bracket" field="incomeBracket" />
          </Section>

          <Section title="Contact details">
            <Field label="Mobile number" field="mobile" />
            <Field label="Email address" field="email" />
            <Field label="Preferred contact method" field="preferredContact" />
          </Section>

          <Section title="Address book">
            <Field label="Street address" field="streetAddress" />
            <Field label="Suburb" field="suburb" />
            <Field label="City" field="city" />
            <Field label="Postal code" field="postalCode" />
            <Field label="Province" field="province" />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Profile;