import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Handshake } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function PartnershipsInner() {
    const { data } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/partnerships`, apiFetcher, {
        fallbackData: [
            { id: 'p_001', name: 'Rwanda Biomedical Center', contact: 'info@rbc.gov.rw', status: 'ACTIVE', since: '2025-06-15' },
            { id: 'p_002', name: 'University of Nairobi', contact: 'neuro@uon.ac.ke', status: 'ACTIVE', since: '2025-09-01' },
            { id: 'p_003', name: 'WHO Africa Region', contact: 'afro@who.int', status: 'PENDING', since: '2026-01-10' },
        ]
    });

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div><h1 className="text-2xl font-bold tracking-tight text-foreground">Partnerships</h1><p className="mt-1 text-sm text-muted-foreground">Institutional collaboration network</p></div>
                <button className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">Create Partnership</button>
            </div>
            <div className="space-y-3">
                {data?.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between rounded-xl border bg-card px-6 py-5 hover:bg-secondary/30">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary"><Handshake size={18} className="text-primary" /></div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.contact} · Since {p.since}</p>
                            </div>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{p.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminPartnerships() {
    return <PortalErrorBoundary serviceName="Partnership Service"><PartnershipsInner /></PortalErrorBoundary>;
}
