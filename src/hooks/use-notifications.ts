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

// Mock data pour les notifications - Liste étendue pour test de défilement
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Nouveau amphithéâtre ajouté',
    message: 'L\'amphithéâtre Sciences 200 a été ajouté avec succès à l\'Université Paris Tech',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes
  },
  {
    id: 2,
    title: 'Maintenance programmée',
    message: 'Maintenance prévue pour l\'Amphi Central le 15 mars 2024',
    type: 'warning',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 heure
  },
  {
    id: 3,
    title: 'Nouvelle université enregistrée',
    message: 'L\'Université de Lyon Sciences a été ajoutée au système',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 heures
  },
  {
    id: 4,
    title: 'Erreur de synchronisation',
    message: 'Problème de synchronisation détecté avec l\'API Laravel',
    type: 'error',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 heures
  },
  {
    id: 5,
    title: 'Rapport mensuel généré',
    message: 'Le rapport d\'activité de février 2024 est maintenant disponible',
    type: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 heures
  },
  {
    id: 6,
    title: 'Capacité mise à jour',
    message: 'La capacité de l\'Amphi Central a été modifiée à 150 places',
    type: 'info',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 heures
  },
  {
    id: 7,
    title: 'Nouvel équipement installé',
    message: 'Projecteur 4K installé dans l\'amphithéâtre Sciences 101',
    type: 'success',
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 heures
  },
  {
    id: 8,
    title: 'Attention: Maintenance urgente',
    message: 'Maintenance d\'urgence requise pour le système de climatisation',
    type: 'warning',
    isRead: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 heures
  },
  {
    id: 9,
    title: 'Sauvegarde automatique',
    message: 'Sauvegarde quotidienne effectuée avec succès',
    type: 'success',
    isRead: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 heures
  },
  {
    id: 10,
    title: 'Nouveau utilisateur',
    message: 'Un nouvel administrateur a été ajouté au système',
    type: 'info',
    isRead: false,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 heures
  },
  {
    id: 11,
    title: 'Calendrier mis à jour',
    message: 'Le planning des cours de mars 2024 a été publié',
    type: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 jour
  },
  {
    id: 12,
    title: 'Réservation annulée',
    message: 'La réservation de l\'Amphi 300 pour le 20/03 a été annulée',
    type: 'warning',
    isRead: true,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 jours
  }
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