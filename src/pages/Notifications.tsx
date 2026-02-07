import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Check, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useI18n } from '@/lib/i18n';
import { getNotifications, markNotificationAsRead, deleteNotification } from "@/api/notifications";
import type { Notification } from "@/api/notifications";

const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");

  const { t } = useI18n();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error: any) {
      toast.error(error?.message || t('notifications.failedFetch'));
    } finally {
      setIsLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      const result = await markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? result : n));
      toast.success(t('notifications.markedAsRead'));
    } catch (error: any) {
      toast.error(error?.message || t('notifications.failedMarkRead'));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      for (const notif of notifications.filter(n => !n.read)) {
        await markNotificationAsRead(notif.id);
      }
      await fetchNotifications();
      toast.success(t('notifications.allMarkedRead'));
    } catch (error: any) {
      toast.error(error?.message || t('notifications.failedMarkAllRead'));
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success(t('notifications.deleted'));
    } catch (error: any) {
      toast.error(error?.message || t('notifications.failedDelete'));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 text-green-500';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'error':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-blue-500/10 text-blue-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    return matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
            <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
            <p className="text-muted-foreground">{t('notifications.description')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleMarkAllAsRead}>
                <Check className="h-4 w-4" />
              {t('notifications.markAll')}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('notifications.allNotifications')}
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount} unread
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-4">
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder={t('notifications.filter.type.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">{t('notifications.noNotifications')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('notifications.caughtUp')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => {
                      const title = notification.title || 'Notification';
                      const message = notification.message || '';
                      const createdAt = new Date(notification.createdAt);
                      const timeAgo = getTimeAgo(createdAt);
                      
                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            "flex flex-col gap-2 p-4 rounded-lg border transition-colors",
                            !notification.read && "bg-muted/50"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={cn("h-2 w-2 rounded-full mt-2", getNotificationIcon(notification.type))} />
                              <div>
                                <h3 className="font-medium">{title}</h3>
                                <p className="text-sm text-muted-foreground">{message}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{timeAgo}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-fit text-xs"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Notifications; 