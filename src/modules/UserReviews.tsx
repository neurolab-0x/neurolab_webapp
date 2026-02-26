import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Star } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function ReviewsInner() {
    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/reviews`, apiFetcher, {
        fallbackData: [
            { id: 'rev_001', analysisType: 'EEG Analysis', rating: 5, comment: 'Extremely accurate baseline reading.', date: '2026-02-25' },
            { id: 'rev_002', analysisType: 'Voice Analysis', rating: 4, comment: 'Good stress detection, minor noise in results.', date: '2026-02-22' },
            { id: 'rev_003', analysisType: 'EEG Analysis', rating: 5, comment: 'Perfect signal quality throughout the session.', date: '2026-02-18' },
        ]
    });

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Analysis Reviews</h1>
                <p className="mt-1 text-sm text-muted-foreground">Rate and review your completed analyses</p>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-xl bg-card" />
                    ))
                ) : (
                    data?.map((review: any) => (
                        <div key={review.id} className="rounded-xl border bg-card p-5 transition-colors hover:bg-secondary/30">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-semibold text-foreground">{review.analysisType}</span>
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={14} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                            <p className="mt-2 text-xs text-muted-foreground/60">{review.date}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default function UserReviews() {
    return (
        <PortalErrorBoundary serviceName="Review Service">
            <ReviewsInner />
        </PortalErrorBoundary>
    );
}
