import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Edit3, Save, CheckCircle2, Loader2 } from 'lucide-react';

// Updated to match backend schema fields
interface ProfileData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  bio: string;
  idNumber: string;
  passportNumber: string;
  dateOfBirth: string;
  nationality: string;
  employmentStatus: string;
  incomeBracket: string;
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
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [draft, setDraft] = useState<ProfileData | null>(null);

  const userId = localStorage.getItem('userId');

  // 1. Fetch Profile Data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/${userId}`);
        const data = await response.json();
        
        // Map backend 'name' to first/last if needed, or use existing fields
        setProfile(data);
        setDraft(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  // 2. Handle Save to Backend
  const handleSave = async () => {
    if (!draft || !userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
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
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#052ce0]">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );

  if (!profile || !draft) return null;

  const Field = ({ label, field }: { label: string; field: keyof ProfileData }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-white/50">
        {label}
      </label>
      {editing ? (
        <input
          value={(draft[field] as string) || ''}
          onChange={e => setDraft(prev => prev ? ({ ...prev, [field]: e.target.value }) : null)}
          className="bg-white/40 border-2 border-white/20 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-white placeholder-white/30 outline-none focus:border-white/60 focus:bg-white/50 transition-all shadow-inner"
        />
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-white shadow-sm">
          {(profile[field] as string) || <span className="text-white/20 italic">Not set</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full pb-44 overflow-x-hidden" style={{ background: "linear-gradient(to bottom right, #052ce0, #ADE8F4)" }}>
      {/* Header, Hero, and Sections as defined in your UI... */}
      {/* Use the handleSave and handleCancel functions in your buttons */}
    </div>
  );
};
export default Profile;