import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { User, Mail, Calendar, Shield } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="w-80 border-l border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm text-muted-foreground">@{user?.username}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Account Status</h3>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Last login</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Analysis completed</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile; 