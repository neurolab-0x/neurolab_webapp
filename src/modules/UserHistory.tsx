import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Clock, FileText } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function HistoryInner() {
    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/users/history`, apiFetcher, {
        fallbackData: [
            { id: 'ses_001', date: '2026-02-25', type: 'EEG Analysis', status: 'COMPLETED', duration: '32m', snr_avg: 21.4 },
            { id: 'ses_002', date: '2026-02-24', type: 'Voice Analysis', status: 'COMPLETED', duration: '12m', snr_avg: 18.7 },
            { id: 'ses_003', date: '2026-02-22', type: 'EEG Analysis', status: 'COMPLETED', duration: '45m', snr_avg: 24.1 },
            { id: 'ses_004', date: '2026-02-20', type: 'EEG Analysis', status: 'PROCESSING', duration: '28m', snr_avg: 19.3 },
            { id: 'ses_005', date: '2026-02-18', type: 'Voice Analysis', status: 'COMPLETED', duration: '15m', snr_avg: 16.8 },
        ]
    });

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Session History</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Complete record of your neural analysis sessions</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium tabular-nums text-muted-foreground">
                    <Clock size={14} /> {data?.length || 0} sessions
                </div>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-xl bg-card" />
                    ))
                ) : (
                    data?.map((session: any) => (
                        <div key={session.id} className="flex items-center justify-between rounded-xl border bg-card px-6 py-4 transition-colors hover:bg-secondary/50">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                    <FileText size={18} className="text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{session.type}</p>
                                    <p className="text-xs text-muted-foreground">{session.date} · {session.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-sm tabular-nums text-muted-foreground">{session.snr_avg} dB</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${session.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>{session.status}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default function UserHistory() {
    return (
        <PortalErrorBoundary serviceName="History Service">
            <HistoryInner />
        </PortalErrorBoundary>
    );
}
