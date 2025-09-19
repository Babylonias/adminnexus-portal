import { useState, useEffect } from 'react';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

// Mock data pour les notifications
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Nouveau amphithéâtre ajouté',
    message: 'L\'amphithéâtre Sciences 200 a été ajouté avec succès à l\'Université Paris Tech',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 heures
  },
  {
    id: 2,
    title: 'Maintenance programmée',
    message: 'Maintenance prévue pour l\'Amphi Central le 15 mars 2024',
    type: 'warning',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 heures
  },
  {
    id: 3,
    title: 'Mise à jour système',
    message: 'Le système CampusWA a été mis à jour vers la version 2.1.0',
    type: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 jour
  },
  {
    id: 4,
    title: 'Erreur de synchronisation',
    message: 'Problème de synchronisation détecté avec la base de données',
    type: 'error',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.max(...notifications.map(n => n.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Simuler l'arrivée de nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Ajouter une notification aléatoire toutes les 5 minutes (pour la démo)
      if (Math.random() < 0.1) { // 10% de chance
        const types: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
        const messages = [
          'Nouvelle université ajoutée au système',
          'Sauvegarde automatique effectuée',
          'Capacité d\'amphithéâtre mise à jour',
          'Connexion utilisateur détectée',
        ];
        
        addNotification({
          title: 'Notification automatique',
          message: messages[Math.floor(Math.random() * messages.length)],
          type: types[Math.floor(Math.random() * types.length)],
          isRead: false,
        });
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };
};