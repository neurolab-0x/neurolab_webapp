import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Brain, Home, LineChart, History, Settings, LogOut, Upload, Activity, MessageCircle, Bell, HelpCircle, Calendar, User2Icon } from 'lucide-react';
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

  const navigation = [
    {
      nameKey: 'nav.dashboard',
      href: '/dashboard',
      icon: Home,
      descriptionKey: 'Overview of your brain activity'
    },
    {
      nameKey: 'nav.analysis',
      href: '/analysis',
      icon: LineChart,
      descriptionKey: 'Detailed analysis of your sessions'
    },
    {
      nameKey: 'nav.liveAnalysis',
      href: '/live-analysis',
      icon: Activity,
      descriptionKey: 'Real-time brain activity monitoring',
      badge: 'New'
    },
    {
      nameKey: 'nav.schedule',
      href: '/schedule',
      icon: Calendar,
      descriptionKey: 'Schedule your EEG sessions'
    },
    {
      nameKey: 'nav.appointments',
      href: '/appointments',
      icon: MessageCircle,
      descriptionKey: 'Manage appointment requests'
    },
    {
      nameKey: 'nav.notifications',
      href: '/notifications',
      icon: Bell,
      descriptionKey: 'View your notifications'
    },
    {
      nameKey: 'nav.history',
      href: '/history',
      icon: History,
      descriptionKey: 'View your past sessions'
    },
    {
      nameKey: 'nav.profile',
      href: '/profile',
      icon: User2Icon,
      descriptionKey: 'Manage your profile'
    },
    {
      nameKey: 'nav.settings',
      href: '/settings',
      icon: Settings,
      descriptionKey: 'Configure your preferences'
    }
  ];

  const { t } = useI18n();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="flex flex-row justify-center items-center gap-2 px-6 py-4">
            <span className="text-2xl font-extrabold tracking-tight text-[hsl(var(--sidebar-foreground))]">Neurolab</span>
          </SidebarHeader>
          <SidebarContent className="flex-1 flex flex-col gap-2 px-2 py-4">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                          <SidebarMenuButton
                            isActive={location.pathname === item.href}
                            onClick={() => navigate(item.href)}
                            tooltip={t(item.nameKey)}
                          className={`relative flex items-center gap-3 border py-6 rounded-lg font-medium text-base transition-all duration-150
                            ${location.pathname === item.href
                              ? 'bg-[hsl(var(--sidebar-active-bg))] text-[hsl(var(--sidebar-primary))] font-bold border-l-4 border-[hsl(var(--sidebar-primary))] shadow-sm'
                              : 'text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-hover-bg))] hover:text-[hsl(var(--sidebar-primary))] border-l-4 border-transparent'}
                          `}
                        >
                          <item.icon className={`h-5 w-5 transition-colors duration-150 ${location.pathname === item.href ? 'text-[hsl(var(--sidebar-primary))]' : 'text-[hsl(var(--sidebar-muted))] group-hover:text-[hsl(var(--sidebar-primary))]'}`} />
                            <span>{t(item.nameKey)}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto bg-blue-500/20 text-blue-400">
                              {item.badge}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[200px]">
                        <p className="font-medium">{t(item.nameKey)}</p>
                        <p className="text-xs text-muted-foreground">{item.descriptionKey}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto px-4 pb-4 cursor-pointer" onClick={() => handleLogout()}>
            <div className="flex flex-row justify-center items-center gap-4 py-4 rounded-xl bg-[hsl(var(--sidebar-hover-bg))] text-[hsl(var(--sidebar-muted))] shadow-sm border border-[hsl(var(--sidebar-border))] hover:bg-red-500/10 hover:text-red-500 transition-colors duration-150">
                <LogOut className="w-5 h-5"/>
                <span>Logout</span>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger />
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400">
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Help & Support</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <ThemeSwitcher />
              </div>
            </div>
          </header>

          <main className="flex-1 w-full p-2 md:p-4 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}