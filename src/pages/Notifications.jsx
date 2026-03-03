import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Check, Trash2 } from 'lucide-react';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'grade',
      title: 'Grade Posted',
      message: 'Your grade for Data Structures has been posted: A',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      icon: '📊',
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Assignment Due Soon',
      message: 'Machine Learning Lab assignment is due tomorrow at 11:59 PM',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false,
      icon: '⏰',
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Reminder',
      message: 'Your tuition fee payment is pending. Please complete by the deadline.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      icon: '💳',
    },
    {
      id: 4,
      type: 'enrollment',
      title: 'Enrollment Confirmed',
      message: 'You have been successfully enrolled in Advanced Algorithms',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      read: true,
      icon: '✅',
    },
    {
      id: 5,
      type: 'event',
      title: 'New Event Available',
      message: 'A new campus event has been posted: Tech Symposium 2026',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: true,
      icon: '🎉',
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Layout title="Notifications">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Notifications</h2>
            <p className="text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-card border border-border rounded-lg p-4 transition-all ${
                  !notif.read ? 'border-primary/50 bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl flex-shrink-0">{notif.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{notif.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notif.timestamp.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
