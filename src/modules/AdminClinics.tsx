import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Building2, Plus, BarChart3 } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function ClinicsInner() {
    const { data, isPending: isLoading } = useQuery({
        queryKey: ['admin-clinics'],
        queryFn: () => apiFetcher(`${import.meta.env.VITE_API_BASE_URL}/api/clinics`),
    });

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Management</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Facility administration and statistics</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"><Plus size={14} /> Create Clinic</button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {isLoading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-card" />) : data?.map((c: any) => (
                    <div key={c._id || c.id} className="rounded-2xl border bg-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <Building2 size={20} className="text-primary" />
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">{c.status}</span>
                        </div>
                        <h3 className="text-base font-semibold text-foreground">{c.name}</h3>
                        <p className="mb-4 text-xs text-muted-foreground">{c.type}</p>
                        <div className="grid grid-cols-3 gap-3 border-t pt-3">
                            <div className="text-center"><p className="text-lg font-bold tabular-nums text-foreground">{c.doctors}</p><p className="text-[10px] text-muted-foreground">Doctors</p></div>
                            <div className="text-center"><p className="text-lg font-bold tabular-nums text-foreground">{c.patients}</p><p className="text-[10px] text-muted-foreground">Patients</p></div>
                            <div className="text-center"><p className="text-lg font-bold tabular-nums text-foreground">{c.devices}</p><p className="text-[10px] text-muted-foreground">Devices</p></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminClinics() {
    return <PortalErrorBoundary serviceName="Clinic Service"><ClinicsInner /></PortalErrorBoundary>;
}
