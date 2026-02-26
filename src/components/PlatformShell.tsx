import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { usePortalStore } from '../store/usePortalStore';
import {
    Activity,
    Users,
    Server,
    Microscope,
    Stethoscope,
    Building2,
    LogOut,
    BrainCircuit,
    Settings,
    Clock,
    Cpu,
    Calendar,
    MessageSquare,
    Upload,
    Star,
    BarChart3,
    CreditCard,
    Handshake,
    Bell,
    Moon,
    Sun,
} from 'lucide-react';

const currentUser = {
    id: 'usr_123',
    role: 'CLINIC' as 'USER' | 'ADMIN' | 'DOCTOR' | 'CLINIC',
    clinicId: 'cln_456',
    name: 'Dr. Sarah Chen',
};

const PlatformShell = () => {
    const { activeView, setActiveView, theme, toggleTheme } = usePortalStore();

    const renderNavLinks = () => {
        if (currentUser.role === 'ADMIN') {
            return (
                <>
                    <SidebarLink to="/admin/metrics" icon={<Activity size={18} />} label="Command Center" />
                    <SidebarLink to="/admin/users" icon={<Users size={18} />} label="Users" />
                    <SidebarLink to="/admin/devices" icon={<Cpu size={18} />} label="Device Fleet" />
                    <SidebarLink to="/admin/sessions" icon={<Server size={18} />} label="Sessions" />
                    <SidebarLink to="/admin/clinics" icon={<Building2 size={18} />} label="Clinics" />
                    <SidebarLink to="/admin/billing" icon={<CreditCard size={18} />} label="Billing" />
                    <SidebarLink to="/admin/partnerships" icon={<Handshake size={18} />} label="Partnerships" />
                    <SidebarLink to="/notifications" icon={<Bell size={18} />} label="Notifications" />
                </>
            );
        }

        if (currentUser.role === 'USER') {
            return (
                <>
                    <SidebarLink to="/user/session" icon={<Activity size={18} />} label="Neural Session" />
                    <SidebarLink to="/user/history" icon={<Clock size={18} />} label="History" />
                    <SidebarLink to="/user/devices" icon={<Cpu size={18} />} label="My Devices" />
                    <SidebarLink to="/user/appointments" icon={<Calendar size={18} />} label="Appointments" />
                    <SidebarLink to="/user/chat" icon={<MessageSquare size={18} />} label="NeurAI Chat" />
                    <SidebarLink to="/user/uploads" icon={<Upload size={18} />} label="Uploads" />
                    <SidebarLink to="/user/reviews" icon={<Star size={18} />} label="Reviews" />
                    <SidebarLink to="/notifications" icon={<Bell size={18} />} label="Notifications" />
                </>
            );
        }

        // CLINIC role — toggle between clinic and doctor views
        if (currentUser.role === 'CLINIC' && activeView === 'CLINIC') {
            return (
                <>
                    <SidebarLink to="/clinic/stats" icon={<BarChart3 size={18} />} label="Overview" />
                    <SidebarLink to="/clinic/patients" icon={<Users size={18} />} label="Patient Roster" />
                    <SidebarLink to="/clinic/devices" icon={<Cpu size={18} />} label="Facility Devices" />
                    <SidebarLink to="/notifications" icon={<Bell size={18} />} label="Notifications" />
                </>
            );
        }

        // DOCTOR role (doctor-only, no toggle) or CLINIC role in doctor view
        return (
            <>
                <SidebarLink to="/doctor/overview" icon={<Stethoscope size={18} />} label="My Patients" />
                <SidebarLink to="/doctor/analysis" icon={<Microscope size={18} />} label="Neural Analysis" />
                <SidebarLink to="/doctor/appointments" icon={<Calendar size={18} />} label="Schedule" />
                <SidebarLink to="/doctor/decision" icon={<BrainCircuit size={18} />} label="Decision Support" />
                <SidebarLink to="/notifications" icon={<Bell size={18} />} label="Notifications" />
            </>
        );
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
            <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6">
                <div className="mb-8 flex items-center gap-3 px-2">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-electric-blue text-white shadow-lg shadow-electric-blue/20">
                        <BrainCircuit size={16} />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-sidebar-foreground">NeurAI OS</span>
                </div>

                {/* Only CLINIC role gets the toggle — DOCTOR role does not */}
                {currentUser.role === 'CLINIC' && (
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

                <nav className="flex flex-1 flex-col gap-1">{renderNavLinks()}</nav>

                <div className="mt-auto border-t border-sidebar-border pt-4 space-y-1">
                    <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />
                    <button onClick={toggleTheme} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <LogOut size={18} strokeWidth={1.5} /> Sign out
                    </button>
                </div>
            </aside>

            <main className="ml-64 flex-1">
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-8 backdrop-blur-md">
                    <h2 className="text-sm font-medium tracking-tight text-foreground">
                        {currentUser.role === 'ADMIN' ? 'System Administration' : currentUser.role === 'USER' ? 'Patient Dashboard' : activeView === 'CLINIC' ? 'Facility Management Engine' : 'Clinical Diagnostics Terminal'}
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-blue opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-blue" />
                            </span>
                            System Online
                        </div>
                        <div className="h-8 w-8 rounded-full bg-secondary" />
                    </div>
                </header>
                <div className="p-8"><Outlet /></div>
            </main>
        </div>
    );
};

function SidebarLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
    return (
        <NavLink to={to} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'}`}>
            {icon && <span className="opacity-80">{icon}</span>}
            {label}
        </NavLink>
    );
}

export default PlatformShell;
