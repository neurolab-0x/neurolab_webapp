import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', role: 'USER' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('neurai_token', data.token);
                window.location.href = '/';
            }
        } catch (err) {
            console.error('Registration failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-full max-w-sm space-y-8 px-6">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <BrainCircuit size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Join the neural diagnostics platform</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name</label>
                        <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Dr. Sarah Chen" required />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Username</label>
                        <input type="text" value={form.username} onChange={(e) => update('username', e.target.value)} className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="sarahchen" required />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                        <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="doctor@neurolab.cc" required />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full rounded-lg border bg-card px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="••••••••" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Role</label>
                        <select value={form.role} onChange={(e) => update('role', e.target.value)} className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                            <option value="USER">Patient / User</option>
                            <option value="DOCTOR">Doctor</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
