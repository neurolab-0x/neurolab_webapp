import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Users, UserCheck, UserX } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function PatientsInner() {
    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/patients`, apiFetcher, {
        fallbackData: [
            { id: 'pat_001', fullName: 'Jean Pierre', age: 34, status: 'ACTIVE', lastSession: '2026-02-25', condition: 'Stress monitoring', snr_avg: 21.4 },
            { id: 'pat_002', fullName: 'Marie Claire', age: 28, status: 'ACTIVE', lastSession: '2026-02-24', condition: 'Sleep analysis', snr_avg: 18.2 },
            { id: 'pat_003', fullName: 'Paul Kagame Jr.', age: 42, status: 'INACTIVE', lastSession: '2026-02-10', condition: 'Neurological assessment', snr_avg: 24.6 },
            { id: 'pat_004', fullName: 'Ange Teta', age: 31, status: 'ACTIVE', lastSession: '2026-02-26', condition: 'Baseline EEG', snr_avg: 19.8 },
        ]
    });

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div><h1 className="text-2xl font-bold tracking-tight text-foreground">My Patients</h1><p className="mt-1 text-sm text-muted-foreground">Patient roster and monitoring</p></div>
                <button className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">Assign Patient</button>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-card">
                <table className="w-full">
                    <thead><tr className="border-b bg-secondary/30">
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Condition</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">SNR Avg</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Session</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                    </tr></thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">Loading...</td></tr> : data?.map((p: any) => (
                            <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/20">
                                <td className="px-6 py-4"><p className="text-sm font-medium text-foreground">{p.fullName}</p><p className="text-xs text-muted-foreground">Age {p.age}</p></td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{p.condition}</td>
                                <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-foreground">{p.snr_avg} dB</td>
                                <td className="px-6 py-4 text-sm tabular-nums text-muted-foreground">{p.lastSession}</td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1 text-xs font-medium ${p.status === 'ACTIVE' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                        {p.status === 'ACTIVE' ? <UserCheck size={12} /> : <UserX size={12} />} {p.status}
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

export default function DoctorPatients() {
    return <PortalErrorBoundary serviceName="Patient Registry"><PatientsInner /></PortalErrorBoundary>;
}
