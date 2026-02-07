import { useState, useEffect } from 'react';
import axios from '@/lib/axios/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Review } from '@/types';
import { Star, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Mocking the API call until backend is fully ready or using real endpoint if available
                // const { data } = await axios.get('/reviews');
                // setReviews(data);

                // Mock data for display
                setReviews([
                    {
                        id: '1',
                        analysisId: 'ana-123',
                        rating: 5,
                        comment: "Excellent analysis, really helped me understand my focus patterns.",
                        createdAt: new Date().toISOString(),
                        user: { id: 'u1', username: 'jdoe', fullName: 'John Doe' }
                    },
                    {
                        id: '2',
                        analysisId: 'ana-124',
                        rating: 4,
                        comment: "Good insights but the graph could be clearer.",
                        createdAt: new Date(Date.now() - 86400000).toISOString(),
                        user: { id: 'u2', username: 'asmith', fullName: 'Alice Smith' }
                    }
                ]);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch reviews', error);
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">User Reviews</h1>
                <p className="text-muted-foreground">Feedback and ratings from user analyses.</p>
            </div>

            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <Card key={review.id} className="border-white/10 shadow-premium backdrop-blur-xl bg-card/40 overflow-hidden group hover:bg-card/50 transition-colors">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                            />
                                        ))}
                                    </div>
                                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-xs">
                                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                    </Badge>
                                </div>
                                <CardTitle className="text-base font-semibold mt-2">
                                    {review.user?.fullName || 'Anonymous'}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Analysis ID: {review.analysisId}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground/80 italic">"{review.comment}"</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
