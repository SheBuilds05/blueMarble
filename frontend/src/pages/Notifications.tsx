import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../services/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'transaction' | 'alert' | 'info' | 'success';
  read: boolean;
  createdAt: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data);
      } catch (err) {
        console.error('Failed to load notifications:', err);
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

  const goToDashboard = () => {
    navigate('/dashboard');
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
          <button
            onClick={goToDashboard}
            className="mt-4 w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5 text-[#052CE0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-[#1a2a4a] font-medium">Dashboard</span>
          </button>
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#052CE0] to-[#1e40af] shadow-lg mb-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <h1 className="text-3xl font-bold text-[#1a2a4a] text-center mb-2">Notifications</h1>
        <p className="text-gray-500 text-center mb-8">Stay updated with your account activity</p>

        <div className="bg-white rounded-xl shadow divide-y">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-400">No notifications</p>
              <button
                onClick={goToDashboard}
                className="mt-6 px-6 py-2 bg-[#052CE0] text-white rounded-lg hover:bg-[#052CE0]/90 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif._id} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors">
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
    </div>
  );
};

export default Notifications;