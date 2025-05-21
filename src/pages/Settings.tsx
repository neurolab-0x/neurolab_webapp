import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, BellRing, MonitorSmartphone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Profile from "@/components/Profile";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="flex h-full">
        <div className="flex-1 space-y-6 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences and account settings.</p>
          </div>

          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[300px]">
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <MonitorSmartphone className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and account security preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Login Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified when someone logs into your account.</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <Button>Update Security Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you want to receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Analysis Results</Label>
                        <p className="text-sm text-muted-foreground">Get notified when your analysis is complete.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Updates</Label>
                        <p className="text-sm text-muted-foreground">Receive updates about new features and improvements.</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize how the application looks and feels.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">Reduce spacing and padding for a more compact view.</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Profile />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
