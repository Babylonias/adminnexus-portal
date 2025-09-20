import { useState } from 'react';
import { Bell, Check, CheckCheck, X, AlertCircle, Info, CheckCircle, AlertTriangle, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotifications, type Notification } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-success" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    default:
      return <Info className="h-5 w-5 text-primary" />;
  }
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `Il y a ${diffInDays}j`;
};

export const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  // Filtrer et trier les notifications
  const filteredNotifications = notifications
    .filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'unread' && !notification.isRead) ||
                           (filterType === 'read' && notification.isRead);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.type.localeCompare(b.type);
    });

  const unreadNotifications = filteredNotifications.filter(n => !n.isRead);
  const readNotifications = filteredNotifications.filter(n => n.isRead);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Gérez toutes vos notifications
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCheck className="h-4 w-4 mr-2" />
              Tout marquer comme lu ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="unread">Non lues</SelectItem>
                <SelectItem value="read">Lues</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium">Non lues</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">Lues</p>
                <p className="text-2xl font-bold">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Filtrées</p>
                <p className="text-2xl font-bold">{filteredNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des notifications */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Toutes ({filteredNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Non lues ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Lues ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <NotificationList 
            notifications={filteredNotifications}
            onNotificationClick={handleNotificationClick}
            onDeleteNotification={deleteNotification}
          />
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <NotificationList 
            notifications={unreadNotifications}
            onNotificationClick={handleNotificationClick}
            onDeleteNotification={deleteNotification}
          />
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          <NotificationList 
            notifications={readNotifications}
            onNotificationClick={handleNotificationClick}
            onDeleteNotification={deleteNotification}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onDeleteNotification: (id: string) => void;
}

const NotificationList = ({ notifications, onNotificationClick, onDeleteNotification }: NotificationListProps) => {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">Aucune notification</h3>
          <p className="text-muted-foreground">
            Aucune notification ne correspond à vos critères de recherche.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <Card 
          key={notification.id}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md group",
            !notification.isRead && "border-l-4 border-l-primary bg-primary/5"
          )}
          onClick={() => onNotificationClick(notification)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-medium text-sm mb-1",
                      !notification.isRead && "font-semibold"
                    )}>
                      {notification.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatTimeAgo(notification.createdAt)}</span>
                      <Badge variant="outline" className="text-xs">
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.isRead && (
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNotification(notification.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};