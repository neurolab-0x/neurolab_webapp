import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { apiFetcher } from '../lib/fetcher';
import { BrainCircuit, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface UserDecisionSupportData {
    wellnessScore: number;
    stressLevel: number;
    cognitiveLoad: number;
    recommendations: Array<{
        id: string;
        category: string;
        priority: 'high' | 'medium' | 'low';
        text: string;
    }>;
}

const UserDecisionSupportInner = () => {
    const { data, isLoading } = useSWR<UserDecisionSupportData>(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/decision-support`,
        apiFetcher,
        {
            fallbackData: {
                wellnessScore: 78,
                stressLevel: 45,
                cognitiveLoad: 62,
                recommendations: [
                    {
                        id: 'rec-1',
                        category: 'Sleep',
                        priority: 'high',
                        text: 'Your deep sleep architecture shows fragmentation. Consider maintaining a consistent sleep schedule this week.',
                    },
                    {
                        id: 'rec-2',
                        category: 'Stress',
                        priority: 'medium',
                        text: 'Elevated beta wave activity detected during afternoon hours. A 10-minute mindfulness break is recommended.',
                    },
                    {
                        id: 'rec-3',
                        category: 'Focus',
                        priority: 'low',
                        text: 'Alpha wave baseline is stable. Your current cognitive load capacity is optimal for deep work.',
                    }
                ]
            }
        }
    );

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <AlertTriangle size={18} className="text-destructive" />;
            case 'medium': return <Info size={18} className="text-amber-500" />;
            case 'low': return <CheckCircle2 size={18} className="text-emerald-500" />;
            default: return <Info size={18} className="text-muted-foreground" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-destructive/20 bg-destructive/5 text-destructive';
            case 'medium': return 'border-amber-500/20 bg-amber-500/5 text-amber-500';
            case 'low': return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500';
            default: return 'border-surface-border bg-surface text-foreground';
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-display text-foreground">Wellness Insights</h2>
                <p className="mt-1 text-sm text-muted-foreground">AI-driven analysis of your neural data</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <BrainCircuit size={20} className="text-electric-blue" />
                        <h3 className="text-sm font-medium text-muted-foreground">Wellness Score</h3>
                    </div>
                    {isLoading ? (
                        <div className="h-8 w-16 animate-pulse rounded bg-secondary" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tabular-nums text-foreground">{data?.wellnessScore}</span>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <Activity size={20} className="text-purple-500" />
                        <h3 className="text-sm font-medium text-muted-foreground">Stress Level</h3>
                    </div>
                    {isLoading ? (
                        <div className="h-8 w-16 animate-pulse rounded bg-secondary" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tabular-nums text-foreground">{data?.stressLevel}</span>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <Zap size={20} className="text-amber-500" />
                        <h3 className="text-sm font-medium text-muted-foreground">Cognitive Load</h3>
                    </div>
                    {isLoading ? (
                        <div className="h-8 w-16 animate-pulse rounded bg-secondary" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tabular-nums text-foreground">{data?.cognitiveLoad}</span>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl border border-surface-border bg-surface shadow-sm overflow-hidden">
                <div className="border-b border-surface-border bg-sidebar/50 px-6 py-4">
                    <h3 className="text-sm font-medium text-foreground">Personalized Recommendations</h3>
                </div>
                <div className="p-6 space-y-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-secondary" />
                            ))}
                        </div>
                    ) : (
                        data?.recommendations.map(rec => (
                            <div key={rec.id} className={`rounded-xl border p-4 ${getPriorityColor(rec.priority)}`}>
                                <div className="mb-2 flex items-center gap-2">
                                    {getPriorityIcon(rec.priority)}
                                    <span className="text-xs font-bold uppercase tracking-wider">{rec.category}</span>
                                </div>
                                <p className="text-sm text-foreground/90">{rec.text}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Import icons needed above that weren't in the initial destructured list to keep it brief
import { Activity, Zap } from 'lucide-react';

export default function UserDecisionSupport() {
    return (
        <PortalErrorBoundary serviceName="Wellness Insights Engine">
            <UserDecisionSupportInner />
        </PortalErrorBoundary>
    );
}
