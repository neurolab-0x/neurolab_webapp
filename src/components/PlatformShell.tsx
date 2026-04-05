import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { usePortalStore } from '../store/usePortalStore';
import {
    Activity, Users, Server, Microscope, Stethoscope, Building2,
    LogOut, BrainCircuit, Settings, Clock, Cpu, Calendar, FileText,
    MessageSquare, Upload, Star, BarChart3, CreditCard,
    Handshake, Bell, Moon, Sun, Loader2, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import { motion } from 'framer-motion';

import DoctorOnboarding from './DoctorOnboarding';
import UserTutorial from './UserTutorial';

interface User {
    id: string;
    role: 'USER' | 'ADMIN' | 'DOCTOR' | 'CLINIC';
    name: string;
    email: string;
}

const CornerDots = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const size = 18;
    const spacing = 20;
    const maxDist = size * 0.8;

    const dots = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const dist = Math.sqrt(r * r + c * c);
            if (dist < maxDist) {
                const progress = dist / maxDist;
                const dotSize = Math.max(0, 1.2 * (1 - Math.pow(progress, 1.5)));
                const opacity = Math.max(0, 0.4 * (1 - Math.pow(progress, 2)));
                if (dotSize > 0.1 && opacity > 0.01) {
                    dots.push(
                        <circle
                            key={`${r}-${c}`}
                            cx={c * spacing + spacing / 2}
                            cy={r * spacing + spacing / 2}
                            r={dotSize}
                            fill="currentColor"
                            opacity={opacity}
                        />
                    );
                }
            }
        }
    }

    const posClasses = {
        tl: 'top-0 left-0',
        tr: 'top-0 right-0 scale-x-[-1]',
        bl: 'bottom-0 left-0 scale-y-[-1]',
        br: 'bottom-0 right-0 -scale-x-100 -scale-y-100', // Rotates 180 degrees
    };

    return (
        <svg
            className={`pointer-events-none absolute text-foreground/50 ${posClasses[position]}`}
            width={size * spacing}
            height={size * spacing}
            viewBox={`0 0 ${size * spacing} ${size * spacing}`}
        >
            {dots}
        </svg>
    );
};

