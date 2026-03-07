import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Star } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function ReviewsInner() {
    const { data, isPending: isLoading, error } = useQuery({
        queryKey: ['user-reviews'],
        queryFn: () => apiFetcher(`${import.meta.env.VITE_API_BASE_URL}/api/reviews`),
    });

    const reviews = Array.isArray(data) ? data : [];

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
                ) : error || reviews.length === 0 ? (
                    <div className="rounded-xl border bg-card p-12 text-center">
                        <Star size={36} className="mx-auto mb-3 text-muted-foreground/40" />
                        <h3 className="text-base font-semibold text-foreground">{error ? 'Unable to Load Reviews' : 'No Reviews Yet'}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {error ? 'This feature may not be available for your account type.' : 'Complete an analysis session and leave a review here.'}
                        </p>
                    </div>
                ) : (
                    reviews.map((review: any) => (
                        <div key={review.id || review._id} className="rounded-xl border bg-card p-5 transition-colors hover:bg-secondary/30">
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
