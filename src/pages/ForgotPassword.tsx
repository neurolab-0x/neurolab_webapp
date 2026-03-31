import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';

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
        <AuthLayout>
            <div className="flex flex-col">
                {/* Brand header */}
                <div className="mb-10">
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-slate-50 tracking-tight">Neurolab</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E90FA] ml-1" />
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Forgot Password</h1>
                    <p className="mt-2 text-sm text-slate-400">Enter your email to receive a reset link</p>
                </div>

                {success ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-sm text-emerald-500">
                        <CheckCircle2 size={32} className="mb-4" />
                        <p>We've sent a password reset link to <strong className="text-slate-200">{email}</strong>. Please check your inbox.</p>
                        <Link to="/auth/login" className="mt-6 inline-block font-medium hover:text-emerald-400 transition-colors">Return to Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
                                {error}
                            </div>
                        )}
                        <div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-[48px] rounded-lg border border-[#1E293B] bg-[#05050A] pl-11 pr-4 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#2E90FA]/50 placeholder:text-slate-600 tabular-nums"
                                    placeholder="Email address"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full h-[48px] relative flex items-center justify-center rounded-lg bg-white text-[#05050A] text-[14px] font-semibold transition-all hover:bg-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending link...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <div className="mt-8">
                    <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
                        <ArrowLeft size={16} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};
