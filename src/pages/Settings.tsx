
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, BellRing, MonitorSmartphone } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences.</p>
          </div>
          
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" placeholder="Tell us about yourself" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and security preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input id="currentPassword" type="password" placeholder="Enter current password" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input id="newPassword" type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-t">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Two-factor authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Analysis complete", "New report available", "Data processing updates", "System messages"].map((notification, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-medium">{notification}</h4>
                          <p className="text-sm text-muted-foreground">Receive notifications when {notification.toLowerCase()}</p>
                        </div>
                        <Switch />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="display">
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>Customize your visual experience.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">Theme Preference</h4>
                        <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">Compact Mode</h4>
                        <p className="text-sm text-muted-foreground">Use condensed UI elements</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">High Contrast</h4>
                        <p className="text-sm text-muted-foreground">Increase text and UI contrast</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>NeurAi &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
