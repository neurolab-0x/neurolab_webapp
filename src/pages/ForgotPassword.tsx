import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.message || 'Failed to request password reset. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <BrainCircuit size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot Password</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Enter your email to receive a reset link</p>
                </div>

                {success ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center text-sm text-emerald-500">
                        <CheckCircle2 size={32} className="mx-auto mb-4" />
                        <p>We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.</p>
                        <Link to="/auth/login" className="mt-6 inline-block font-medium hover:underline">Return to Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border bg-card py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="doctor@neurolab.cc"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            {loading ? 'Sending link...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <div className="text-center">
                    <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={16} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
