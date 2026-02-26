import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Cpu, Wifi, WifiOff, Plus } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function AdminDevicesInner() {
    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/devices`, apiFetcher, {
        fallbackData: [
            { id: 'dev_001', name: 'NL-EEG-001', type: 'EEG', serialNumber: 'NL-2026-A001', status: 'ACTIVE', assignedTo: 'Dr. Fiston Mahamba', clinic: 'Kigali Clinic' },
            { id: 'dev_002', name: 'NL-EEG-002', type: 'EEG', serialNumber: 'NL-2026-A002', status: 'ACTIVE', assignedTo: 'Dr. Amara Diallo', clinic: 'Kigali Clinic' },
            { id: 'dev_003', name: 'NL-VOICE-001', type: 'VOICE', serialNumber: 'NL-2026-V001', status: 'INACTIVE', assignedTo: null, clinic: null },
            { id: 'dev_004', name: 'NL-EEG-003', type: 'EEG', serialNumber: 'NL-2026-A003', status: 'MAINTENANCE', assignedTo: null, clinic: 'Nairobi Lab' },
        ]
    });

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Device Fleet</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Global neural interface hardware registry</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                    <Plus size={14} /> Register Device
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-card" />) : data?.map((d: any) => (
                    <div key={d.id} className="rounded-2xl border bg-card p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <Cpu size={18} className="text-muted-foreground" />
                            {d.status === 'ACTIVE' ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-muted-foreground" />}
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">{d.name}</h3>
                        <p className="text-xs text-muted-foreground">S/N: {d.serialNumber}</p>
                        {d.assignedTo && <p className="mt-2 text-xs text-primary">{d.assignedTo}</p>}
                        {d.clinic && <p className="text-xs text-muted-foreground">{d.clinic}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminDevices() {
    return <PortalErrorBoundary serviceName="Device Fleet Service"><AdminDevicesInner /></PortalErrorBoundary>;
}
