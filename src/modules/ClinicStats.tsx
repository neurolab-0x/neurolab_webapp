import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { BarChart3, Users, Cpu, Activity } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

interface Session {
    id: string;
    patient: string;
    device: string;
    duration: string;
    status: string;
}

function StatsInner() {
    const { data, isPending: isLoading } = useQuery({
        queryKey: ['clinic-stats'],
        queryFn: () => apiFetcher(`${import.meta.env.VITE_API_BASE_URL}/api/clinics/stats/overview`),
    });

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <div><h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Overview</h1><p className="mt-1 text-sm text-muted-foreground">Facility-wide performance and statistics</p></div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-2xl border bg-card p-5"><Users size={20} className="mb-2 text-primary" /><p className="text-2xl font-bold tabular-nums text-foreground">{data?.totalPatients}</p><p className="text-xs text-muted-foreground">Total Patients</p></div>
                <div className="rounded-2xl border bg-card p-5"><Cpu size={20} className="mb-2 text-primary" /><p className="text-2xl font-bold tabular-nums text-foreground">{data?.activeDevices}</p><p className="text-xs text-muted-foreground">Active Devices</p></div>
                <div className="rounded-2xl border bg-card p-5"><Users size={20} className="mb-2 text-primary" /><p className="text-2xl font-bold tabular-nums text-foreground">{data?.totalDoctors}</p><p className="text-xs text-muted-foreground">Doctors</p></div>
                <div className="rounded-2xl border bg-card p-5"><Activity size={20} className="mb-2 text-primary" /><p className="text-2xl font-bold tabular-nums text-foreground">{data?.avgSessionsPerDay}</p><p className="text-xs text-muted-foreground">Sessions / Day</p></div>
            </div>

            <div>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Sessions</h2>
                <div className="overflow-hidden rounded-2xl border bg-card">
                    <table className="w-full">
                        <thead><tr className="border-b bg-secondary/30">
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Device</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                        </tr></thead>
                        <tbody>
                            {data?.recentSessions?.map((s: Session) => (
                                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/20">
                                    <td className="px-6 py-4 text-sm font-medium text-foreground">{s.patient}</td>
                                    <td className="px-6 py-4 text-sm tabular-nums text-muted-foreground">{s.device}</td>
                                    <td className="px-6 py-4 text-sm tabular-nums text-muted-foreground">{s.duration}</td>
                                    <td className="px-6 py-4"><span className={`text-xs font-medium ${s.status === 'ACTIVE' ? 'text-emerald-500' : 'text-muted-foreground'}`}>{s.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function ClinicStats() {
    return <PortalErrorBoundary serviceName="Clinic Analytics"><StatsInner /></PortalErrorBoundary>;
}
