import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

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
        <div className="flex min-h-screen items-center justify-center bg-[#05050A] relative overflow-hidden selection:bg-[#2E90FA]/30 selection:text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            {/* Surgical Environment Background Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(46, 144, 250, 0.08), transparent 40%), linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '100% 100%, 20px 20px, 20px 20px' }} />

            <div className="w-full max-w-[420px] rounded-[24px] bg-[#0C0C14]/80 backdrop-blur-[12px] border-[0.5px] border-[#1E293B] p-8 shadow-2xl relative z-10 mx-6 hover:border-[#1E293B]/80 transition-colors">
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="mb-6 flex flex-col items-center">
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-slate-50 tracking-tight">NeurAI</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E90FA] ml-0.5" />
                        </div>
                        <div className="w-[30%] h-[1px] bg-[#2E90FA] mt-1 opacity-80" />
                    </div>
                    <h1 className="text-xl font-semibold text-slate-100" style={{ letterSpacing: '-0.02em' }}>Forgot Password</h1>
                    <p className="mt-2 text-[13px] text-slate-400">Enter your email to receive a reset link</p>
                </div>

                {success ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center text-sm text-emerald-500">
                        <CheckCircle2 size={32} className="mx-auto mb-4" />
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
                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-[40px] rounded-lg border border-transparent bg-[#05050A] pl-10 pr-4 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#1E293B] shadow-inner placeholder:text-slate-600 tabular-nums"
                                    placeholder="doctor@neurolab.cc"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full h-[44px] relative flex items-center justify-center overflow-hidden rounded-lg bg-[#2E90FA] text-white text-[13px] font-bold transition-all hover:bg-[#54A5FF] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
                        >
                            {loading ? 'Sending link...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link to="/auth/login" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                        <ArrowLeft size={14} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};
