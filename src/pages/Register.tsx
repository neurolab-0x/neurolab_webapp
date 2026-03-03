import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ChevronDown, User, Stethoscope, Building2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortalStore } from '../store/usePortalStore';

const BASE = import.meta.env.VITE_API_BASE_URL;

const ROLES = [
    { id: 'USER', label: 'Patient / User', icon: User, desc: 'Personal neural insights' },
    { id: 'DOCTOR', label: 'Doctor', icon: Stethoscope, desc: 'Clinical diagnostics' },
    { id: 'CLINIC', label: 'Clinic / Facility', icon: Building2, desc: 'Facility management' }
];

export default function RegisterPage() {
    const navigate = useNavigate();
    const { theme } = usePortalStore();
    const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', role: 'USER' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [roleOpen, setRoleOpen] = useState(false);
    const roleRef = useRef<HTMLDivElement>(null);

    const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
                setRoleOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: form.fullName,
                    username: form.username,
                    email: form.email.toLowerCase(),
                    password: form.password,
                    role: form.role,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || data.error || 'Registration failed. Please try again.');
                setLoading(false);
                return;
            }

            // Store auth tokens
            localStorage.setItem('neurai_token', data.token || data.accessToken || '');
            if (data.refreshToken) localStorage.setItem('neurai_refresh', data.refreshToken);

            // Store user info
            const user = data.user || data;
            localStorage.setItem('neurai_user', JSON.stringify({
                id: user._id || user.id,
                email: user.email,
                name: user.fullName || user.username || user.email,
                role: user.role || form.role,
            }));

            window.location.href = '/';
        } catch (err: any) {
            setError('Network error. Please check your connection and try again.');
            setLoading(false);
        }
    };

    const selectedRole = ROLES.find(r => r.id === form.role) || ROLES[0];


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
        <div className="flex min-h-screen items-center justify-center bg-[#05050A] py-12 px-4 relative overflow-hidden selection:bg-[#2E90FA]/30 selection:text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            {/* Surgical Environment Background Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(46, 144, 250, 0.08), transparent 40%), linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '100% 100%, 20px 20px, 20px 20px' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-[420px] rounded-[24px] bg-[#0C0C14]/80 backdrop-blur-[12px] border-[0.5px] border-[#1E293B] p-8 shadow-2xl relative z-10 hover:border-[#1E293B]/80 transition-colors"
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
                        Create Account
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 text-[13px] text-slate-400"
                    >
                        Join the neural diagnostics platform
                    </motion.p>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">Full Name</label>
                        <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="w-full h-[40px] rounded-lg border border-transparent bg-[#05050A] px-4 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#1E293B] shadow-inner placeholder:text-slate-600" placeholder="Dr. Sarah Chen" required />
                    </div>
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">Email</label>
                        <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full h-[40px] rounded-lg border border-transparent bg-[#05050A] px-4 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#1E293B] shadow-inner placeholder:text-slate-600 tabular-nums" placeholder="doctor@neurolab.cc" required />
                    </div>
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full h-[40px] rounded-lg border border-transparent bg-[#05050A] px-4 pr-10 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#1E293B] shadow-inner placeholder:text-slate-600 tabular-nums" placeholder="••••••••" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Custom Premium Dropdown built with Framer Motion */}
                    <div className="relative" ref={roleRef}>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">Account Type</label>
                        <div
                            onClick={() => setRoleOpen(!roleOpen)}
                            className={`w-full h-[44px] rounded-lg border px-4 flex items-center justify-between cursor-pointer bg-[#05050A] transition-all shadow-inner hover:border-[#1E293B] ${roleOpen ? 'border-[#2E90FA]' : 'border-transparent'}`}
                        >
                            <div className="flex items-center gap-2">
                                <selectedRole.icon size={16} className="text-[#2E90FA]" />
                                <span className="text-sm font-medium text-slate-200">{selectedRole.label}</span>
                            </div>
                            <ChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${roleOpen ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                            {roleOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-[calc(100%+8px)] left-0 w-full rounded-[16px] border border-[#1E293B] bg-[#0C0C14]/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
                                >
                                    {ROLES.map((role) => (
                                        <div
                                            key={role.id}
                                            onClick={() => { update('role', role.id); setRoleOpen(false); }}
                                            className={`flex items-center justify-between rounded-lg p-2.5 cursor-pointer transition-colors ${form.role === role.id ? 'bg-[#2E90FA]/10' : 'hover:bg-[#1E293B]/50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-md ${form.role === role.id ? 'bg-[#2E90FA]/20 text-[#2E90FA]' : 'bg-[#1E293B] text-slate-400'}`}>
                                                    <role.icon size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-medium ${form.role === role.id ? 'text-[#2E90FA]' : 'text-slate-200'}`}>{role.label}</span>
                                                    <span className="text-[11px] text-slate-500">{role.desc}</span>
                                                </div>
                                            </div>
                                            {form.role === role.id && <Check size={16} className="text-[#2E90FA]" />}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01, backgroundColor: '#54A5FF' }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full h-[44px] relative flex items-center justify-center overflow-hidden rounded-lg bg-[#2E90FA] text-white text-[13px] font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
                    >
                        {loading ? <PulsingWaveform /> : 'Create Account'}
                    </motion.button>
                </motion.form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center text-xs text-slate-500"
                >
                    Already have an account? <Link to="/auth/login" className="font-medium text-slate-400 hover:text-slate-50 transition-colors">Sign in</Link>
                </motion.p>
            </motion.div>
        </div>
    );
};
