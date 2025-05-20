import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Brain, Home, LineChart, History, Settings, LogOut, Upload, Activity } from 'lucide-react';
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

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analysis', href: '/analysis', icon: LineChart },
    { name: 'Live Analysis', href: '/live-analysis', icon: Activity },
    { name: 'History', href: '/history', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="flex items-center gap-2 px-4 py-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">NeuroLab</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.href}
                    onClick={() => navigate(item.href)}
                    tooltip={item.name}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-4">
            <Button className="w-full mb-4" onClick={() => navigate('/upload')}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Data
            </Button>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger />
              <div className="flex-1" />
              <ThemeSwitcher />
            </div>
          </header>

          <main className="flex-1 w-full p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 