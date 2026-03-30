import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';

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
        <AuthLayout>
            <div className="flex flex-col text-center mt-12">
                <div className="mb-12 flex flex-col items-center">
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-slate-50 tracking-tight">Neurolab</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E90FA] ml-1" />
                    </div>
                </div>

                {status === 'verifying' && (
                    <div className="space-y-4">
                        <Loader2 size={32} className="mx-auto animate-spin text-[#2E90FA]" />
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Verifying Email...</h1>
                        <p className="text-sm text-slate-400">Please wait while we confirm your identity.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Email Verified!</h1>
                        <p className="text-sm text-slate-400">Your account has been fully activated. You can now log into the platform.</p>
                        <Link to="/auth/login" className="mt-8 w-full h-[48px] relative flex items-center justify-center rounded-lg bg-[#2E90FA] text-white text-[14px] font-semibold transition-all hover:bg-[#54A5FF]">
                            Go to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <XCircle size={48} className="mx-auto text-red-500" />
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Verification Failed</h1>
                        <p className="text-sm text-slate-400">{message}</p>
                        <Link to="/auth/login" className="mt-8 w-full h-[48px] relative flex items-center justify-center rounded-lg bg-transparent border border-[#1E293B] text-slate-300 text-[14px] font-semibold transition-all hover:bg-[#1E293B]/50 hover:text-white">
                            Return to Login
                        </Link>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
};
