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
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), 
    },
    {
      id: '2',
      title: 'Welcome to OpenBank',
      message: 'Thank you for joining us! Start managing your finances today.',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '3',
      title: 'Security Alert',
      message: 'New login detected from Chrome on Windows',
      type: 'alert',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: '4',
      title: 'Bill Payment Reminder',
      message: 'Your electricity bill is due in 3 days',
      type: 'alert',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-ZA');
  };

  const getTypeStyles = (type: string, isRead: boolean) => {
    switch (type) {
      case 'transaction': return { icon: '💳', bg: isRead ? 'bg-gray-100' : 'bg-blue-100', color: 'text-blue-600' };
      case 'alert': return { icon: '⚠️', bg: isRead ? 'bg-gray-100' : 'bg-amber-100', color: 'text-amber-600' };
      case 'success': return { icon: '✓', bg: isRead ? 'bg-gray-100' : 'bg-emerald-100', color: 'text-emerald-600' };
      default: return { icon: '📬', bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] p-4 md:p-8 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#052CE0] via-[#3b82f6] to-[#052CE0]"></div>

      {/* Exit/Back Button */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <button 
          onClick={() => window.history.back()} 
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:bg-[#052CE0] transition-all duration-300"
        >
          <svg className="w-5 h-5 text-[#052CE0] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-xs font-bold text-[#052CE0] hover:underline uppercase tracking-tight">
            Mark all read
          </button>
        )}
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1a2a4a] tracking-tight">Notifications</h1>
        <p className="text-[#4a5a7a] text-sm mt-1">Updates on your activity and security</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 w-fit mx-auto">
          {['all', 'unread', 'read'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                filter === t ? 'bg-[#052CE0] text-white shadow-md' : 'text-[#4a5a7a] hover:bg-gray-100'
              }`}
            >
              {t} {t === 'unread' && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>

        {/* List Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center text-2xl">Inbox</div>
                <p className="text-[#4a5a7a] font-medium">Nothing to see here</p>
                <p className="text-[#aaaaaa] text-xs mt-1">We'll notify you when something happens.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const styles = getTypeStyles(notif.type, notif.read);
                return (
                  <div key={notif.id} className={`p-5 transition-all group ${!notif.read ? 'bg-blue-50/40' : 'hover:bg-gray-50/80'}`}>
                    <div className="flex gap-4">
                      {/* Icon Container */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${styles.bg} ${styles.color} flex items-center justify-center text-xl shadow-sm`}>
                        {styles.icon}
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`text-sm truncate ${!notif.read ? 'text-[#1a2a4a] font-bold' : 'text-[#4a5a7a] font-semibold'}`}>
                            {notif.title}
                          </h3>
                          <span className="text-[10px] font-bold text-[#aaaaaa] whitespace-nowrap ml-2">
                            {formatDate(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-[#4a5a7a] leading-relaxed mb-3">
                          {notif.message}
                        </p>
                        
                        {/* Interaction Buttons */}
                        <div className="flex items-center gap-4">
                          {!notif.read && (
                            <button 
                              onClick={() => markAsRead(notif.id)}
                              className="text-[11px] font-bold text-[#052CE0] uppercase tracking-wider hover:opacity-70"
                            >
                              Mark Read
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notif.id)}
                            className="text-[11px] font-bold text-red-400 uppercase tracking-wider hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Unread Indicator Dot */}
                      {!notif.read && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#052CE0] animate-pulse mt-1"></div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;