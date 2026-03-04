import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { BrainCircuit, AlertTriangle, CheckCircle } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function DecisionInner() {
    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/decision-support/mock`, apiFetcher);

    const priorityStyle = (p: string) => {
        if (p === 'HIGH') return 'border-l-destructive bg-destructive/5';
        if (p === 'MEDIUM') return 'border-l-amber-500 bg-amber-500/5';
        return 'border-l-emerald-500 bg-emerald-500/5';
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div><h1 className="text-2xl font-bold tracking-tight text-foreground">Decision Support</h1><p className="mt-1 text-sm text-muted-foreground">AI-powered clinical recommendations for {data?.patientName}</p></div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Object.entries(data?.metrics || {}).map(([key, val]) => (
                    <div key={key} className="rounded-2xl border bg-card p-4 text-center">
                        <p className="text-2xl font-bold tabular-nums text-foreground">{val as number}</p>
                        <p className="mt-1 text-xs capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BrainCircuit size={18} className="text-primary" />
                        <h2 className="text-sm font-semibold text-foreground">AI Recommendations</h2>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs tabular-nums text-muted-foreground">
                        Confidence: <span className="font-semibold text-foreground">{data?.confidence}%</span>
                    </div>
                </div>
                <div className="space-y-3">
                    {data?.recommendations?.map((r: any) => (
                        <div key={r.id} className={`rounded-xl border-l-2 p-4 ${priorityStyle(r.priority)}`}>
                            <div className="mb-1 flex items-center gap-2">
                                {r.priority === 'HIGH' ? <AlertTriangle size={14} className="text-destructive" /> : <CheckCircle size={14} className="text-emerald-500" />}
                                <span className="text-[10px] font-semibold uppercase text-muted-foreground">{r.priority} Priority</span>
                            </div>
                            <p className="text-sm text-foreground">{r.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function DoctorDecision() {
    return <PortalErrorBoundary serviceName="Decision Support Engine"><DecisionInner /></PortalErrorBoundary>;
}
