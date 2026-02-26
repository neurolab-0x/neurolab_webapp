import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-email/${token}`);
                if (res.ok) {
                    setStatus('success');
                } else {
                    const data = await res.json().catch(() => ({}));
                    setMessage(data.message || 'Verification failed or token expired.');
                    setStatus('error');
                }
            } catch (err) {
                setMessage('Network error while verifying email.');
                setStatus('error');
            }
        };

        if (token) {
            verifyToken();
        } else {
            setStatus('error');
            setMessage('Invalid verification link.');
        }
    }, [token]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary shadow-lg">
                    <BrainCircuit size={32} className="text-primary" />
                </div>

                {status === 'verifying' && (
                    <div className="space-y-4">
                        <Loader2 size={32} className="mx-auto animate-spin text-primary" />
                        <h1 className="text-xl font-bold tracking-tight text-foreground">Verifying Email...</h1>
                        <p className="text-sm text-muted-foreground">Please wait while we confirm your identity.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
                        <h1 className="text-xl font-bold tracking-tight text-foreground">Email Verified!</h1>
                        <p className="text-sm text-muted-foreground">Your account has been fully activated. You can now log into the platform.</p>
                        <Link to="/auth/login" className="mt-8 inline-block w-full rounded-lg bg-primary py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                            Go to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <XCircle size={48} className="mx-auto text-destructive" />
                        <h1 className="text-xl font-bold tracking-tight text-foreground">Verification Failed</h1>
                        <p className="text-sm text-muted-foreground">{message}</p>
                        <Link to="/auth/login" className="mt-8 inline-block w-full rounded-lg border border-input bg-background py-2.5 font-medium text-foreground transition-colors hover:bg-secondary">
                            Return to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
