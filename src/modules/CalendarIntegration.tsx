import React, { useState } from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { apiFetcher } from '../lib/fetcher';
import { Calendar, Link as LinkIcon, Unlink, ExternalLink } from 'lucide-react';

const CalendarIntegrationInner = () => {
    const [isConnecting, setIsConnecting] = useState(false);

    const { data, mutate } = useSWR(
        `${import.meta.env.VITE_API_BASE_URL}/api/calendar/status`,
        apiFetcher
    );

    const handleConnect = () => {
        setIsConnecting(true);
        // Simulate redirect to /api/calendar/auth-url
        setTimeout(() => {
            mutate({ connected: true, email: 'dr.chen@neurolab.cc' }, false);
            setIsConnecting(false);
        }, 1500);
    };

    const handleDisconnect = () => {
        // Simulate POST /api/calendar/disconnect
        mutate({ connected: false, email: null }, false);
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-display text-foreground">Calendar Integration</h2>
                <p className="mt-1 text-sm text-muted-foreground">Sync your appointments directly with your external calendar</p>
            </div>

            <div className="rounded-2xl border border-surface-border bg-surface p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${data?.connected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-muted-foreground'}`}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Google Calendar</h3>
                            <p className="mt-1 text-sm text-muted-foreground max-w-md">
                                Two-way sync ensures your clinic schedule and personal calendar are always up to date. Appointments created here will appear in Google Calendar, and vice versa.
                            </p>

                            {data?.connected && (
                                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-500">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Connected as {data.email}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="shrink-0 pt-4 md:pt-0">
                        {data?.connected ? (
                            <button
                                onClick={handleDisconnect}
                                className="inline-flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 hover:border-destructive/30"
                            >
                                <Unlink size={16} /> Disconnect
                            </button>
                        ) : (
                            <button
                                onClick={handleConnect}
                                disabled={isConnecting}
                                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
                            >
                                {isConnecting ? 'Connecting...' : <><LinkIcon size={16} /> Connect Account</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
                <h4 className="font-semibold text-foreground">Integration Settings</h4>
                <div className="space-y-4 divide-y divide-surface-border text-sm">
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <p className="font-medium text-foreground">Sync Direction</p>
                            <p className="text-muted-foreground">Two-way sync (Neurolab ↔ Google)</p>
                        </div>
                        <button className="text-primary font-medium hover:underline">Change</button>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <p className="font-medium text-foreground">Avoid Overlaps</p>
                            <p className="text-muted-foreground">Block out time in Neurolab if Google Calendar has an event</p>
                        </div>
                        <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary/20">
                            <span className="absolute left-1 inline-block h-3.5 w-3.5 translate-x-3.5 transform rounded-full bg-primary transition-transform"></span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default function CalendarIntegration() {
    return (
        <PortalErrorBoundary serviceName="Calendar Synchronization">
            <CalendarIntegrationInner />
        </PortalErrorBoundary>
    );
}
