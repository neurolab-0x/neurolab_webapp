import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Eye, EyeOff, FileText, MessageCircle } from "lucide-react";

const Private = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "neuraitest") {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <DashboardLayout>
      {!authenticated ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle>Private Area</CardTitle>
              <CardDescription>Enter your password to access private content</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuthenticate}>
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full">Access Private Area</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Private Area</h1>
            <p className="text-muted-foreground">Your confidential data and documents.</p>
          </div>

          <Tabs defaultValue="documents">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="documents">Private Documents</TabsTrigger>
              <TabsTrigger value="messages">Secure Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <Card key={item} className="neural-card-hover">
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <div className="mr-3 p-2 bg-primary/10 rounded">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Confidential Report #{item}</CardTitle>
                          <CardDescription>Last updated: April {item + 10}, 2025</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        This document contains private EEG analysis data and personal health information.
                      </p>
                      <Button variant="outline" size="sm">View Document</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Secure Messages</CardTitle>
                  <CardDescription>End-to-end encrypted communications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-start p-4 border rounded-lg">
                        <div className="mr-3 p-2 bg-primary/10 rounded-full">
                          <MessageCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium">Dr. Smith</h4>
                            <span className="text-xs text-muted-foreground ml-2">
                              April {item + 15}, 2025
                            </span>
                          </div>
                          <p className="text-sm mt-1">
                            Your latest EEG results show significant improvement in the focused state.
                            Let's discuss this in our next session.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex">
                    <Input placeholder="Type a secure message..." className="mr-2" />
                    <Button>Send</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Private;
