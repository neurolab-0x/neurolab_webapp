import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Cpu, Wifi, WifiOff } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function DevicesInner() {
    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/devices`, apiFetcher, {
        fallbackData: [
            { id: 'dev_001', name: 'NeuroLab EEG-16', type: 'EEG', serialNumber: 'NL-2026-A001', status: 'ACTIVE', lastSync: '2 min ago' },
            { id: 'dev_002', name: 'NeuroLab Voice Sensor', type: 'VOICE', serialNumber: 'NL-2026-V003', status: 'ACTIVE', lastSync: '5 min ago' },
            { id: 'dev_003', name: 'NeuroLab EEG-16 (Backup)', type: 'EEG', serialNumber: 'NL-2026-A002', status: 'INACTIVE', lastSync: '3 days ago' },
        ]
    });

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">My Devices</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Registered neural interface hardware</p>
                </div>
                <button className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">Register Device</button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-40 animate-pulse rounded-2xl bg-card" />
                    ))
                ) : (
                    data?.map((device: any) => (
                        <div key={device.id} className="rounded-2xl border bg-card p-5 transition-colors hover:bg-secondary/30">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                    <Cpu size={18} className="text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {device.status === 'ACTIVE' ? (
                                        <><Wifi size={14} className="text-emerald-500" /><span className="text-xs text-emerald-500">Online</span></>
                                    ) : (
                                        <><WifiOff size={14} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Offline</span></>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground">{device.name}</h3>
                            <p className="mt-1 text-xs text-muted-foreground">S/N: {device.serialNumber}</p>
                            <div className="mt-3 flex items-center justify-between border-t pt-3">
                                <span className="text-xs text-muted-foreground">Last sync: {device.lastSync}</span>
                                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{device.type}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default function UserDevices() {
    return (
        <PortalErrorBoundary serviceName="Device Registry">
            <DevicesInner />
        </PortalErrorBoundary>
    );
}
