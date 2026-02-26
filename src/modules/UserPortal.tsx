import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';

import { apiFetcher } from '../lib/fetcher';

interface EegMetric {
    channel_id: string;
    frequency_hz: number;
    amplitude_uv: number;
    snr_db: number;
}

const UserSessionInner = () => {
    const { data: eegData, isLoading } = useSWR<EegMetric[]>(`${import.meta.env.VITE_API_BASE_URL}/api/analysis/user`, apiFetcher, {
        fallbackData: [
            { channel_id: 'Fp1', frequency_hz: 10.24, amplitude_uv: 42.8, snr_db: 18.3 },
            { channel_id: 'Fp2', frequency_hz: 10.18, amplitude_uv: 41.2, snr_db: 17.9 },
            { channel_id: 'C3', frequency_hz: 12.50, amplitude_uv: 38.6, snr_db: 21.4 },
            { channel_id: 'C4', frequency_hz: 12.44, amplitude_uv: 39.1, snr_db: 20.8 },
            { channel_id: 'O1', frequency_hz: 9.76, amplitude_uv: 55.3, snr_db: 24.6 },
            { channel_id: 'O2', frequency_hz: 9.82, amplitude_uv: 54.7, snr_db: 23.9 },
        ]
    });

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-display text-foreground">Neural Session Dashboard</h2>
                    <p className="mt-1 text-sm text-muted-foreground">High-density personal telemetry</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <div className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>
                    Live Stream
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-surface shadow-sm border border-surface-border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-surface-border bg-sidebar/50">
                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Channel</th>
                            <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Freq (Hz)</th>
                            <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Amp (µV)</th>
                            <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">SNR (dB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-sm text-muted-foreground">
                                    Synchronizing session...
                                </td>
                            </tr>
                        ) : (
                            eegData?.map((row, i) => (
                                <tr
                                    key={row.channel_id}
                                    className="transition-colors duration-300 hover:bg-secondary"
                                    style={{
                                        borderBottom: i < eegData.length - 1 ? '0.5px solid hsl(var(--surface-border))' : 'none',
                                    }}
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-foreground">{row.channel_id}</td>
                                    <td className="px-6 py-4 text-right text-sm tabular-nums text-muted-foreground">{row.frequency_hz.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right text-sm tabular-nums text-muted-foreground">{row.amplitude_uv.toFixed(1)}</td>
                                    <td className="px-6 py-4 text-right text-sm tabular-nums text-muted-foreground">{row.snr_db.toFixed(1)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function UserPortal() {
    return (
        <PortalErrorBoundary serviceName="Neural Telemetry Pipeline">
            <UserSessionInner />
        </PortalErrorBoundary>
    );
}
