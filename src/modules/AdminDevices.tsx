import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Cpu, Wifi, WifiOff, Plus, X, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { apiFetcher, apiPost } from '../lib/fetcher';

const BASE = import.meta.env.VITE_API_BASE_URL;

type DeviceStatus = 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE' | string;

interface Device {
    id?: string;
    _id?: string;
    name: string;
    status: DeviceStatus;
    serialNumber: string;
    assignedTo?: string;
    clinic?: string;
}

const isApiError = (error: unknown): error is Error => error instanceof Error;

function AdminDevicesInner() {
    const queryClient = useQueryClient();
    const { data, isPending: isLoading } = useQuery<Device[]>({
        queryKey: ['devices'],
        queryFn: async () => apiFetcher(`${BASE}/api/devices`) as Promise<Device[]>,
    });
    const mutate = () => queryClient.invalidateQueries({ queryKey: ['devices'] });

    const [showForm, setShowForm] = useState(false);
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formError, setFormError] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('EEG');
    const [serialNumber, setSerialNumber] = useState('');

    const resetForm = () => {
        setName('');
        setType('EEG');
        setSerialNumber('');
        setFormState('idle');
        setFormError('');
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !serialNumber.trim()) {
            setFormError('Device name and serial number are required.');
            return;
        }

        setFormState('submitting');
        setFormError('');

        try {
            await apiPost(`${BASE}/api/devices`, { name: name.trim(), type, serialNumber: serialNumber.trim() });
            setFormState('success');
            mutate(); // Refresh device list from backend
            setTimeout(() => {
                setShowForm(false);
                resetForm();
            }, 1200);
        } catch (err: unknown) {
            setFormState('error');
            const errorMessage = isApiError(err) ? err.message : '';
            setFormError(errorMessage === '409' ? 'A device with this serial number already exists.' : 'Failed to register device. Please try again.');
        }
    };

    const statusBadge = (s: string) => {
        if (s === 'ACTIVE') return <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500"><Wifi size={10} /> Online</span>;
        if (s === 'MAINTENANCE') return <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-500"><Cpu size={10} /> Maintenance</span>;
        return <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground"><WifiOff size={10} /> Offline</span>;
    };

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Device Fleet</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Global neural interface hardware registry</p>
                </div>
                <button
                    onClick={() => { setShowForm(v => !v); if (showForm) resetForm(); }}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors ${showForm
                        ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                >
                    {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Register Device</>}
                </button>
            </div>

            {/* Register Device Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleRegister} className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-foreground mb-4">Register New Device</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Device Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. NL-EEG-005"
                                        disabled={formState === 'submitting' || formState === 'success'}
                                        className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Type</label>
                                    <select
                                        value={type}
                                        onChange={e => setType(e.target.value)}
                                        disabled={formState === 'submitting' || formState === 'success'}
                                        className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                    >
                                        <option value="EEG">EEG</option>
                                        <option value="VOICE">VOICE</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Serial Number</label>
                                    <input
                                        type="text"
                                        value={serialNumber}
                                        onChange={e => setSerialNumber(e.target.value)}
                                        placeholder="e.g. NL-2026-A005"
                                        disabled={formState === 'submitting' || formState === 'success'}
                                        className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {formError && (
                                <p className="mt-3 text-xs text-red-500 font-medium">{formError}</p>
                            )}

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={formState === 'submitting' || formState === 'success'}
                                    className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold transition-all ${formState === 'success'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                                        }`}
                                >
                                    {formState === 'submitting' && <Loader2 size={14} className="animate-spin" />}
                                    {formState === 'success' && <Check size={14} />}
                                    {formState === 'success' ? 'Device Registered' : formState === 'submitting' ? 'Registering...' : 'Register Device'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Device Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-card" />) : data?.map((d) => (
                    <div key={d.id || d._id} className="rounded-2xl border bg-card p-5 transition-colors hover:border-primary/30">
                        <div className="mb-3 flex items-center justify-between">
                            <Cpu size={18} className="text-muted-foreground" />
                            {statusBadge(d.status)}
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
