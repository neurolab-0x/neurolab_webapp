import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

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
        <div className="flex min-h-screen items-center justify-center bg-[#05050A] relative overflow-hidden selection:bg-[#2E90FA]/30 selection:text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            {/* Surgical Environment Background Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(46, 144, 250, 0.08), transparent 40%), linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '100% 100%, 20px 20px, 20px 20px' }} />

            <div className="w-full max-w-[420px] rounded-[24px] bg-[#0C0C14]/80 backdrop-blur-[12px] border-[0.5px] border-[#1E293B] p-8 shadow-2xl relative z-10 mx-6 hover:border-[#1E293B]/80 transition-colors text-center">
                <div className="mb-8 flex flex-col items-center">
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-slate-50 tracking-tight">Neurolab</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E90FA] ml-0.5" />
                    </div>
                    <div className="w-[30%] h-[1px] bg-[#2E90FA] mt-1 opacity-80" />
                </div>

                {status === 'verifying' && (
                    <div className="space-y-4">
                        <Loader2 size={32} className="mx-auto animate-spin text-[#2E90FA]" />
                        <h1 className="text-xl font-semibold text-slate-100" style={{ letterSpacing: '-0.02em' }}>Verifying Email...</h1>
                        <p className="text-[13px] text-slate-400">Please wait while we confirm your identity.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
                        <h1 className="text-xl font-semibold text-slate-100" style={{ letterSpacing: '-0.02em' }}>Email Verified!</h1>
                        <p className="text-[13px] text-slate-400">Your account has been fully activated. You can now log into the platform.</p>
                        <Link to="/auth/login" className="mt-8 w-full h-[44px] relative flex items-center justify-center overflow-hidden rounded-lg bg-[#2E90FA] text-white text-[13px] font-bold transition-all hover:bg-[#54A5FF] uppercase tracking-wide">
                            Go to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <XCircle size={48} className="mx-auto text-red-500" />
                        <h1 className="text-xl font-semibold text-slate-100" style={{ letterSpacing: '-0.02em' }}>Verification Failed</h1>
                        <p className="text-[13px] text-slate-400">{message}</p>
                        <Link to="/auth/login" className="mt-8 w-full h-[44px] relative flex items-center justify-center overflow-hidden rounded-lg bg-transparent border border-[#1E293B] text-slate-300 text-[13px] font-bold transition-all hover:bg-[#1E293B]/50 hover:text-white uppercase tracking-wide">
                            Return to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
