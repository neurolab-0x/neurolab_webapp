import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Brain, Home, LineChart, History, Settings, LogOut, Upload, Activity, MessageCircle, Bell, HelpCircle } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview of your brain activity'
    },
    {
      name: 'Analysis',
      href: '/analysis',
      icon: LineChart,
      description: 'Detailed analysis of your sessions'
    },
    {
      name: 'Live Analysis',
      href: '/live-analysis',
      icon: Activity,
      description: 'Real-time brain activity monitoring',
      badge: 'New'
    },
    {
      name: 'Chat',
      href: '/chat',
      icon: MessageCircle,
      description: 'AI-powered insights and support'
    },
    {
      name: 'History',
      href: '/history',
      icon: History,
      description: 'View your past sessions'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'Configure your preferences'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="flex items-center gap-2 px-6 py-6 border-b border-border">
            <Brain className="h-7 w-7 text-blue-500 drop-shadow-lg" />
            <span className="text-2xl font-extrabold tracking-tight text-white">Neurolab</span>
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
                          tooltip={item.name}
                          className={`relative flex items-center gap-3 border border-border py-6 rounded-lg font-medium text-base transition-all duration-150
                            ${location.pathname === item.href
                              ? 'bg-blue-600/10 text-blue-500 font-bold border-l-4 border-blue-500 shadow-md'
                              : 'text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 border-l-4 border-transparent'}
                          `}
                        >
                          <item.icon className={`h-5 w-5 transition-colors duration-150 ${location.pathname === item.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'}`} />
                          <span>{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto bg-blue-500/20 text-blue-400">
                              {item.badge}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[200px]">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto px-4 pb-6 pt-2">
            <Button className="w-full mb-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg" onClick={() => navigate('/upload')}>
              <Upload className="mr-2 h-5 w-5" />
              Upload Data
            </Button>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted shadow border border-border/60">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold truncate text-white">{user?.username}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-red-500">
                <LogOut className="h-5 w-5" />
              </Button>
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
                        <Bell className="h-5 w-5" />
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-blue-500 text-[10px]">
                          3
                        </Badge>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Notifications</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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