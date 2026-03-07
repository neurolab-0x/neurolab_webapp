import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { apiFetcher } from '../lib/fetcher';
import { BrainCircuit, AlertTriangle, CheckCircle2, Info, Activity, Zap, FileText } from 'lucide-react';

interface DecisionSupportData {
    summary?: string;
    patterns?: Array<{ id?: string; type?: string; description?: string; severity?: string }>;
    risks?: Array<{ id?: string; type?: string; description?: string; level?: string }>;
    wellnessScore?: number;
    stressLevel?: number;
    cognitiveLoad?: number;
    recommendations?: Array<{ id: string; category: string; priority: string; text: string }>;
}

const UserDecisionSupportInner = () => {
    const { data, isPending: isLoading } = useQuery<DecisionSupportData>({
        queryKey: ['user-decision-support'],
        queryFn: () => apiFetcher(`${import.meta.env.VITE_API_BASE_URL}/api/users/decision-support`),
    });

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': case 'HIGH': return <AlertTriangle size={18} className="text-destructive" />;
            case 'medium': case 'MEDIUM': return <Info size={18} className="text-amber-500" />;
            case 'low': case 'LOW': return <CheckCircle2 size={18} className="text-emerald-500" />;
            default: return <Info size={18} className="text-muted-foreground" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': case 'HIGH': return 'border-destructive/20 bg-destructive/5 text-destructive';
            case 'medium': case 'MEDIUM': return 'border-amber-500/20 bg-amber-500/5 text-amber-500';
            case 'low': case 'LOW': return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500';
            default: return 'border-surface-border bg-surface text-foreground';
        }
    };

    const hasMetrics = data?.wellnessScore != null || data?.stressLevel != null || data?.cognitiveLoad != null;
    const hasPatterns = data?.patterns && data.patterns.length > 0;
    const hasRisks = data?.risks && data.risks.length > 0;
    const hasRecommendations = data?.recommendations && data.recommendations.length > 0;
    const isEmpty = !isLoading && !hasMetrics && !hasPatterns && !hasRisks && !hasRecommendations;

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-display text-foreground">Wellness Insights</h2>
                <p className="mt-1 text-sm text-muted-foreground">AI-driven analysis of your neural data</p>
            </div>

            {/* Summary */}
            {data?.summary && (
                <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <BrainCircuit size={20} className="text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Analysis Summary</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{data.summary}</p>
                </div>
            )}

            {/* Metrics (if the backend returns them) */}
            {hasMetrics && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {data?.wellnessScore != null && (
                        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <BrainCircuit size={20} className="text-electric-blue" />
                                <h3 className="text-sm font-medium text-muted-foreground">Wellness Score</h3>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold tabular-nums text-foreground">{data.wellnessScore}</span>
                                <span className="text-sm text-muted-foreground">/ 100</span>
                            </div>
                        </div>
                    )}
                    {data?.stressLevel != null && (
                        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <Activity size={20} className="text-purple-500" />
                                <h3 className="text-sm font-medium text-muted-foreground">Stress Level</h3>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold tabular-nums text-foreground">{data.stressLevel}</span>
                                <span className="text-sm text-muted-foreground">/ 100</span>
                            </div>
                        </div>
                    )}
                    {data?.cognitiveLoad != null && (
                        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <Zap size={20} className="text-amber-500" />
                                <h3 className="text-sm font-medium text-muted-foreground">Cognitive Load</h3>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold tabular-nums text-foreground">{data.cognitiveLoad}</span>
                                <span className="text-sm text-muted-foreground">/ 100</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 animate-pulse rounded-2xl bg-secondary/50" />
                    ))}
                </div>
            )}

            {/* Patterns */}
            {hasPatterns && (
                <div className="rounded-2xl border border-surface-border bg-surface shadow-sm overflow-hidden">
                    <div className="border-b border-surface-border bg-sidebar/50 px-6 py-4">
                        <h3 className="text-sm font-medium text-foreground">Detected Patterns</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {data!.patterns!.map((p, i) => (
                            <div key={p.id || i} className={`rounded-xl border p-4 ${getPriorityColor(p.severity || 'low')}`}>
                                <div className="mb-2 flex items-center gap-2">
                                    {getPriorityIcon(p.severity || 'low')}
                                    <span className="text-xs font-bold uppercase tracking-wider">{p.type || 'Pattern'}</span>
                                </div>
                                <p className="text-sm text-foreground/90">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Risks */}
            {hasRisks && (
                <div className="rounded-2xl border border-surface-border bg-surface shadow-sm overflow-hidden">
                    <div className="border-b border-surface-border bg-sidebar/50 px-6 py-4">
                        <h3 className="text-sm font-medium text-foreground">Risk Assessment</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {data!.risks!.map((r, i) => (
                            <div key={r.id || i} className={`rounded-xl border p-4 ${getPriorityColor(r.level || 'medium')}`}>
                                <div className="mb-2 flex items-center gap-2">
                                    {getPriorityIcon(r.level || 'medium')}
                                    <span className="text-xs font-bold uppercase tracking-wider">{r.type || 'Risk'}</span>
                                </div>
                                <p className="text-sm text-foreground/90">{r.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations (alternate backend shape) */}
            {hasRecommendations && (
                <div className="rounded-2xl border border-surface-border bg-surface shadow-sm overflow-hidden">
                    <div className="border-b border-surface-border bg-sidebar/50 px-6 py-4">
                        <h3 className="text-sm font-medium text-foreground">Personalized Recommendations</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {data!.recommendations!.map(rec => (
                            <div key={rec.id} className={`rounded-xl border p-4 ${getPriorityColor(rec.priority)}`}>
                                <div className="mb-2 flex items-center gap-2">
                                    {getPriorityIcon(rec.priority)}
                                    <span className="text-xs font-bold uppercase tracking-wider">{rec.category}</span>
                                </div>
                                <p className="text-sm text-foreground/90">{rec.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {isEmpty && (
                <div className="rounded-2xl border border-surface-border bg-surface p-12 text-center shadow-sm">
                    <FileText size={40} className="mx-auto mb-4 text-muted-foreground/40" />
                    <h3 className="text-lg font-semibold text-foreground">No Insights Available Yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                        Complete a neural analysis session to receive personalized wellness insights and AI-driven recommendations.
                    </p>
                </div>
            )}
        </div>
    );
};

export default function UserDecisionSupport() {
    return (
        <PortalErrorBoundary serviceName="Wellness Insights Engine">
            <UserDecisionSupportInner />
        </PortalErrorBoundary>
    );
}
