import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Bell, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { apiFetcher } from '../lib/fetcher';

function NotificationsInner() {
    const queryClient = useQueryClient();
    const { data: serverData } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => apiFetcher(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`),
    });
    const mutate = () => queryClient.invalidateQueries({ queryKey: ['notifications'] });

    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (serverData) setNotifications(serverData);
    }, [serverData]);

    const handleMarkRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        try {
            const token = localStorage.getItem('neurai_token') || '';
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (mutate) mutate();
        } catch (err) {
            console.error('Failed to mark read', err);
            if (mutate) mutate();
        }
    };

    const handleDelete = async (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        try {
            const token = localStorage.getItem('neurai_token') || '';
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (mutate) mutate();
        } catch (err) {
            console.error('Failed to delete', err);
            if (mutate) mutate();
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
                <p className="mt-1 text-sm text-muted-foreground">System alerts and updates</p>
            </div>
            <div className="space-y-2">
                <AnimatePresence>
                    {notifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="rounded-xl border border-dashed border-muted bg-card p-12 text-center text-muted-foreground"
                        >
                            No new notifications
                        </motion.div>
                    ) : (
                        notifications.map((n: any) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={n.id}
                                className={`group flex items-start justify-between rounded-xl border bg-card px-5 py-4 transition-colors hover:bg-secondary/30 ${!n.read ? 'border-l-2 border-l-primary' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <Bell size={16} className={`mt-0.5 ${!n.read ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <div>
                                        <p className={`text-sm font-medium ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                                        <p className="text-xs text-muted-foreground">{n.message}</p>
                                        <p className="mt-1 text-[10px] text-muted-foreground/60">{n.createdAt}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {!n.read && (
                                        <button
                                            onClick={() => handleMarkRead(n.id)}
                                            className="rounded p-1 text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-primary group-hover:opacity-100"
                                            title="Mark as read"
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(n.id)}
                                        className="rounded p-1 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                                        title="Delete notification"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function Notifications() {
    return <PortalErrorBoundary serviceName="Notification Service"><NotificationsInner /></PortalErrorBoundary>;
}
