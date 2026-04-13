import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
  const { notifications, markAsRead, deleteNotification, markAllAsRead } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-ZA');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transaction': return '💳';
      case 'alert': return '⚠️';
      case 'success': return '✓';
      default: return '📬';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000919] via-[#0a1525] to-[#000919] p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-wide mb-2">Notifications</h1>
        <div className="w-12 h-px bg-[#052CE0] mx-auto mb-3"></div>
        <p className="text-white/40 text-sm font-light">Stay updated with your account activity</p>
      </div>

      {/* Notifications Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Actions */}
        <div className="p-6 border-b border-[#e0e0e0]">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-[#1a1a2e] text-xl font-light">All Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-[#888888] text-sm mt-1">{unreadCount} unread</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-[#f5f5f5] border border-[#e0e0e0] rounded-lg text-[#666666] text-sm hover:bg-[#e0e0e0] transition-all"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'read', label: 'Read' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                  filter === tab.id
                    ? 'bg-[#052CE0] text-white'
                    : 'text-[#666666] hover:text-[#1a1a2e]'
                }`}
              >
                {tab.label}
                {tab.id === 'unread' && unreadCount > 0 && (
                  <span className="ml-1 text-xs">({unreadCount})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-[#e0e0e0]">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-[#888888] text-sm">No notifications to display</p>
              <p className="text-[#aaaaaa] text-xs mt-2">When you receive notifications, they'll appear here</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 transition-all ${
                  !notif.read ? 'bg-[#052CE0]/3' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      !notif.read 
                        ? 'bg-[#052CE0]/10 text-[#052CE0]' 
                        : 'bg-[#f5f5f5] text-[#888888]'
                    }`}>
                      {getTypeIcon(notif.type)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3 className={`text-base ${
                        !notif.read ? 'text-[#1a1a2e] font-medium' : 'text-[#666666]'
                      }`}>
                        {notif.title}
                      </h3>
                      <span className="text-[#aaaaaa] text-xs">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-[#888888] text-sm mt-1">{notif.message}</p>
                    
                    {/* Actions */}
                    <div className="flex gap-3 mt-3">
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-xs text-[#052CE0] hover:text-[#052CE0]/70 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-xs text-[#999999] hover:text-[#666666] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
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