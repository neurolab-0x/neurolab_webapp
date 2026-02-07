import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { verifyEmail } from '@/api/auth';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                return;
            }

            try {
                await verifyEmail(token);
                setStatus('success');
            } catch (error) {
                console.error('Verification failed:', error);
                setStatus('error');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative">
            {/* Ambient Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-subtle" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-subtle" style={{ animationDelay: '1s' }} />

            <div className="container relative z-10 flex items-center justify-center">
                <div className="mx-auto w-full max-w-[400px]">
                    <Card className="border-white/10 shadow-premium overflow-hidden backdrop-blur-xl bg-card/40 text-center">
                        <CardContent className="pt-10 pb-8 flex flex-col items-center space-y-6">

                            {status === 'verifying' && (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                        <Loader2 className="h-16 w-16 text-primary animate-spin" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold">Verifying your email</h2>
                                        <p className="text-muted-foreground">Please wait while we secure your account...</p>
                                    </div>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold">Email Verified!</h2>
                                        <p className="text-muted-foreground">Your email has been successfully verified.</p>
                                    </div>
                                    <Button
                                        className="w-full h-11 font-bold shadow-lg shadow-primary/20"
                                        onClick={() => navigate('/login')}
                                    >
                                        Continue to Login
                                    </Button>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                                        <XCircle className="h-8 w-8 text-destructive" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold">Verification Failed</h2>
                                        <p className="text-muted-foreground">The link may be invalid or expired.</p>
                                    </div>
                                    <div className="space-y-3 w-full">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => navigate('/login')}
                                        >
                                            Back to Login
                                        </Button>
                                        <p className="text-xs text-muted-foreground">
                                            Need help? <Link to="/contact" className="underline hover:text-primary">Contact Support</Link>
                                        </p>
                                    </div>
                                </>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
