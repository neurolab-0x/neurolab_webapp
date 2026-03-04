import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Activity, Radio } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function SessionsInner() {
    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/sessions`, apiFetcher);

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Session Monitoring</h1>
                <p className="mt-1 text-sm text-muted-foreground">Real-time and historical recording sessions</p>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-card">
                <table className="w-full">
                    <thead><tr className="border-b bg-secondary/30">
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Session</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Device</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                    </tr></thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">Loading...</td></tr> : data?.map((s: any) => (
                            <tr key={s._id || s.id} className="border-b border-border/50 hover:bg-secondary/20">
                                <td className="px-6 py-4 text-sm tabular-nums text-muted-foreground">{s._id || s.id}</td>
                                <td className="px-6 py-4 text-sm font-medium text-foreground">{s.user}</td>
                                <td className="px-6 py-4 text-sm tabular-nums text-muted-foreground">{s.device}</td>
                                <td className="px-6 py-4 text-sm tabular-nums text-muted-foreground">{s.duration}</td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 text-xs font-medium ${s.status === 'ACTIVE' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                        {s.status === 'ACTIVE' && <Radio size={12} className="animate-pulse" />} {s.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function AdminSessions() {
    return <PortalErrorBoundary serviceName="Session Monitor"><SessionsInner /></PortalErrorBoundary>;
}
