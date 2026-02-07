import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Shield, Loader2, Upload, X, Lock, AlertTriangle, Key, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useI18n } from '@/lib/i18n';

export default function Profile() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n();

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');

  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: t('common.error'),
          description: t('profile.imageTooLarge'),
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: t('common.error'),
          description: t('profile.invalidImage'),
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Only send changed fields
      const updates: any = {};
      
      if (profileData.fullName !== (user?.fullName || '')) {
        updates.fullName = profileData.fullName;
      }
      if (profileData.username !== (user?.username || '')) {
        updates.username = profileData.username;
      }
      if (profileData.email !== (user?.email || '')) {
        updates.email = profileData.email;
      }
      if (selectedImage) {
        updates.avatar = selectedImage;
      }

      // Only send if there are actual changes
      if (Object.keys(updates).length === 0) {
        toast({
          title: "Info",
          description: t('profile.noChanges'),
        });
        setIsLoading(false);
        return;
      }

      await updateProfile(updates);
      toast({
        title: t('common.success'),
        description: t('profile.updated'),
      });
      // Reset image states after successful upload
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: error.response?.data?.message || t('profile.failedUpdate'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: t('profile.passwordMismatch'),
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
        title: t('common.error'),
        description: error.response?.data?.message || t('profile.failedChangePassword'),
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
        description: "Account deleted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: error.response?.data?.message || t('profile.failedDeleteAccount'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-full">
        <div className="flex-1 space-y-6 p-6">
          <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
        <p className="text-muted-foreground">{t('profile.description')}</p>
          </div>

          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personal">
                <User className="h-4 w-4 mr-2" />
                {t('profile.personal')}
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                {t('profile.security')}
              </TabsTrigger>
              <TabsTrigger value="account">
                <Shield className="h-4 w-4 mr-2" />
                {t('profile.account')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.personalInfoTitle')}</CardTitle>
                  <CardDescription>{t('profile.personalInfoDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={imagePreview || profileData.avatar} />
                          <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeSelectedImage}
                          className="text-destructive"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t('profile.fullName')}</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">{t('profile.username')}</Label>
                        <Input
                          id="username"
                          name="username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('profile.email')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('profile.saveChanges')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.security')}</CardTitle>
                  <CardDescription>{t('profile.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
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
                      {t('profile.changePassword')}
                    </Button>
                  </form>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Key className="h-4 w-4" />
                      <span>{t('profile.personalInfoTitle')}: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Two-factor authentication: Not enabled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.account')}</CardTitle>
                  <CardDescription>{t('profile.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Role: {user?.role}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Account Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-destructive">{t('profile.dangerZone')}</h3>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('profile.deleteAccount')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('common.confirmAction')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('common.deleteWarning')} This will permanently delete your account
                            and remove all associated data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4 py-4">
                          <Label htmlFor="deletePassword">{t('profile.enterPasswordConfirm')}</Label>
                          <Input
                            id="deletePassword"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isLoading || !deletePassword}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('profile.deleteAccount')}
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