const PlatformShell = () => {
    const { activeView, setActiveView, theme, toggleTheme } = usePortalStore();
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const sandboxMode = params.get('sandbox');

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (sandboxMode === 'doctor') {
            setCurrentUser({ id: 'sandbox-doctor', role: 'DOCTOR', name: 'Visitor', email: 'visitor@sandbox' });
            setLoading(false);
            return;
        } else if (sandboxMode === 'patient') {
            setCurrentUser({ id: 'sandbox-patient', role: 'USER', name: 'Visitor', email: 'visitor@sandbox' });
            setLoading(false);
            return;
        }

        const sessionBlob = localStorage.getItem('neurolab_user');
        if (sessionBlob) {
            try {
                const user = JSON.parse(sessionBlob);
                setCurrentUser(user);
            } catch (err) {
                navigate('/auth/login');
            }
        } else {
            navigate('/auth/login');
        }
        setLoading(false);
    }, [navigate, location.search]);

    const handleSignOut = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('neurolab_token') || ''}` },
            });
        } catch (_) { /* Always clear local state even if logout fails */ }
        localStorage.removeItem('neurolab_token');
        localStorage.removeItem('neurolab_refresh');
        localStorage.removeItem('neurolab_user');
        navigate('/auth/login');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    if (!currentUser) return null;

    const renderNavLinks = () => {
        const NavItem = (props: any) => <SidebarLink {...props} minimized={isSidebarMinimized} />;

        if (sandboxMode) {
            const handleWaitlistClick = (e: React.MouseEvent) => {
                e.preventDefault();
                // Call parent window if we are in an iframe
                if (window.parent) {
                    window.parent.location.href = 'http://localhost:8082/contact';
                }
            };

            if (sandboxMode === 'doctor') {
                return (
                    <>
                        <NavItem to="/doctor/analysis?sandbox=doctor" icon={<Activity size={18} />} label="Live Analysis" />
                        <NavItem to="/doctor/uploads?sandbox=doctor" icon={<FileText size={18} />} label="Offline Uploads" />
                        <NavItem to="/user/chat?sandbox=doctor" icon={<MessageSquare size={18} />} label="Neurolab Chat" />
                        {!isSidebarMinimized && (
                            <div className="mt-4 px-3">
                                <button onClick={handleWaitlistClick} className="w-full relative group overflow-hidden rounded-lg bg-gradient-to-r from-primary to-purple-600 p-[1px] shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-shadow">
                                    <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -translate-x-full z-10" />
                                    <div className="h-full w-full bg-background rounded-lg px-3 py-2 flex items-center justify-center gap-2 group-hover:bg-background/80 transition-colors">
                                        <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 truncate">Join Waitlist</span>
                                        <Star size={14} className="text-primary shrink-0" />
                                    </div>
                                </button>
                            </div>
                        )}
                    </>
                );
            } else if (sandboxMode === 'patient') {
                return (
                    <>
                        <NavItem to="/user/session?sandbox=patient" icon={<Activity size={18} />} label="Neural Session" />
                        <NavItem to="/user/uploads?sandbox=patient" icon={<Upload size={18} />} label="Offline Uploads" />
                        <NavItem to="/user/insights?sandbox=patient" icon={<BrainCircuit size={18} />} label="Wellness Insights" />
                        <NavItem to="/user/chat?sandbox=patient" icon={<MessageSquare size={18} />} label="Neurolab Chat" />
                        {!isSidebarMinimized && (
                            <div className="mt-4 px-3">
                                <button onClick={handleWaitlistClick} className="w-full relative group overflow-hidden rounded-lg bg-gradient-to-r from-primary to-emerald-500 p-[1px] shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-shadow">
                                    <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -translate-x-full z-10" />
                                    <div className="h-full w-full bg-background rounded-lg px-3 py-2 flex items-center justify-center gap-2 group-hover:bg-background/80 transition-colors">
                                        <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400 truncate">Early Access</span>
                                        <Calendar size={14} className="text-emerald-500 shrink-0" />
                                    </div>
                                </button>
                            </div>
                        )}
                    </>
                );
            }
        }

        if (currentUser.role === 'ADMIN') {
            return (
                <>
                    <NavItem to="/admin/metrics" icon={<Activity size={18} />} label="Command Center" />
                    <NavItem to="/admin/users" icon={<Users size={18} />} label="Users" />
                    <NavItem to="/admin/devices" icon={<Cpu size={18} />} label="Device Fleet" />
                    <NavItem to="/admin/sessions" icon={<Server size={18} />} label="Sessions" />
                    <NavItem to="/admin/clinics" icon={<Building2 size={18} />} label="Clinics" />
                    <NavItem to="/admin/billing" icon={<CreditCard size={18} />} label="Billing" />
                    <NavItem to="/admin/partnerships" icon={<Handshake size={18} />} label="Partnerships" />
                    <NavItem to="/notifications" icon={<Bell size={18} />} label="Notifications" />
                </>
            );
        }

        if (currentUser.role === 'USER') {
            return (
                <>
                    <NavItem tourId="tour-session" to="/user/session" icon={<Activity size={18} />} label="Neural Session" />
                    <NavItem to="/user/history" icon={<Clock size={18} />} label="History" />
                    <NavItem to="/user/devices" icon={<Cpu size={18} />} label="My Devices" />
                    <NavItem tourId="tour-booking" to="/user/booking" icon={<Calendar size={18} />} label="Book Session" />
                    <NavItem to="/user/appointments" icon={<Calendar size={18} />} label="Appointments" />
                    <NavItem to="/user/chat" icon={<MessageSquare size={18} />} label="Neurolab Chat" />
                    <NavItem to="/user/uploads" icon={<Upload size={18} />} label="Uploads" />
                    <NavItem tourId="tour-insights" to="/user/insights" icon={<BrainCircuit size={18} />} label="Wellness Insights" />
                    <NavItem to="/user/reviews" icon={<Star size={18} />} label="Reviews" />
                    <NavItem to="/notifications" icon={<Bell size={18} />} label="Notifications" />
                </>
            );
        }

        if (currentUser.role === 'CLINIC' && activeView === 'CLINIC') {
            return (
                <>
                    <NavItem to="/clinic/stats" icon={<BarChart3 size={18} />} label="Overview" />
                    <NavItem to="/clinic/patients" icon={<Users size={18} />} label="Patient Roster" />
                    <NavItem to="/clinic/devices" icon={<Cpu size={18} />} label="Facility Devices" />
                    <NavItem to="/notifications" icon={<Bell size={18} />} label="Notifications" />
                </>
            );
        }

        return (
            <>
                <NavItem to="/doctor/overview" icon={<Stethoscope size={18} />} label="My Patients" />
                <NavItem to="/doctor/analysis" icon={<Activity size={18} />} label="Live Analysis" />
                <NavItem to="/doctor/uploads" icon={<FileText size={18} />} label="Offline Uploads" />
                <NavItem to="/doctor/appointments" icon={<Calendar size={18} />} label="Schedule" />
                <NavItem to="/doctor/decision" icon={<BrainCircuit size={18} />} label="Decision Support" />
                <NavItem to="/doctor/certifications" icon={<Microscope size={18} />} label="Certifications" />
                <NavItem to="/notifications" icon={<Bell size={18} />} label="Notifications" />
            </>
        );
    };

    // Determine effective sidebar minimized state (auto-minimize on iPad)
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const effectiveMinimized = isSidebarMinimized;

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Onboarding Modals */}
            {!sandboxMode && (
                <>
                    <DoctorOnboarding user={currentUser} />
                    <UserTutorial user={currentUser} />
                </>
            )}

            {/* Mobile sidebar backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="sidebar-backdrop lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 flex flex-col border-r border-sidebar-border bg-sidebar py-6 transition-all duration-300 z-50 safe-area-top
                ${isSidebarMinimized ? 'w-[72px] px-2' : 'w-64 px-4'}
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className={`mb-8 flex items-center gap-3 px-2 ${isSidebarMinimized ? 'justify-center flex-col' : 'justify-between'}`}>
                    <div className="flex justify-center items-center gap-3">
                        <div className="relative flex shrink-0 h-8 w-8 items-center justify-center">
                            <img src={theme === 'dark' ? '/logo1.png' : '/logo.png'} alt="Neurolab OS" className="h-full w-full object-contain" />
                        </div>
                        {!isSidebarMinimized && (
                            <div className="flex flex-col items-center ml-2">
                                <div className="flex items-baseline">
                                    <span className="text-xl font-bold tracking-tight text-sidebar-foreground truncate">Neurolab</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E90FA] ml-0.5" />
                                </div>
                                <div className="w-[30%] h-[1px] bg-[#2E90FA] mt-1 opacity-80" />
                            </div>
                        )}
                    </div>
                    {/* Close button on mobile, minimize toggle on desktop */}
                    <button
                        onClick={() => {
                            if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
                            else setIsSidebarMinimized(!isSidebarMinimized);
                        }}
                        className="text-muted-foreground hover:text-foreground shrink-0 bg-sidebar-accent/50 p-1 rounded touch-target flex items-center justify-center"
                    >
                        {window.innerWidth < 1024 ? <X size={18} /> : (isSidebarMinimized ? <ChevronRight size={14} /> : <ChevronLeft size={14} />)}
                    </button>
                </div>

                {currentUser.role === 'CLINIC' && !isSidebarMinimized && (
                    <div className="mb-6 rounded-xl bg-surface border border-sidebar-border p-1 shadow-inner">
                        <div className="relative flex">
                            <div
                                className="absolute inset-y-0 w-1/2 rounded-lg bg-sidebar-primary transition-transform duration-300 ease-[var(--ease-apple)]"
                                style={{ transform: activeView === 'DOCTOR' ? 'translateX(100%)' : 'translateX(0)' }}
                            />
                            <button onClick={() => { setActiveView('CLINIC'); navigate('/clinic/stats'); }} className={`relative z-10 w-1/2 py-1.5 text-xs font-medium transition-colors duration-200 min-h-[44px] ${activeView === 'CLINIC' ? 'text-sidebar-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Clinic View</button>
                            <button onClick={() => { setActiveView('DOCTOR'); navigate('/doctor/analysis'); }} className={`relative z-10 w-1/2 py-1.5 text-xs font-medium transition-colors duration-200 min-h-[44px] ${activeView === 'DOCTOR' ? 'text-sidebar-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Doctor View</button>
                        </div>
                    </div>
                )}

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pb-6 momentum-scroll scrollbar-hide">
                    {renderNavLinks()}
                </nav>

                <div className="mt-auto border-t border-sidebar-border pt-4 space-y-1 bg-sidebar z-10 safe-area-bottom">
                    {!sandboxMode && (
                        <>
                            <SidebarLink minimized={isSidebarMinimized} to="/calendar-sync" icon={<Calendar size={18} />} label="Calendar Sync" />
                            <SidebarLink minimized={isSidebarMinimized} to="/settings" icon={<Settings size={18} />} label="Settings" />
                        </>
                    )}
                    <button onClick={toggleTheme} className={`flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground min-h-[44px] ${isSidebarMinimized ? 'justify-center px-0' : 'px-3'}`} title={isSidebarMinimized ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}>
                        {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} className="shrink-0" /> : <Moon size={18} strokeWidth={1.5} className="shrink-0" />}
                        {!isSidebarMinimized && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>
                    {!sandboxMode && (
                        <button onClick={handleSignOut} className={`flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive min-h-[44px] ${isSidebarMinimized ? 'justify-center px-0' : 'px-3'}`} title={isSidebarMinimized ? "Sign out" : undefined}>
                            <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
                            {!isSidebarMinimized && <span>Sign out</span>}
                        </button>
                    )}
                </div>
            </aside>

            {/* Main content: margin only on desktop where sidebar is permanently visible */}
            <main className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${isSidebarMinimized ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
                {/* Background Dots Overlay — hidden on mobile for performance */}
                <div className={`fixed inset-y-0 right-0 z-0 pointer-events-none transition-all duration-300 hidden lg:block ${isSidebarMinimized ? 'left-[72px]' : 'left-64'}`}>
                    <CornerDots position="tr" />
                    <CornerDots position="bl" />
                </div>

                <header className="sticky top-0 z-10 flex h-14 lg:h-16 items-center justify-between border-b border-border/40 bg-background/80 px-4 md:px-6 lg:px-8 backdrop-blur-md safe-area-top">
                    <div className="flex items-center gap-3">
                        {/* Hamburger — mobile only */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg text-foreground hover:bg-secondary transition-colors touch-target"
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-sm font-medium tracking-tight text-foreground truncate">
                            <span className="hidden sm:inline">
                                {currentUser.role === 'ADMIN' ? 'System Administration' : currentUser.role === 'USER' ? 'Patient Dashboard' : activeView === 'CLINIC' ? 'Facility Management Engine' : 'Clinical Diagnostics Terminal'}
                            </span>
                            <span className="sm:hidden">Neurolab</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-2 md:px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            <span className="hidden sm:inline">System Online</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 border-l border-border/50 pl-2 md:pl-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium text-foreground">{currentUser.name}</span>
                                <span className="text-xs text-muted-foreground">{currentUser.role}</span>
                            </div>
                            <div id="tour-profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                {currentUser.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 w-full p-4 md:p-6 lg:p-8 safe-area-bottom overflow-x-hidden">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

function SidebarLink({ to, icon, label, tourId, minimized }: { to: string; icon: React.ReactNode; label: string; tourId?: string; minimized?: boolean }) {
    return (
        <NavLink end id={tourId} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors min-h-[44px] active:scale-95 ${minimized ? 'justify-center px-0' : 'px-3'} ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'}`} title={minimized ? label : undefined}>
            {icon && <span className="opacity-80 shrink-0">{icon}</span>}
            {!minimized && <span className="truncate">{label}</span>}
        </NavLink>
    );
}

export default PlatformShell;
