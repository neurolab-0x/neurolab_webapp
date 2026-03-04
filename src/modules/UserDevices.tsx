import React, { useState } from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Cpu, Wifi, WifiOff, Plus, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { apiFetcher } from '../lib/fetcher';

function DevicesInner() {
    const { data: serverData, isLoading, mutate } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/devices`, apiFetcher);
    const devices = Array.isArray(serverData) ? serverData : [];

    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serial, setSerial] = useState('');
    const [localDevices, setLocalDevices] = useState<any[]>([]);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serial.trim()) return;

        setIsSubmitting(true);
        // TODO: Replace with real POST /api/devices when backend supports it
        setTimeout(() => {
            const newDevice = {
                _id: `dev_${Date.now()}`,
                name: 'Neurolab Halo Gen-2',
                type: 'BCI',
                serialNumber: serial.toUpperCase(),
                status: 'ACTIVE',
                lastSync: 'Just now'
            };
            setLocalDevices(prev => [newDevice, ...prev]);
            setSerial('');
            setIsSubmitting(false);
            setIsRegistering(false);
            mutate();
        }, 1200);
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">My Devices</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Registered neural interface hardware</p>
                </div>
                {!isRegistering && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsRegistering(true)}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <Plus size={16} /> Register Device
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {isRegistering && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleRegister} className="relative rounded-2xl border bg-card p-6 shadow-sm">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(false)}
                                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Pair New Device</h3>
                                    <p className="text-sm text-muted-foreground">Enter the 12-character serial number stamped on your Neurolab hardware.</p>
                                </div>
                            </div>

                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Serial Number</label>
                                    <input
                                        type="text"
                                        placeholder="NL-XXXX-XXXX"
                                        value={serial}
                                        onChange={e => setSerial(e.target.value)}
                                        className="w-full rounded-xl border border-input/50 bg-background px-4 py-3 font-mono text-sm text-foreground transition-colors focus:border-primary/50 focus:bg-background/80 focus:outline-none"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSubmitting || !serial.trim()}
                                    type="submit"
                                    className="flex h-[46px] min-w-[140px] items-center justify-center rounded-xl bg-foreground px-6 py-2 tracking-wide text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Pair Device'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-40 animate-pulse rounded-2xl bg-card" />
                    ))
                ) : [...localDevices, ...devices].length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 py-16">
                        <Cpu size={40} className="mb-4 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-muted-foreground">No devices registered</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">Click "Register Device" to pair your Neurolab hardware</p>
                    </div>
                ) : (
                    [...localDevices, ...devices].map((device: any) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={device._id || device.id}
                            className="rounded-2xl border bg-card p-5 transition-colors hover:bg-secondary/30"
                        >
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
                            <div className="mt-3 flex items-center justify-between border-t pt-3 border-border/50">
                                <span className="text-xs text-muted-foreground">Last sync: {device.lastSync || '—'}</span>
                                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{device.type}</span>
                            </div>
                        </motion.div>
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
