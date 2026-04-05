import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Users, UserCheck, UserX, Search, Plus, X, Loader2, Check, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { apiFetcher, apiPost } from '../lib/fetcher';

const BASE = import.meta.env.VITE_API_BASE_URL;

function PatientsInner() {
    const queryClient = useQueryClient();
    const { data: rawData, isPending: isLoading } = useQuery({
        queryKey: ['doctor-patients'],
        queryFn: () => apiFetcher(`${BASE}/api/doctors/patients`),
    });
    const mutate = () => queryClient.invalidateQueries({ queryKey: ['doctor-patients'] });

    // Normalise to array regardless of whether the API returns a bare array
    // or a wrapped object like { patients: [...] } / { data: [...] }
    const data: any[] = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.patients)
            ? rawData.patients
            : Array.isArray(rawData?.data)
                ? rawData.data
                : [];

    // Assign Patient panel state
    const [showAssign, setShowAssign] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [assignState, setAssignState] = useState<'idle' | 'assigning' | 'success' | 'error'>('idle');
    const [assignError, setAssignError] = useState('');

    // Invite state (when patient is not found)
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteState, setInviteState] = useState<'idle' | 'sending' | 'sent'>('idle');

    const resetAssign = () => {
        setSearchQuery('');
        setAssignState('idle');
        setAssignError('');
        setInviteEmail('');
        setInviteState('idle');
    };

    const allUsersFetcher = async (): Promise<any[]> => {
        const res = await fetch(`${BASE}/api/admin/users`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('neurolab_token') || ''}`,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) return []; // silently return empty on 403 or any error
        const json = await res.json();
        if (Array.isArray(json)) return json;
        if (json?.users && Array.isArray(json.users)) return json.users;
        return [];
    };

    const { data: allUsers, isPending: isSearchLoading } = useQuery({
        queryKey: ['admin-users-search'],
        queryFn: allUsersFetcher,
        enabled: showAssign,
    });

    // Search results — client-side filter from all users, with fallback to assigned patients
    const searchResults = useMemo(() => {
        if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];

        const q = searchQuery.toLowerCase();
        const assignedIds = new Set((data || []).map((p: any) => p.id || p._id));

        // If we got users from the admin endpoint, search across all of them
        const userPool = Array.isArray(allUsers) && allUsers.length > 0
            ? allUsers
            : (data || []); // fall back to assigned patients

        return userPool.filter((u: any) => {
            const id = u.id || u._id;
            if (assignedIds.has(id)) return false; // skip already assigned
            const name = (u.fullName || u.name || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            return name.includes(q) || email.includes(q);
        });
    }, [searchQuery, allUsers, data]);

    const showInvite = searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearchLoading;

    const handleAssign = async (patientId: string) => {
        setAssignState('assigning');
        setAssignError('');

        try {
            await apiPost(`${BASE}/api/doctors/patients/assign`, { patientId });
            setAssignState('success');
            mutate();
            setTimeout(() => {
                setShowAssign(false);
                resetAssign();
            }, 1200);
        } catch (err: any) {
            setAssignState('error');
            setAssignError(err.message === '409' ? 'Patient is already assigned to you.' : 'Failed to assign patient. Please try again.');
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail.trim() || !inviteEmail.includes('@')) return;
        setInviteState('sending');
        setAssignError('');
        try {
            await apiPost(`${BASE}/api/doctors/patient/invite`, { email: inviteEmail });
            setInviteState('sent');
            setTimeout(() => {
                setShowAssign(false);
                resetAssign();
            }, 1500);
        } catch (err: any) {
            setInviteState('idle');
            setAssignError(err.message || 'Failed to send invitation. Please try again.');
        }
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6 md:mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">My Patients</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Patient roster and monitoring</p>
                </div>
                <button
                    onClick={() => { setShowAssign(v => !v); if (showAssign) resetAssign(); }}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors ${showAssign
                        ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                >
                    {showAssign ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Assign Patient</>}
                </button>
            </div>

            {/* Assign Patient Panel */}
            <AnimatePresence>
                {showAssign && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-foreground mb-4">Assign New Patient</h3>

                            {/* Search Field */}
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => { setSearchQuery(e.target.value); setAssignState('idle'); setAssignError(''); }}
                                    placeholder="Search patient by name..."
                                    autoFocus
                                    disabled={assignState === 'assigning' || assignState === 'success'}
                                    className="w-full rounded-lg border border-surface-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>

                            {/* Search Results */}
                            <AnimatePresence>
                                {isSearchLoading && searchQuery.trim().length >= 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        className="mt-3 py-4 flex justify-center rounded-lg border border-surface-border bg-background"
                                    >
                                        <Loader2 size={24} className="animate-spin text-primary" />
                                    </motion.div>
                                )}
                                {!isSearchLoading && searchResults.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        className="mt-3 space-y-1 max-h-48 overflow-y-auto rounded-lg border border-surface-border bg-background"
                                    >
                                        {searchResults.map((p: any) => (
                                            <button
                                                key={p.id || p._id}
                                                onClick={() => handleAssign(p.id || p._id)}
                                                disabled={assignState === 'assigning' || assignState === 'success'}
                                                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface-border/30 transition-colors disabled:opacity-50 border-b border-surface-border/50 last:border-0"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{p.fullName || p.name}</p>
                                                    <p className="text-xs text-muted-foreground">{p.email || 'No email'} {p.role ? `• ${p.role}` : ''}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {assignState === 'assigning' && <Loader2 size={14} className="animate-spin text-primary" />}
                                                    {assignState === 'success' && <Check size={14} className="text-emerald-500" />}
                                                    {assignState === 'idle' && (
                                                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Assign</span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Invite via Email (shown when no patients match) */}
                            <AnimatePresence>
                                {showInvite && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        className="mt-4 rounded-xl border border-dashed border-surface-border bg-background p-4"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <Mail size={14} className="text-muted-foreground" />
                                            <p className="text-xs text-muted-foreground">
                                                No patient found for <span className="font-semibold text-foreground">"{searchQuery}"</span>. Send an invitation via email:
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                value={inviteEmail}
                                                onChange={e => setInviteEmail(e.target.value)}
                                                placeholder="patient@example.com"
                                                disabled={inviteState !== 'idle'}
                                                className="flex-1 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                            />
                                            <button
                                                onClick={handleInvite}
                                                disabled={inviteState !== 'idle' || !inviteEmail.includes('@')}
                                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${inviteState === 'sent'
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                                                    }`}
                                            >
                                                {inviteState === 'sending' && <Loader2 size={14} className="animate-spin" />}
                                                {inviteState === 'sent' && <Check size={14} />}
                                                {inviteState === 'sent' ? 'Invitation Sent' : inviteState === 'sending' ? 'Sending...' : 'Send Invite'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {assignError && (
                                <p className="mt-3 text-xs text-red-500 font-medium">{assignError}</p>
                            )}

                            {assignState === 'success' && (
                                <p className="mt-3 text-xs text-emerald-500 font-medium flex items-center gap-1"><Check size={12} /> Patient successfully assigned.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Patient Table */}
            <div className="overflow-hidden rounded-2xl border bg-card">
                <div className="table-scroll-mobile">
                    <table className="w-full">
                        <thead><tr className="border-b bg-secondary/30">
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">Patient</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">Condition</th>
                            <th className="px-4 md:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">SNR Avg</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">Last Session</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">Status</th>
                        </tr></thead>
                        <tbody>
                            {isLoading ? <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">Loading...</td></tr> : data.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">No patients assigned yet.</td></tr> : data.map((p: any) => (
                                <tr key={p.id || p._id} className="border-b border-border/50 hover:bg-secondary/20">
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap"><p className="text-sm font-medium text-foreground">{p.fullName || p.name}</p><p className="text-xs text-muted-foreground">Age {p.age || '—'}</p></td>
                                    <td className="px-4 md:px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{p.condition || '—'}</td>
                                    <td className="px-4 md:px-6 py-4 text-right text-sm font-semibold tabular-nums text-foreground whitespace-nowrap">{p.snr_avg ? `${p.snr_avg} dB` : '—'}</td>
                                    <td className="px-4 md:px-6 py-4 text-sm tabular-nums text-muted-foreground whitespace-nowrap">{p.lastSession || '—'}</td>
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
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
        </div>
    );
}

export default function DoctorPatients() {
    return <PortalErrorBoundary serviceName="Patient Registry"><PatientsInner /></PortalErrorBoundary>;
}
