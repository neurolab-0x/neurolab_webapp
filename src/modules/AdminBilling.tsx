import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { CreditCard, Receipt, TrendingUp } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function BillingInner() {
    const { data: tariffs, isPending: loadingTariffs } = useQuery({
        queryKey: ['billing-tariffs'],
        queryFn: () => apiFetcher(`${import.meta.env.VITE_API_BASE_URL}/api/billing/tariffs`),
    });

    const { data: analytics, isPending: loadingAnalytics } = useQuery({
        queryKey: ['billing-analytics'],
        queryFn: () => apiFetcher(`${import.meta.env.VITE_API_BASE_URL}/api/billing/analytics`),
    });

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <div><h1 className="text-2xl font-bold tracking-tight text-foreground">Billing & Tariffs</h1><p className="mt-1 text-sm text-muted-foreground">Revenue analytics and service pricing</p></div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border bg-card p-6">
                    <TrendingUp size={20} className="mb-3 text-emerald-500" />
                    <p className="text-3xl font-bold tabular-nums text-foreground">{((analytics?.totalRevenue || analytics?.projectedAnnual || 0) / 100).toLocaleString()} <span className="text-sm text-muted-foreground">RWF</span></p>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
                <div className="rounded-2xl border bg-card p-6">
                    <Receipt size={20} className="mb-3 text-primary" />
                    <p className="text-3xl font-bold tabular-nums text-foreground">{analytics?.totalInvoices ?? analytics?.historical?.length ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Total Invoices</p>
                </div>
                <div className="rounded-2xl border bg-card p-6">
                    <CreditCard size={20} className="mb-3 text-muted-foreground" />
                    <p className="text-3xl font-bold tabular-nums text-foreground">{(analytics?.avgAmount || analytics?.target || 0).toLocaleString()} <span className="text-sm text-muted-foreground">RWF</span></p>
                    <p className="text-xs text-muted-foreground">{analytics?.target ? 'Revenue Target' : 'Avg per Invoice'}</p>
                </div>
            </div>

            <div>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Service Tariffs</h2>
                <div className="overflow-hidden rounded-2xl border bg-card">
                    <table className="w-full">
                        <thead><tr className="border-b bg-secondary/30">
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Code</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Base Price</th>
                        </tr></thead>
                        <tbody>
                            {tariffs?.map((t: any) => (
                                <tr key={t._id || t.id} className="border-b border-border/50 hover:bg-secondary/20">
                                    <td className="px-6 py-4 text-sm font-medium text-foreground">{t.serviceName}</td>
                                    <td className="px-6 py-4 text-sm tabular-nums text-muted-foreground">{t.code}</td>
                                    <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-foreground">{t.basePrice?.toLocaleString()} RWF</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function AdminBilling() {
    return <PortalErrorBoundary serviceName="Billing Engine"><BillingInner /></PortalErrorBoundary>;
}
