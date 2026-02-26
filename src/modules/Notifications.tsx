import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Bell, Check, Trash2 } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function NotificationsInner() {
    const { data } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`, apiFetcher, {
        fallbackData: [
            { id: 'n_001', title: 'New patient registered', message: 'Jean Pierre completed onboarding.', read: false, createdAt: '2 min ago' },
            { id: 'n_002', title: 'Device offline', message: 'NL-EEG-003 has been offline for 3 hours.', read: false, createdAt: '1 hour ago' },
            { id: 'n_003', title: 'Session completed', message: 'Session ses_03 completed successfully.', read: true, createdAt: '3 hours ago' },
            { id: 'n_004', title: 'Partnership request', message: 'WHO Africa Region submitted a new application.', read: true, createdAt: '1 day ago' },
        ]
    });

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
                <p className="mt-1 text-sm text-muted-foreground">System alerts and updates</p>
            </div>
            <div className="space-y-2">
                {data?.map((n: any) => (
                    <div key={n.id} className={`flex items-start justify-between rounded-xl border bg-card px-5 py-4 transition-colors hover:bg-secondary/30 ${!n.read ? 'border-l-2 border-l-primary' : ''}`}>
                        <div className="flex items-start gap-3">
                            <Bell size={16} className={`mt-0.5 ${!n.read ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div>
                                <p className={`text-sm font-medium ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                                <p className="text-xs text-muted-foreground">{n.message}</p>
                                <p className="mt-1 text-[10px] text-muted-foreground/60">{n.createdAt}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {!n.read && <button className="text-muted-foreground hover:text-primary"><Check size={14} /></button>}
                            <button className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Notifications() {
    return <PortalErrorBoundary serviceName="Notification Service"><NotificationsInner /></PortalErrorBoundary>;
}
