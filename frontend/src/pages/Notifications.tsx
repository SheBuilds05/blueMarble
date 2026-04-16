import React, { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'alert' | 'success';
  read: boolean;
  createdAt: string;
}

const Notifications = () => {
  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Transfer Successful',
      message: 'R500.00 transferred from Main Savings to Everyday Cheque',
      type: 'transaction',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: '2',
      title: 'Welcome to FinTech App',
      message: 'Thank you for joining us! Start managing your finances today.',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: '3',
      title: 'Security Alert',
      message: 'New login detected from Chrome on Windows',
      type: 'alert',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: '4',
      title: 'Bill Payment Reminder',
      message: 'Your electricity bill is due in 3 days',
      type: 'alert',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notif => notif.id !== id)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8">
      {/* Decorative Header Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#052CE0] to-[#1e40af] shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1a2a4a] tracking-tight mb-2">Notifications</h1>
        <div className="w-12 h-px bg-[#052CE0] mx-auto mb-3"></div>
        <p className="text-[#4a5a7a] text-sm">Stay updated with your account activity</p>
      </div>

      {/* Notifications Card */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header with Actions */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-[#1a2a4a] text-xl font-semibold">All Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-[#4a5a7a] text-sm mt-1">{unreadCount} unread</p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[#4a5a7a] text-sm hover:bg-gray-100 hover:text-[#1a2a4a] transition-all"
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
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === tab.id
                      ? 'bg-[#052CE0] text-white shadow-sm'
                      : 'text-[#4a5a7a] hover:text-[#1a2a4a] hover:bg-gray-100'
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
          <div className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#4a5a7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-[#4a5a7a] text-sm font-medium">No notifications</p>
                <p className="text-[#aaaaaa] text-xs mt-1">When you receive notifications, they'll appear here</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-5 transition-all ${
                    !notif.read ? 'bg-blue-50/30' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        !notif.read 
                          ? 'bg-blue-100 text-[#052CE0]' 
                          : 'bg-gray-100 text-[#4a5a7a]'
                      }`}>
                        {getTypeIcon(notif.type)}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <h3 className={`text-base ${
                          !notif.read ? 'text-[#1a2a4a] font-semibold' : 'text-[#4a5a7a] font-medium'
                        }`}>
                          {notif.title}
                        </h3>
                        <span className="text-[#aaaaaa] text-xs">
                          {formatDate(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-[#4a5a7a] text-sm mt-1">{notif.message}</p>
                      
                      {/* Actions */}
                      <div className="flex gap-4 mt-3">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-xs text-[#052CE0] font-medium hover:text-[#052CE0]/70 transition-colors"
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
    </div>
  );
};

export default Notifications;
