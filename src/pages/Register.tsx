import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Eye, EyeOff, Loader2, ChevronDown, User, Stethoscope, Building2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
    { id: 'USER', label: 'Patient / User', icon: User, desc: 'Personal neural insights' },
    { id: 'DOCTOR', label: 'Doctor', icon: Stethoscope, desc: 'Clinical diagnostics' },
    { id: 'CLINIC', label: 'Clinic / Facility', icon: Building2, desc: 'Facility management' }
];

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', role: 'USER' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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

        // Mock registration delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Immediately log them in
        const mockUser = {
            id: `usr_new_${Date.now()}`,
            name: form.fullName || form.username || 'New User',
            role: form.role,
        };

        localStorage.setItem('neurai_user', JSON.stringify({ email: form.email.toLowerCase(), ...mockUser }));
        localStorage.setItem('neurai_token', 'mock_token_123'); // Legacy standard bypass

        window.location.href = '/';
    };

    const selectedRole = ROLES.find(r => r.id === form.role) || ROLES[0];

    return (
        <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 relative overflow-hidden">
            {/* Minimalist ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-sm space-y-8 relative z-10"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
                        className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm"
                    >
                        <BrainCircuit size={28} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold tracking-tight text-foreground"
                    >
                        Create Account
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 text-sm text-muted-foreground"
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
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground transition-colors focus-within:text-foreground">Full Name</label>
                        <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="w-full rounded-xl border border-input/50 bg-card/50 px-4 py-3 text-sm text-foreground backdrop-blur-sm transition-all focus:outline-none focus:border-primary/50 focus:bg-card/80 placeholder:text-muted-foreground/40" placeholder="Dr. Sarah Chen" required />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground transition-colors focus-within:text-foreground">Email</label>
                        <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full rounded-xl border border-input/50 bg-card/50 px-4 py-3 text-sm text-foreground backdrop-blur-sm transition-all focus:outline-none focus:border-primary/50 focus:bg-card/80 placeholder:text-muted-foreground/40" placeholder="doctor@neurolab.cc" required />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground transition-colors focus-within:text-foreground">Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full rounded-xl border border-input/50 bg-card/50 px-4 py-3 pr-10 text-sm text-foreground backdrop-blur-sm transition-all focus:outline-none focus:border-primary/50 focus:bg-card/80 placeholder:text-muted-foreground/40" placeholder="••••••••" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Custom Premium Dropdown built with Framer Motion */}
                    <div className="relative" ref={roleRef}>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Account Type</label>
                        <div
                            onClick={() => setRoleOpen(!roleOpen)}
                            className={`w-full rounded-xl border px-4 py-3 flex items-center justify-between cursor-pointer backdrop-blur-sm transition-all ${roleOpen ? 'border-primary/50 bg-card/80' : 'border-input/50 bg-card/50 hover:border-border'}`}
                        >
                            <div className="flex items-center gap-2">
                                <selectedRole.icon size={16} className="text-primary" />
                                <span className="text-sm font-medium text-foreground">{selectedRole.label}</span>
                            </div>
                            <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${roleOpen ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                            {roleOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-[calc(100%+8px)] left-0 w-full rounded-xl border border-border/80 bg-card/90 p-1.5 shadow-2xl shadow-background/50 backdrop-blur-xl z-50 overflow-hidden"
                                >
                                    {ROLES.map((role) => (
                                        <div
                                            key={role.id}
                                            onClick={() => { update('role', role.id); setRoleOpen(false); }}
                                            className={`flex items-center justify-between rounded-lg p-2.5 cursor-pointer transition-colors ${form.role === role.id ? 'bg-primary/10' : 'hover:bg-secondary/50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-md ${form.role === role.id ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                                                    <role.icon size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-medium ${form.role === role.id ? 'text-primary' : 'text-foreground'}`}>{role.label}</span>
                                                    <span className="text-xs text-muted-foreground">{role.desc}</span>
                                                </div>
                                            </div>
                                            {form.role === role.id && <Check size={16} className="text-primary" />}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full relative flex items-center justify-center overflow-hidden rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/95 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" />
                                Creating Account...
                            </motion.div>
                        ) : 'Create Account'}
                    </motion.button>
                </motion.form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-muted-foreground"
                >
                    Already have an account? <Link to="/auth/login" className="font-medium text-primary hover:text-primary/80 transition-colors">Sign in</Link>
                </motion.p>
            </motion.div>
        </div>
    );
}
