import React, { useState } from 'react';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import useSWR from 'swr';
import { User, Lock, Trash2 } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function SettingsInner() {
    const { data: user } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, apiFetcher, {
        fallbackData: { fullName: 'Dr. Sarah Chen', email: 'sarah@neurolab.cc', username: 'sarahchen', role: 'DOCTOR' }
    });

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>

            {/* Profile Section */}
            <div className="rounded-2xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                    <User size={18} className="text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">Profile</h2>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                        <input type="email" value={user?.email || ''} disabled className="w-full rounded-lg border bg-secondary px-3 py-2.5 text-sm text-muted-foreground" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Role</label>
                        <div className="rounded-lg border bg-secondary px-3 py-2.5 text-sm tabular-nums text-muted-foreground">{user?.role}</div>
                    </div>
                    <button className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">Save Changes</button>
                </div>
            </div>

            {/* Password Section */}
            <div className="rounded-2xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                    <Lock size={18} className="text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">Change Password</h2>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Current Password</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <button className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">Update Password</button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-destructive/20 bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                    <Trash2 size={18} className="text-destructive" />
                    <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">Permanently delete your account and all associated neural data.</p>
                <button className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/20">Delete Account</button>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <PortalErrorBoundary serviceName="Account Service">
            <SettingsInner />
        </PortalErrorBoundary>
    );
}
