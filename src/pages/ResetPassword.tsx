import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';

export default function ResetPassword() {
    const { token } = useParams<{ token: string }>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.message || 'Failed to reset password. The link may have expired.');
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
                {/* Neurolab Logo Component */}
                <div className="mb-10">
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-slate-50 tracking-tight">Neurolab</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E90FA] ml-1" />
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Reset Password</h1>
                    <p className="mt-2 text-sm text-slate-400">Enter your new secure password</p>
                </div>

                {success ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-sm text-emerald-500">
                        <CheckCircle2 size={32} className="mb-4" />
                        <p>Your password has been successfully reset. You can now log in with your new credentials.</p>
                        <Link to="/auth/login" className="mt-6 inline-block font-medium hover:text-emerald-400 transition-colors">Go to Login</Link>
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
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-[48px] rounded-lg border border-[#1E293B] bg-[#05050A] pl-11 pr-10 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#2E90FA]/50 placeholder:text-slate-600 tabular-nums"
                                    placeholder="New Password"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-[48px] rounded-lg border border-[#1E293B] bg-[#05050A] pl-11 pr-10 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#2E90FA]/50 placeholder:text-slate-600 tabular-nums"
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full h-[48px] relative flex items-center justify-center rounded-lg bg-[#2E90FA] text-white text-[14px] font-semibold transition-all hover:bg-[#54A5FF] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};
