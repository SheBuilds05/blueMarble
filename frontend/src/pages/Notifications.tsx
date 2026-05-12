import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { getNotifications } from '../services/api';
=======
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../services/api';
import { ChevronLeft, X, Bell, DollarSign, AlertCircle, CheckCircle, Info, Inbox } from 'lucide-react';
import BottomNav from '../components/BottomNav';
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'transaction' | 'alert' | 'info' | 'success';
  read: boolean;
  createdAt: string;
}

const Notifications = () => {
<<<<<<< HEAD
=======
  const navigate = useNavigate();
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data);
      } catch (err) {
<<<<<<< HEAD
        console.error('Failed to load notifications:', err);
=======
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
        setError('Could not load notifications');
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
<<<<<<< HEAD
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-ZA');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction': return '💰';
      case 'alert': return '⚠️';
      case 'success': return '✅';
      default: return '📬';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] flex items-center justify-center">
        <div className="text-[#1a2a4a] text-lg">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-[#1a2a4a] mb-2">Unable to Load Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-[#052CE0] text-white px-6 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#052CE0] to-[#1e40af] shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1a2a4a]">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with your account activity</p>
        </div>

        <div className="bg-white rounded-xl shadow divide-y">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-400">No notifications</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif._id} className="p-4 flex gap-3">
                <div className="text-2xl">{getIcon(notif.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-[#1a2a4a]">{notif.title}</h3>
                    <span className="text-xs text-gray-400">{formatDate(notif.createdAt)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
=======
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' });
  };

  const getIcon = (type: string) => {
    const iconSize = 20;
    switch (type) {
      case 'transaction': return <DollarSign size={iconSize} className="text-emerald-500" />;
      case 'alert': return <AlertCircle size={iconSize} className="text-red-500" />;
      case 'success': return <CheckCircle size={iconSize} className="text-[#002a8f]" />;
      default: return <Info size={iconSize} className="text-slate-400" />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-[#002a8f]/10 rounded-2xl" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* Signature Portfolio Blue Header */}
      <nav className="bg-[#002a8f] p-8 pb-16 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        
        <div className="max-w-lg mx-auto flex justify-between items-center relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">Inbound</p>
            <h1 className="font-black text-white text-2xl uppercase tracking-tighter">Notices</h1>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10"
          >
            <X size={24} />
          </button>
        </div>
      </nav>

      <main className="px-6 max-w-lg mx-auto -mt-10 relative z-20">
        {/* Alerts Container */}
        <div className="bg-white rounded-[3rem] p-4 shadow-[0_20px_50px_rgba(0,42,143,0.08)] border border-slate-100 min-h-[50vh]">
          
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-6">
                <Inbox size={40} />
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">All caught up</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map(notif => (
                <div 
                  key={notif._id} 
                  className={`p-6 rounded-[2.2rem] flex gap-4 transition-all active:scale-[0.98] ${
                    notif.read ? 'bg-transparent' : 'bg-slate-50/80'
                  }`}
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xs font-black text-[#000000] uppercase tracking-tight leading-tight">
                        {notif.title}
                      </h3>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter ml-2 shrink-0">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.read && (
                    <div className="w-1.5 h-1.5 bg-[#002a8f] rounded-full mt-2 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brand Slogan */}
        <div className="text-center mt-12 mb-10 opacity-30">
          <p className="text-[10px] font-black text-[#000000] uppercase tracking-[0.4em]">blueMarble Secure</p>
        </div>
      </main>

      <BottomNav />
>>>>>>> 36758dffb0cf3b1196eb1b447bc814e1da3acf35
    </div>
  );
};

export default Notifications;