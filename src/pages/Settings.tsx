import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Bell, Shield, Moon, Globe } from 'lucide-react';
import DashboardLayout from "@/components/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import useTheme from '@/hooks/useTheme';
import { useI18n } from '@/lib/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const { user, changePassword, deleteAccount } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    analysisUpdates: true,
    marketingEmails: false
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    fontSize: 'medium',
    reducedMotion: false
  });

  // Language settings
  const [languageSettings, setLanguageSettings] = useState({
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: t('settings.passwordMismatch'),
      });
      return;
    }
    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast({
        title: t('common.success'),
        description: t('settings.passwordChanged'),
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: error.response?.data?.message || t('settings.failedChangePassword'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await deleteAccount(deletePassword);
      toast({
        title: t('common.success'),
        description: t('settings.accountDeleted'),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: error.response?.data?.message || t('settings.failedDeleteAccount'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (key: string) => (checked: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: checked }));
  };

  const { theme, toggleTheme, setTheme } = useTheme();
  const { setLanguage } = useI18n();

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      case 'medium':
      default:
        root.style.fontSize = '16px';
        break;
    }
    localStorage.setItem('appearance:fontSize', size);
  };

  const applyReducedMotion = (reduced: boolean) => {
    const root = document.documentElement;
    if (reduced) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }
    localStorage.setItem('appearance:reducedMotion', reduced ? 'true' : 'false');
  };

  const applyThemeValue = (value: string) => {
    // value: 'light' | 'dark' | 'system'
    // Use useTheme.setTheme to centralize logic
    try {
      (window as any).__setThemeFromSettings?.(value);
    } catch (e) {
      // fallback: apply manually
      if (value === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const newTheme = prefersDark ? 'dark' : 'light';
        const root = document.documentElement;
        if (newTheme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
        localStorage.removeItem('neurai-theme');
      } else {
        const root = document.documentElement;
        if (value === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
        localStorage.setItem('neurai-theme', value);
      }
    }
  };

  const handleAppearanceChange = (key: string, value: any) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'theme') {
      // value can be 'light'|'dark'|'system'
      setTheme(value);
    }
    if (key === 'fontSize') {
      applyFontSize(value);
    }
    if (key === 'reducedMotion') {
      applyReducedMotion(Boolean(value));
    }
    // persist full appearance settings
    try {
      localStorage.setItem('appearance:settings', JSON.stringify({ ...appearanceSettings, [key]: value }));
    } catch (e) {
      // ignore
    }
  };

  const handleLanguageChange = (key: string, value: string) => {
    setLanguageSettings(prev => ({ ...prev, [key]: value }));
    try {
      const next = { ...languageSettings, [key]: value };
      localStorage.setItem('language:settings', JSON.stringify(next));
    } catch (e) {
      // ignore
    }
    // Notify global i18n provider when language changes
    if (key === 'language') {
      try {
        setLanguage(value as any)
      } catch (e) {
        // ignore if provider missing
      }
    }
  };


  // Load persisted appearance settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('appearance:settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fontSize) applyFontSize(parsed.fontSize);
        if (parsed.reducedMotion !== undefined) applyReducedMotion(parsed.reducedMotion === true || parsed.reducedMotion === 'true');
        if (parsed.theme) applyThemeValue(parsed.theme);
        setAppearanceSettings(prev => ({ ...prev, ...parsed }));
        return;
      }

      const fs = localStorage.getItem('appearance:fontSize');
      if (fs) {
        applyFontSize(fs);
        setAppearanceSettings(prev => ({ ...prev, fontSize: fs }));
      }
      const rm = localStorage.getItem('appearance:reducedMotion');
      if (rm) {
        const reduced = rm === 'true';
        applyReducedMotion(reduced);
        setAppearanceSettings(prev => ({ ...prev, reducedMotion: reduced }));
      }
      const th = localStorage.getItem('neurai-theme');
      if (th) {
        // if theme wasn't stored as 'system', map it
        setAppearanceSettings(prev => ({ ...prev, theme: th }));
        applyThemeValue(th);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Load persisted language settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('language:settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setLanguageSettings(prev => ({ ...prev, ...parsed }));
        if (parsed.language) {
          try { setLanguage(parsed.language as any) } catch (e) { }
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full space-y-8 animate-fade-in relative pb-12">
        {/* Ambient Background Blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tighter">{t('settings.title')}</h1>
          <p className="text-muted-foreground font-medium">{t('settings.description')}</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-8">
          <TabsList className="bg-muted/20 border border-border/50 p-1 rounded-2xl h-14 w-full sm:w-auto overflow-x-auto justify-start scrollbar-none flex-nowrap">
            <TabsTrigger value="notifications" className="rounded-xl h-full px-6 transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20">
              <Bell className="h-4 w-4 mr-2" />
              {t('settings.notifications')}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-xl h-full px-6 transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20">
              <Moon className="h-4 w-4 mr-2" />
              {t('settings.appearance')}
            </TabsTrigger>
            <TabsTrigger value="language" className="rounded-xl h-full px-6 transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20">
              <Globe className="h-4 w-4 mr-2" />
              {t('settings.language')}
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl h-full px-6 transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="focus-visible:outline-none">
            <Card className="border-white/5 shadow-premium overflow-hidden bg-card/30 max-w-2xl">
              <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
                <CardTitle className="text-xl font-bold tracking-tight">Notification Channels</CardTitle>
                <CardDescription className="text-sm font-medium">Control how and when you receive neural activity updates.</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                {[
                  { id: 'emailNotifications', label: t('settings.emailNotifications'), desc: t('settings.emailNotificationsDesc') },
                  { id: 'pushNotifications', label: t('settings.pushNotifications'), desc: 'Receive real-time alerts on your device.' },
                  { id: 'analysisUpdates', label: t('settings.analysisUpdates'), desc: 'Get notified as soon as neural analysis completes.' },
                  { id: 'marketingEmails', label: t('settings.marketingEmails'), desc: t('settings.marketingEmailsDesc') }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-muted/20 transition-all border border-transparent hover:border-border/40">
                    <div className="space-y-1">
                      <Label className="text-base font-bold tracking-tight cursor-pointer">{item.label}</Label>
                      <p className="text-xs font-medium text-muted-foreground/80">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={(notificationSettings as any)[item.id]}
                      onCheckedChange={handleNotificationChange(item.id)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="focus-visible:outline-none">
            <Card className="border-white/5 shadow-premium overflow-hidden bg-card/30 max-w-2xl">
              <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
                <CardTitle className="text-xl font-bold tracking-tight">Visual Interface</CardTitle>
                <CardDescription className="text-sm font-medium">Customize your workspace environment and legibility.</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Color Theme</Label>
                    <Select
                      value={appearanceSettings.theme}
                      onValueChange={(value) => handleAppearanceChange('theme', value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="glass-platter">
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System Preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Dynamic Scaling</Label>
                    <Select
                      value={appearanceSettings.fontSize}
                      onValueChange={(value) => handleAppearanceChange('fontSize', value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent className="glass-platter">
                        <SelectItem value="small">Compact</SelectItem>
                        <SelectItem value="medium">Standard</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between group p-3 rounded-2xl hover:bg-muted/20 transition-all border border-transparent hover:border-border/40">
                  <div className="space-y-1">
                    <Label className="text-base font-bold tracking-tight cursor-pointer">Reduced Motion</Label>
                    <p className="text-xs font-medium text-muted-foreground/80">
                      Minimize high-frequency animations for a focused experience.
                    </p>
                  </div>
                  <Switch
                    checked={appearanceSettings.reducedMotion}
                    onCheckedChange={(checked) => handleAppearanceChange('reducedMotion', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="focus-visible:outline-none">
            <Card className="border-white/5 shadow-premium overflow-hidden bg-card/30 max-w-2xl">
              <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
                <CardTitle className="text-xl font-bold tracking-tight">Regional Settings</CardTitle>
                <CardDescription className="text-sm font-medium">Configure your localized experience and data formats.</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Primary Language</Label>
                  <Select
                    value={languageSettings.language}
                    onValueChange={(value) => handleLanguageChange('language', value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="glass-platter">
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value='rw'>Kinyarwanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Date Representation</Label>
                    <Select
                      value={languageSettings.dateFormat}
                      onValueChange={(value) => handleLanguageChange('dateFormat', value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent className="glass-platter">
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">Year-Month-Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Time Chronology</Label>
                    <Select
                      value={languageSettings.timeFormat}
                      onValueChange={(value) => handleLanguageChange('timeFormat', value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent className="glass-platter">
                        <SelectItem value="12h">12-hour Clock</SelectItem>
                        <SelectItem value="24h">24-hour Clock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-1 space-y-8 max-w-2xl">
              <Card className="border-white/5 shadow-premium overflow-hidden bg-card/30">
                <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
                  <CardTitle className="text-xl font-bold tracking-tight">Identity & Access</CardTitle>
                  <CardDescription className="text-sm font-medium">Rotate your access credentials regularly for enhanced security.</CardDescription>
                </CardHeader>
                <CardContent className="pt-8 bg-muted/5">
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('settings.currentPassword')}</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="h-12 rounded-xl bg-muted/20 border-border/50"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('settings.newPassword')}</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="h-12 rounded-xl bg-muted/20 border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('settings.confirmPassword')}</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="h-12 rounded-xl bg-muted/20 border-border/50"
                          />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Account Security
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-red-500/20 shadow-premium overflow-hidden bg-destructive/5">
                <CardHeader className="border-b border-red-500/10 bg-destructive/10 pb-6">
                  <CardTitle className="text-xl font-bold tracking-tight text-destructive">Danger Zone</CardTitle>
                  <CardDescription className="text-sm font-medium text-destructive/70">Permanently terminate your neural profile and purge all data.</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="h-12 px-8 rounded-xl font-bold scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        {t('settings.deleteAccount')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-platter border-destructive/20 max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold tracking-tight text-destructive">Irreversible Termination</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium">
                          {t('settings.deleteAccountWarning')} This will permanently purge your neural history, analytical reports, and saved preferences.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-4 py-6">
                        <div className="space-y-2">
                          <Label htmlFor="deletePassword text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm Identity with Password</Label>
                          <Input
                            id="deletePassword"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="h-12 rounded-xl bg-muted/20 border-border/50 focus:ring-destructive/20"
                          />
                        </div>
                      </div>
                      <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="h-12 rounded-xl font-bold border-border/60">{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={isLoading || !deletePassword}
                          className="h-12 rounded-xl font-bold bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-destructive/20"
                        >
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Confirm Deletion
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
