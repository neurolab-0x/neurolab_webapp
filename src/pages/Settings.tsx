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
        title: "Error",
        description: "New passwords do not match",
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
        title: "Success",
        description: "Password changed successfully.",
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
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
        title: "Success",
        description: "Account deleted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete account",
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
          try { setLanguage(parsed.language as any) } catch (e) {}
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="flex h-full">
        <div className="flex-1 space-y-6 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences and account settings.</p>
          </div>

          <Tabs defaultValue="notifications" className="space-y-4">
            <TabsList>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Moon className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="language">
                <Globe className="h-4 w-4 mr-2" />
                Language
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={handleNotificationChange('emailNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={handleNotificationChange('pushNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Analysis Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about analysis results
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.analysisUpdates}
                      onCheckedChange={handleNotificationChange('analysisUpdates')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={handleNotificationChange('marketingEmails')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize how the app looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={appearanceSettings.theme}
                      onValueChange={(value) => handleAppearanceChange('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select
                      value={appearanceSettings.fontSize}
                      onValueChange={(value) => handleAppearanceChange('fontSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce motion in animations
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

            <TabsContent value="language">
              <Card>
                <CardHeader>
                  <CardTitle>Language Settings</CardTitle>
                  <CardDescription>Customize your language preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={languageSettings.language}
                      onValueChange={(value) => handleLanguageChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select
                      value={languageSettings.dateFormat}
                      onValueChange={(value) => handleLanguageChange('dateFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select
                      value={languageSettings.timeFormat}
                      onValueChange={(value) => handleLanguageChange('timeFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Change Password
                    </Button>
                  </form>

                  <div className="pt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all associated data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4 py-4">
                          <Label htmlFor="deletePassword">Enter your password to confirm</Label>
                          <Input
                            id="deletePassword"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isLoading || !deletePassword}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
