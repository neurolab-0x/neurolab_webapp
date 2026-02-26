import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { usePortalStore } from '../store/usePortalStore';
import {
    Activity, Users, Server, Microscope, Stethoscope, Building2,
    LogOut, BrainCircuit, Settings, Clock, Cpu, Calendar,
    MessageSquare, Upload, Star, BarChart3, CreditCard,
    Handshake, Bell, Moon, Sun, Loader2, ChevronLeft, ChevronRight
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

const PlatformShell = () => {
    const { activeView, setActiveView, theme, toggleTheme } = usePortalStore();
    const navigate = useNavigate();
    const location = useLocation();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

    useEffect(() => {
        const sessionBlob = localStorage.getItem('neurai_user');
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
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('neurai_token');
        localStorage.removeItem('neurai_refresh');
        localStorage.removeItem('neurai_user');
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
                    <NavItem to="/user/chat" icon={<MessageSquare size={18} />} label="NeurAI Chat" />
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
                <NavItem to="/doctor/analysis" icon={<Microscope size={18} />} label="Neural Analysis" />
                <NavItem to="/doctor/appointments" icon={<Calendar size={18} />} label="Schedule" />
                <NavItem to="/doctor/decision" icon={<BrainCircuit size={18} />} label="Decision Support" />
                <NavItem to="/doctor/certifications" icon={<Activity size={18} />} label="Certifications" />
                <NavItem to="/notifications" icon={<Bell size={18} />} label="Notifications" />
            </>
        );
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Onboarding Modals */}
            <DoctorOnboarding user={currentUser} />
            <UserTutorial user={currentUser} />

            <aside className={`fixed inset-y-0 left-0 flex flex-col border-r border-sidebar-border bg-sidebar py-6 transition-all duration-300 z-50 ${isSidebarMinimized ? 'w-[72px] px-2' : 'w-64 px-4'}`}>
                <div className={`mb-8 flex items-center gap-3 px-2 ${isSidebarMinimized ? 'justify-center flex-col' : 'justify-between'}`}>
                    <div className="flex items-center gap-3">
                        <div className="relative flex shrink-0 h-8 w-8 items-center justify-center rounded-md bg-electric-blue text-white shadow-lg shadow-electric-blue/20">
                            <BrainCircuit size={16} />
                        </div>
                        {!isSidebarMinimized && <span className="text-lg font-bold tracking-tight text-sidebar-foreground truncate">NeurAI OS</span>}
                    </div>
                    <button onClick={() => setIsSidebarMinimized(!isSidebarMinimized)} className="text-muted-foreground hover:text-foreground shrink-0 bg-sidebar-accent/50 p-1 rounded">
                        {isSidebarMinimized ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {currentUser.role === 'CLINIC' && !isSidebarMinimized && (
                    <div className="mb-6 rounded-xl bg-surface border border-sidebar-border p-1 shadow-inner">
                        <div className="relative flex">
                            <div
                                className="absolute inset-y-0 w-1/2 rounded-lg bg-sidebar-primary transition-transform duration-300 ease-[var(--ease-apple)]"
                                style={{ transform: activeView === 'DOCTOR' ? 'translateX(100%)' : 'translateX(0)' }}
                            />
                            <button onClick={() => setActiveView('CLINIC')} className={`relative z-10 w-1/2 py-1.5 text-xs font-medium transition-colors duration-200 ${activeView === 'CLINIC' ? 'text-sidebar-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Clinic View</button>
                            <button onClick={() => setActiveView('DOCTOR')} className={`relative z-10 w-1/2 py-1.5 text-xs font-medium transition-colors duration-200 ${activeView === 'DOCTOR' ? 'text-sidebar-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Doctor View</button>
                        </div>
                    </div>
                )}

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {renderNavLinks()}
                </nav>

                <div className="mt-auto border-t border-sidebar-border pt-4 space-y-1 bg-sidebar z-10">
                    <SidebarLink minimized={isSidebarMinimized} to="/calendar-sync" icon={<Calendar size={18} />} label="Calendar Sync" />
                    <SidebarLink minimized={isSidebarMinimized} to="/settings" icon={<Settings size={18} />} label="Settings" />
                    <button onClick={toggleTheme} className={`flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isSidebarMinimized ? 'justify-center px-0' : 'px-3'}`} title={isSidebarMinimized ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}>
                        {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} className="shrink-0" /> : <Moon size={18} strokeWidth={1.5} className="shrink-0" />}
                        {!isSidebarMinimized && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>
                    <button onClick={handleSignOut} className={`flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive ${isSidebarMinimized ? 'justify-center px-0' : 'px-3'}`} title={isSidebarMinimized ? "Sign out" : undefined}>
                        <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
                        {!isSidebarMinimized && <span>Sign out</span>}
                    </button>
                </div>
            </aside>

            <main className={`flex-1 transition-all duration-300 ${isSidebarMinimized ? 'ml-[72px]' : 'ml-64'}`}>
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-8 backdrop-blur-md">
                    <h2 className="text-sm font-medium tracking-tight text-foreground">
                        {currentUser.role === 'ADMIN' ? 'System Administration' : currentUser.role === 'USER' ? 'Patient Dashboard' : activeView === 'CLINIC' ? 'Facility Management Engine' : 'Clinical Diagnostics Terminal'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            System Online
                        </div>
                        <div className="flex items-center gap-3 border-l border-border/50 pl-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-foreground">{currentUser.name}</span>
                                <span className="text-xs text-muted-foreground">{currentUser.role}</span>
                            </div>
                            <div id="tour-profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                {currentUser.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-8">
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
        <NavLink end id={tourId} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors ${minimized ? 'justify-center px-0' : 'px-3'} ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'}`} title={minimized ? label : undefined}>
            {icon && <span className="opacity-80 shrink-0">{icon}</span>}
            {!minimized && <span className="truncate">{label}</span>}
        </NavLink>
    );
}

export default PlatformShell;
