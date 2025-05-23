import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Check, Trash2, Filter } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  category: 'analysis' | 'system' | 'alert' | 'report';
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Analysis Complete",
      message: "Your EEG session from 2 hours ago has been analyzed.",
      time: "2h ago",
      type: "success",
      read: false,
      category: "analysis",
    },
    {
      id: "2",
      title: "Signal Quality Alert",
      message: "Low signal quality detected in your last session.",
      time: "5h ago",
      type: "warning",
      read: false,
      category: "alert",
    },
    {
      id: "3",
      title: "Weekly Report Ready",
      message: "Your weekly brain activity report is now available.",
      time: "1d ago",
      type: "info",
      read: true,
      category: "report",
    },
    {
      id: "4",
      title: "System Update",
      message: "New features have been added to the analysis tools.",
      time: "2d ago",
      type: "info",
      read: true,
      category: "system",
    },
    {
      id: "5",
      title: "Analysis Interrupted",
      message: "Your last session was interrupted due to poor signal quality.",
      time: "3d ago",
      type: "error",
      read: true,
      category: "alert",
    },
    {
      id: "6",
      title: "Monthly Summary",
      message: "Your monthly brain activity summary is now available.",
      time: "1w ago",
      type: "info",
      read: true,
      category: "report",
    },
  ]);

  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: Notification['type']) => {
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
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;
    return matchesType && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Manage your notifications and alerts</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={markAllAsRead}>
              <Check className="h-4 w-4" />
              Mark all as read
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={clearAllNotifications}>
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                All Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount} unread
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="alert">Alerts</SelectItem>
                    <SelectItem value="report">Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up! Check back later for new updates.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
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
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                          <Badge variant="outline" className="text-xs">
                            {notification.category}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => deleteNotification(notification.id)}
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
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Notifications; 