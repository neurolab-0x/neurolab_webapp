import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { requestPasswordReset } from '@/api/auth';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await requestPasswordReset(email);
            setIsSubmitted(true);
            toast({
                title: "Reset link sent",
                description: "If an account exists with this email, you will receive a password reset link.",
            });
        } catch (error: any) {
            console.error('Reset request failed:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to send reset link",
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
                            Reset Password
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    <Card className="border-white/10 shadow-premium overflow-hidden backdrop-blur-xl bg-card/40">
                        <CardContent className="pt-8">
                            {!isSubmitted ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="ml-1">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
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
                                        {isLoading ? "Sending..." : "Send Reset Link"}
                                    </Button>
                                </form>
                            ) : (
                                <div className="text-center space-y-4 py-4">
                                    <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                                        <Mail className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg">Check your inbox</h3>
                                        <p className="text-sm text-muted-foreground">
                                            We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Try another email
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-center border-t border-white/5 bg-black/5 dark:bg-white/5 py-4">
                            <Link
                                to="/login"
                                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
