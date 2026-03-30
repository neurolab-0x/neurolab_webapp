import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ChevronDown, User, Stethoscope, Building2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortalStore } from '../store/usePortalStore';
import AuthLayout from '../components/layout/AuthLayout';

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
            const email = form.email.toLowerCase().trim();
            const generatedUsername = form.username || email.split('@')[0] + Math.floor(Math.random() * 1000);

            const res = await fetch(`${BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: form.fullName.trim(),
                    username: generatedUsername,
                    email: email,
                    password: form.password,
                    role: form.role,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    setError('Too many attempts. Please wait 15 minutes before trying again.');
                } else if (data && (data.message || data.error)) {
                    setError(data.message || data.error);
                } else {
                    setError('Registration failed. Please try again.');
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
                        Create Account
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Already have an account? <Link to="/auth/login" className="font-medium text-[#2E90FA] hover:text-[#54A5FF] transition-colors underline-offset-4 hover:underline">Sign in</Link>
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-4"
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
                        <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="w-full h-[48px] rounded-lg border border-[#1E293B] bg-[#05050A] px-4 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#2E90FA]/50 placeholder:text-slate-600" placeholder="Full Name" required />
                    </div>
                    <div>
                        <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full h-[48px] rounded-lg border border-[#1E293B] bg-[#05050A] px-4 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#2E90FA]/50 placeholder:text-slate-600 tabular-nums" placeholder="Email address" required />
                    </div>
                    <div>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full h-[48px] rounded-lg border border-[#1E293B] bg-[#05050A] px-4 pr-10 text-sm text-slate-200 transition-all focus:outline-none focus:border-[#2E90FA] hover:border-[#2E90FA]/50 placeholder:text-slate-600 tabular-nums" placeholder="Password" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Custom Premium Dropdown built with Framer Motion */}
                    <div className="relative" ref={roleRef}>
                        <div
                            onClick={() => setRoleOpen(!roleOpen)}
                            className={`w-full h-[48px] rounded-lg border px-4 flex items-center justify-between cursor-pointer bg-[#05050A] transition-all hover:border-[#2E90FA]/50 ${roleOpen ? 'border-[#2E90FA] ring-1 ring-[#2E90FA]' : 'border-[#1E293B]'}`}
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
                                    animate={{ opacity: 1, y: 4, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 w-full rounded-[16px] border border-[#1E293B] bg-[#0C0C14] p-1.5 shadow-2xl z-50 overflow-hidden"
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
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full h-[48px] relative flex items-center justify-center rounded-lg bg-[#2E90FA] text-white text-[14px] font-semibold transition-all hover:bg-[#54A5FF] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
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
