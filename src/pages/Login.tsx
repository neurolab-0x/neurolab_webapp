import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortalStore } from '../store/usePortalStore';
import AuthLayout from '../components/layout/AuthLayout';

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
    const { theme } = usePortalStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase(), password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    setError('Too many attempts. Please wait 15 minutes before trying again.');
                } else if (data && (data.message || data.error)) {
                    setError(data.message || data.error);
                } else {
                    setError('Invalid credentials. Please try again.');
                }
                setLoading(false);
                return;
            }

            // Store auth tokens
            localStorage.setItem('neurolab_token', data.token || data.accessToken || '');
            if (data.refreshToken) localStorage.setItem('neurolab_refresh', data.refreshToken);

            // Store user info
            const user = data.user || data;
            localStorage.setItem('neurolab_user', JSON.stringify({
                id: user._id || user.id,
                email: user.email,
                name: user.fullName || user.username || user.email,
                role: user.role || 'USER',
            }));

            window.location.href = '/';
        } catch (err: any) {
            setError('Network error. Please check your connection and try again.');
            setLoading(false);
        }
    };


    const PulsingWaveform = () => (
        <div className="flex items-center justify-center gap-1 h-4">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-[3px] bg-white rounded-full"
                    animate={{ height: ['4px', '16px', '4px'] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                />
            ))}
        </div>
    );

    return (
        <AuthLayout>
            <div className="flex flex-col">
                {/* Neurolab Logo Component (Left Aligned) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="mb-10"
                >
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-slate-50 tracking-tight">Neurolab</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E90FA] ml-1" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                        Log in to Neurolab
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Don't have an account? <Link to="/auth/register" className="font-medium text-[#2E90FA] hover:text-[#54A5FF] transition-colors underline-offset-4 hover:underline">Sign up</Link>
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20"
                        >
                            {error}
                        </motion.div>
                    )}
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[48px] rounded-lg border border-[#1E293B] bg-[#05050A] px-4 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#2E90FA]/50 placeholder:text-slate-600 tabular-nums"
                            placeholder="Email address"
                            required
                        />
                    </div>
                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[48px] rounded-lg border border-[#1E293B] bg-[#05050A] px-4 pr-10 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#2E90FA]/50 placeholder:text-slate-600 tabular-nums"
                                placeholder="Password"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <div className="mt-2 text-right">
                            <Link to="/auth/forgot-password" className="text-[13px] font-medium text-slate-400 hover:text-slate-200 transition-colors">Forgot password?</Link>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full h-[48px] relative flex items-center justify-center rounded-lg bg-white text-[#05050A] text-[14px] font-semibold transition-all hover:bg-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
                    </motion.button>
                </motion.form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 text-[12px] text-slate-500 leading-relaxed"
                >
                    By continuing, you agree to our <br />
                    <Link to="/terms" className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors">Terms of Service</Link> and <Link to="/privacy" className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors">Privacy Policy</Link>.
                </motion.div>
            </div>
        </AuthLayout>
    );
};
