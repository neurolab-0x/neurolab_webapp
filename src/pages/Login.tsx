import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortalStore } from '../store/usePortalStore';

const MOCK_USERS: Record<string, { role: string, name: string, id: string }> = {
    'doctor@neurolab.cc': { role: 'DOCTOR', name: 'Dr. Sarah Chen', id: 'usr_doc_1' },
    'user@neurolab.cc': { role: 'USER', name: 'Alex Thompson', id: 'usr_pat_1' },
    'clinic@neurolab.cc': { role: 'CLINIC', name: 'Nexus Radiography', id: 'usr_cln_1' },
    'admin@neurolab.cc': { role: 'ADMIN', name: 'System Admin', id: 'usr_adm_1' },
};

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

        // Simulate network delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockUser = MOCK_USERS[email.toLowerCase()];

        if (mockUser) {
            // Success
            localStorage.setItem('neurai_user', JSON.stringify({ email: email.toLowerCase(), ...mockUser }));
            localStorage.setItem('neurai_token', 'mock_token_123'); // Keep for backward compatibility with older components
            window.location.href = '/';
        } else {
            // Failure
            setError('Invalid credentials. For trial, use doctor@neurolab.cc, user@neurolab.cc, clinic@neurolab.cc, or admin@neurolab.cc');
        }

        setLoading(false);
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
        <div className="flex min-h-screen items-center justify-center bg-[#05050A] relative overflow-hidden selection:bg-[#2E90FA]/30 selection:text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            {/* Surgical Environment Background Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(46, 144, 250, 0.08), transparent 40%), linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '100% 100%, 20px 20px, 20px 20px' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-[420px] rounded-[24px] bg-[#0C0C14]/80 backdrop-blur-[12px] border-[0.5px] border-[#1E293B] p-8 shadow-2xl relative z-10 mx-6 hover:border-[#1E293B]/80 transition-colors"
            >
                <div className="text-center mb-8 flex flex-col items-center">
                    {/* NeurAI Technical Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="mb-6 flex flex-col items-center"
                    >
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-slate-50 tracking-tight">NeurAI</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E90FA] ml-0.5" />
                        </div>
                        <div className="w-[30%] h-[1px] bg-[#2E90FA] mt-1 opacity-80" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-semibold text-slate-100"
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        Sign in to Neurolab
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 text-[13px] text-slate-400"
                    >
                        Access your clinical-grade neural platform
                    </motion.p>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
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
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[44px] rounded-lg border border-transparent bg-[#05050A] px-4 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#1E293B] shadow-inner placeholder:text-slate-600 tabular-nums"
                            placeholder="doctor@neurolab.cc"
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">Password</label>
                            <Link to="/auth/forgot-password" className="text-xs font-medium text-slate-400 hover:text-slate-50 transition-colors">Forgot?</Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[44px] rounded-lg border border-transparent bg-[#05050A] px-4 pr-10 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#1E293B] shadow-inner placeholder:text-slate-600 tabular-nums"
                                placeholder="••••••••"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01, backgroundColor: '#54A5FF' }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full h-[44px] relative flex items-center justify-center overflow-hidden rounded-lg bg-[#2E90FA] text-white text-[13px] font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
                    >
                        {loading ? <PulsingWaveform /> : 'Sign In'}
                    </motion.button>
                </motion.form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center text-xs text-slate-500"
                >
                    Don't have an account? <Link to="/auth/register" className="font-medium text-slate-400 hover:text-slate-50 transition-colors">Create one</Link>
                </motion.p>
            </motion.div>
        </div>
    );
};
