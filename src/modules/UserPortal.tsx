import React, { useState } from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Bluetooth, Loader2 } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

interface EegMetric {
    channel_id: string;
    frequency_hz: number;
    amplitude_uv: number;
    snr_db: number;
}

const UserSessionInner = () => {
    const { data: eegData, isLoading } = useSWR<EegMetric[]>(`${import.meta.env.VITE_API_BASE_URL}/api/analysis/user`, apiFetcher);

    const [isStreaming, setIsStreaming] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = () => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnecting(false);
            setIsStreaming(true);
        }, 2000);
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-display text-foreground">Neural Session Dashboard</h2>
                    <p className="mt-1 text-sm text-muted-foreground">High-density personal telemetry</p>
                </div>
                {isStreaming && (
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                        <div className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        </div>
                        Live Stream
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!isStreaming ? (
                    <motion.div
                        key="disconnected"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface shadow-sm"
                    >
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Bluetooth size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Device Not Connected</h3>
                        <p className="mb-8 mt-2 max-w-md text-center text-sm text-muted-foreground">
                            Connect your Neurolab headset to initiate the live neural session and view high-fidelity telemetry streaming in real-time.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="flex h-11 min-w-[160px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isConnecting ? (
                                <><Loader2 size={16} className="animate-spin" /> Connecting...</>
                            ) : (
                                <><Activity size={16} /> Connect Device</>
                            )}
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="streaming"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-2xl bg-surface shadow-sm border border-surface-border"
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>
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
