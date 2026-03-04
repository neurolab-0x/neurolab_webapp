import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Activity, Zap, Database } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

interface AdminData {
    activeNodes: number;
    globalSnrAvg: number;
    systemLatencyMs: number;
}

const AdminDashboardInner = () => {
    const { data, isLoading } = useSWR<AdminData>(`${import.meta.env.VITE_API_BASE_URL}/api/admin/metrics`, apiFetcher);

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-display text-foreground">Command Center</h1>
                <p className="text-muted-foreground mt-2">Global neural telemetry and system wide oversight.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Metric 1 */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="text-muted-foreground" size={20} />
                        <h3 className="text-sm font-medium text-muted-foreground">Active Nodes</h3>
                    </div>
                    {isLoading ? (
                        <div className="h-10 w-24 animate-pulse rounded bg-secondary" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tabular-nums text-foreground">
                                {data?.activeNodes.toLocaleString()}
                            </span>
                            <span className="text-sm font-medium text-emerald-500">+12%</span>
                        </div>
                    )}
                </div>

                {/* Metric 2 */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap className="text-muted-foreground" size={20} />
                        <h3 className="text-sm font-medium text-muted-foreground">Global SNR Avg</h3>
                    </div>
                    {isLoading ? (
                        <div className="h-10 w-24 animate-pulse rounded bg-secondary" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tabular-nums text-foreground">
                                {data?.globalSnrAvg.toFixed(1)} <span className="text-xl text-muted-foreground">dB</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Metric 3 */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="text-muted-foreground" size={20} />
                        <h3 className="text-sm font-medium text-muted-foreground">System Latency</h3>
                    </div>
                    {isLoading ? (
                        <div className="h-10 w-24 animate-pulse rounded bg-secondary" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tabular-nums text-foreground">
                                {data?.systemLatencyMs} <span className="text-xl text-muted-foreground">ms</span>
                            </span>
                            <span className="text-sm font-medium text-emerald-500">Optimal</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function AdminPortal() {
    return (
        <PortalErrorBoundary serviceName="Global Metrics Service">
            <AdminDashboardInner />
        </PortalErrorBoundary>
    );
}
