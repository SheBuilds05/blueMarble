import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications, markNotificationRead, deleteNotification, markAllNotificationsRead } from '../services/api';

interface Notification {
  _id: string;
  id?: string;
  title: string;
  message: string;
  type: 'transaction' | 'alert' | 'info' | 'success';
  read: boolean;
  createdAt: string;
}

const Notifications = () => {
  const { addNotification: addLocalNotification } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notifications from backend
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications(filter);
      // Handle both possible response structures
      const data = response.data;
      const notifs = data.notifications || data.data?.notifications || [];
      setNotifications(notifs);
      setError(null);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Could not load notifications. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      // Update local state
      setNotifications(prev =>
        prev.map(n => (n._id === id || n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id && n.id !== id));
      addLocalNotification({
        title: 'Notification Deleted',
        message: 'The notification has been removed.',
        type: 'info',
      });
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      addLocalNotification({
        title: 'All Read',
        message: 'All notifications marked as read.',
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transaction': return '💰';
      case 'alert': return '⚠️';
      case 'success': return '✅';
      default: return '📬';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <button onClick={loadNotifications} className="bg-[#052CE0] text-white px-6 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1a2a4a]">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-gray-500 text-sm">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-[#052CE0] hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          {(['all', 'unread', 'read'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm ${
                filter === f
                  ? 'bg-[#052CE0] text-white'
                  : 'bg-white text-gray-600 shadow'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}{' '}
              {f === 'unread' && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow divide-y">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-400">No notifications</p>
            </div>
          ) : (
            filteredNotifications.map(notif => {
              const notifId = notif._id || notif.id;
              return (
                <div
                  key={notifId}
                  className={`p-4 flex gap-3 ${!notif.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="text-2xl">{getTypeIcon(notif.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-[#1a2a4a]">{notif.title}</h3>
                      <span className="text-xs text-gray-400">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                    <div className="flex gap-3 mt-2">
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notifId!)}
                          className="text-xs text-[#052CE0] hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notifId!)}
                        className="text-xs text-gray-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;