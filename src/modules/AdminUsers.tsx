import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Users, Shield, Trash2, MoreHorizontal } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function UsersInner() {
    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, apiFetcher);

    const roleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-destructive/10 text-destructive';
            case 'DOCTOR': return 'bg-primary/10 text-primary';
            default: return 'bg-secondary text-muted-foreground';
        }
    };

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
                    <p className="mt-1 text-sm text-muted-foreground">System-wide user administration</p>
                </div>
                <div className="flex gap-2">
                    <button className="rounded-lg border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary">Import Users</button>
                    <button className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">Create Admin</button>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-secondary/30">
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">Loading users...</td></tr>
                        ) : (
                            data?.map((user: any) => (
                                <tr key={user.id} className="border-b border-border/50 transition-colors hover:bg-secondary/20">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge(user.role)}`}>{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium ${user.status === 'ACTIVE' ? 'text-emerald-500' : 'text-muted-foreground'}`}>{user.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm tabular-nums text-muted-foreground">{user.createdAt}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function AdminUsers() {
    return (
        <PortalErrorBoundary serviceName="User Management Service">
            <UsersInner />
        </PortalErrorBoundary>
    );
}
