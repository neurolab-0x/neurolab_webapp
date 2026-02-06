import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Brain, Home, LineChart, History, Settings, LogOut, Upload, Activity, MessageCircle, Bell, HelpCircle, Calendar, User2Icon, Users, BarChart } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const navigation = [
    {
      id: 'dashboard',
      nameKey: 'nav.dashboard',
      href: '/dashboard',
      icon: Home,
      descriptionKey: 'Overview of your brain activity'
    },
    {
      id: 'analysis',
      nameKey: 'nav.analysis',
      href: '/analysis',
      icon: LineChart,
      descriptionKey: 'Detailed analysis of your sessions',
      roles: ['user', 'doctor']
    },
    {
      id: 'live-analysis',
      nameKey: 'nav.liveAnalysis',
      href: '/live-analysis',
      icon: Activity,
      descriptionKey: 'Real-time brain activity monitoring',
      badge: 'New',
      roles: ['user', 'doctor']
    },
    {
      id: 'schedule',
      nameKey: 'nav.schedule',
      href: '/schedule',
      icon: Calendar,
      descriptionKey: 'Schedule your EEG sessions',
      roles: ['user', 'doctor']
    },
    {
      id: 'appointments',
      nameKey: 'nav.appointments',
      href: '/appointments',
      icon: MessageCircle,
      descriptionKey: 'Manage appointment requests'
    },
    {
      id: 'notifications',
      nameKey: 'nav.notifications',
      href: '/notifications',
      icon: Bell,
      descriptionKey: 'View your notifications'
    },
    {
      id: 'history',
      nameKey: 'nav.history',
      href: '/history',
      icon: History,
      descriptionKey: 'View your past sessions'
    },
    {
      id: 'profile',
      nameKey: 'nav.profile',
      href: '/profile',
      icon: User2Icon,
      descriptionKey: 'Manage your profile'
    },
    // Admin-only management links (labels are explicit to ensure distinct names)
    {
      id: 'admin-users',
      nameKey: 'admin.users',
      label: 'Users',
      href: '/admin/users',
      icon: Users,
      descriptionKey: 'Manage users and accounts',
      roles: ['admin']
    },
    {
      id: 'admin-requests',
      nameKey: 'admin.requests',
      label: 'Requests',
      href: '/admin/requests',
      icon: Bell,
      descriptionKey: 'Role change requests',
      roles: ['admin']
    },
    {
      id: 'admin-stats',
      nameKey: 'admin.stats',
      label: 'Statistics',
      href: '/admin/stats',
      icon: BarChart,
      descriptionKey: 'System statistics and analytics',
      roles: ['admin']
    },
    {
      id: 'admin-clinics',
      nameKey: 'admin.clinics',
      label: 'Clinics',
      href: '/admin/clinics',
      icon: Calendar,
      descriptionKey: 'Clinic and hospital management',
      roles: ['admin']
    },
    {
      id: 'admin-onboarding',
      nameKey: 'admin.onboarding',
      label: 'Onboarding',
      href: '/admin/onboarding',
      icon: Users,
      descriptionKey: 'Institution onboarding & hardware linking',
      roles: ['admin']
    },
    {
      id: 'admin-hardware',
      nameKey: 'admin.hardware',
      label: 'Hardware',
      href: '/admin/hardware',
      icon: Upload,
      descriptionKey: 'EEG devices and inventory',
      roles: ['admin']
    },
    {
      id: 'admin-reporting',
      nameKey: 'admin.reporting',
      label: 'Reporting',
      href: '/admin/reports',
      icon: BarChart,
      descriptionKey: 'Reports and RSSB-tariffed reports',
      roles: ['admin']
    },
    {
      id: 'admin-appointments',
      nameKey: 'admin.appointments',
      label: 'Appointments',
      href: '/admin/appointments',
      icon: MessageCircle,
      descriptionKey: 'Appointment oversight',
      roles: ['admin']
    },
    {
      id: 'admin-billing',
      nameKey: 'admin.billing',
      label: 'Billing',
      href: '/admin/billing',
      icon: Users,
      descriptionKey: 'Billing and RSSB adjustments',
      roles: ['admin']
    },
    {
      id: 'admin-monitoring',
      nameKey: 'admin.monitoring',
      label: 'Monitoring',
      href: '/admin/monitoring',
      icon: Activity,
      descriptionKey: 'Facility usage & AI accuracy monitoring',
      roles: ['admin']
    },
    {
      id: 'admin-logs',
      nameKey: 'admin.logs',
      label: 'Logs',
      href: '/admin/logs',
      icon: HelpCircle,
      descriptionKey: 'Audit logs',
      roles: ['admin']
    },
    // Doctor portal link (kept separate)
    {
      id: 'doctor-portal',
      nameKey: 'doctor',
      href: '/doctor',
      icon: Brain,
      descriptionKey: 'Doctor portal',
      roles: ['doctor']
    },
    // Settings
    {
      id: 'settings',
      nameKey: 'nav.settings',
      href: '/settings',
      icon: Settings,
      descriptionKey: 'Configure your preferences'
    },
  ];

  const { t } = useI18n();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        {/* Sidebar with Glass Material */}
        <Sidebar className="border-r border-sidebar-border/50 backdrop-blur-xl bg-sidebar-background">
          <SidebarHeader className="flex flex-row justify-center items-center gap-3 px-6 py-8">
            <div className="p-2 bg-primary/10 rounded-xl shadow-inner">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-sidebar-foreground">NeuroLab</span>
          </SidebarHeader>

          <SidebarContent className="flex-1 flex flex-col gap-1 px-3 py-2 scrollbar-none">
            <SidebarMenu>
              {navigation
                .filter((item) => {
                  if (!item.roles || item.roles.length === 0) return true;
                  const r = (user?.role || '').toString().toLowerCase();
                  return item.roles.map((x: string) => x.toString().toLowerCase()).includes(r);
                })
                .map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.id} className="mb-0.5">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              isActive={isActive}
                              onClick={() => navigate(item.href)}
                              tooltip={item.label ?? t(item.nameKey)}
                              className={cn(
                                "flex items-center gap-3 px-4 py-6 rounded-xl transition-all duration-200 group text-sm font-medium",
                                isActive
                                  ? "bg-primary/10 text-primary shadow-sm"
                                  : "text-sidebar-muted hover:bg-sidebar-hover-bg hover:text-sidebar-foreground"
                              )}
                            >
                              <item.icon className={cn(
                                "h-5 w-5 transition-colors duration-200",
                                isActive ? "text-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                              )} />
                              <span className={cn(isActive && "font-bold")}>{item.label ?? t(item.nameKey)}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-none text-[10px] py-0 h-4">
                                  {item.badge}
                                </Badge>
                              )}
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="glass-platter border-white/10 text-xs">
                            <p className="font-bold">{item.label ?? t(item.nameKey)}</p>
                            <p className="opacity-60">{item.descriptionKey}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarContent>

          <div className="mt-auto px-4 pb-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-sidebar-border bg-sidebar-hover-bg/30 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 group press-effect"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0 bg-background/50 relative">
          {/* Ambient Background Blur for the whole shell */}
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

          <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors" />
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full">
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="glass-platter">Help & Support</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="h-6 w-px bg-border/50 mx-1" />
                <ThemeSwitcher />
              </div>
            </div>
          </header>

          <main className="flex-1 w-full p-6 md:p-8 lg:p-10 overflow-auto scrollbar-thin">
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}