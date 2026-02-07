import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { resetPassword } from '@/api/auth';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords do not match",
                description: "Please ensure both passwords are the same.",
            });
            return;
        }

        if (!token) {
            toast({
                variant: "destructive",
                title: "Invalid Link",
                description: "Reset token is missing.",
            });
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, password);
            toast({
                title: "Password Reset Successful",
                description: "You can now log in with your new password.",
            });
            navigate('/login');
        } catch (error: any) {
            console.error('Reset failed:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to reset password",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative">
            {/* Ambient Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-subtle" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-subtle" style={{ animationDelay: '1s' }} />

            <div className="container relative z-10 flex items-center justify-center">
                <div className="mx-auto w-full max-w-[400px]">
                    <div className="flex flex-col space-y-2 text-center mb-6">
                        <h1 className="text-3xl font-bold tracking-tighter">
                            New Password
                        </h1>
                        <p className="text-muted-foreground">
                            Create a new secure password for your account
                        </p>
                    </div>

                    <Card className="border-white/10 shadow-premium overflow-hidden backdrop-blur-xl bg-card/40">
                        <CardContent className="pt-8">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pl-10 bg-muted/30 focus:bg-muted/50 transition-colors"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="pl-10 bg-muted/30 focus:bg-muted/50 transition-colors"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 font-bold shadow-lg shadow-primary/20"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
