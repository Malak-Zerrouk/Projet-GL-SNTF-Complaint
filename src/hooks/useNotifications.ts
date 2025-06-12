import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: string;
  message: string;
  type: 'complaint_status' | 'new_complaint' | 'comment';
  complaintId?: string;
  read: boolean;
  createdAt: string;
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    message: 'Votre réclamation #102 a été acceptée par un agent',
    type: 'complaint_status',
    complaintId: '1',
    read: false,
    createdAt: '2024-01-16T09:00:00Z',
  },
  {
    id: '2',
    message: 'Nouvelle réclamation soumise - Retard important du train Alger-Oran',
    type: 'new_complaint',
    complaintId: '1',
    read: false,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '3',
    message: 'Votre réclamation #101 est maintenant en cours de traitement',
    type: 'complaint_status',
    complaintId: '2',
    read: true,
    createdAt: '2024-01-14T14:20:00Z',
  },
];

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Simulate API call
    setTimeout(() => {
      // Filter notifications based on user role
      const filteredNotifications = MOCK_NOTIFICATIONS.filter(notification => {
        if (user.role === 'voyageur') {
          // Voyageurs only see status updates for their complaints
          return notification.type === 'complaint_status';
        } else {
          // Agents see new complaints and status changes
          return notification.type === 'new_complaint' || notification.type === 'comment';
        }
      });

      setNotifications(filteredNotifications);
      setLoading(false);
    }, 500);
  }, [user]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    addNotification,
    unreadCount,
  };
}