import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_USERS: Record<string, { role: string, name: string, id: string }> = {
    'doctor@neurolab.cc': { role: 'DOCTOR', name: 'Dr. Sarah Chen', id: 'usr_doc_1' },
    'user@neurolab.cc': { role: 'USER', name: 'Alex Thompson', id: 'usr_pat_1' },
    'clinic@neurolab.cc': { role: 'CLINIC', name: 'Nexus Radiography', id: 'usr_cln_1' },
    'admin@neurolab.cc': { role: 'ADMIN', name: 'System Admin', id: 'usr_adm_1' },
};

export default function LoginPage() {
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

    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
            {/* Minimalist ambient premium background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-sm space-y-8 px-6 relative z-10"
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
                        Sign in to Neurolab
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 text-sm text-muted-foreground"
                    >
                        Access your clinical-grade neural platform
                    </motion.p>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20"
                        >
                            {error}
                        </motion.div>
                    )}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground transition-colors focus-within:text-foreground">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-input/50 bg-card/50 px-4 py-3 text-sm text-foreground backdrop-blur-sm transition-all focus:outline-none focus:border-primary/50 focus:bg-card/80 placeholder:text-muted-foreground/40"
                            placeholder="doctor@neurolab.cc"
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label className="block text-xs font-medium text-muted-foreground transition-colors focus-within:text-foreground">Password</label>
                            <Link to="/auth/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-input/50 bg-card/50 px-4 py-3 pr-10 text-sm text-foreground backdrop-blur-sm transition-all focus:outline-none focus:border-primary/50 focus:bg-card/80 placeholder:text-muted-foreground/40"
                                placeholder="••••••••"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full relative flex items-center justify-center overflow-hidden rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <Loader2 size={16} className="animate-spin" />
                                Authenticating...
                            </motion.div>
                        ) : 'Sign In'}
                    </motion.button>
                </motion.form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-muted-foreground"
                >
                    Don't have an account? <Link to="/auth/register" className="font-medium text-primary hover:text-primary/80 transition-colors">Create one</Link>
                </motion.p>
            </motion.div>
        </div>
    );
}
