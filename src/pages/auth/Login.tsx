import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Brain } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
      // Force navigation after successful login
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to login",
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

      <div className="container relative z-10 h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
          <div className="absolute inset-0 overflow-hidden rounded-r-3xl">
            <img
              src="/brain-scan.jpg"
              alt="Brain scan visualization"
              className="h-full w-full object-cover opacity-20 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src="/logo.png" alt="neurolab's logo" className='size-12 mr-2 filter drop-shadow-lg' />
            <span className="text-xl font-bold tracking-tight">Neurolab Inc.</span>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-4">
              <p className="text-3xl font-medium leading-tight tracking-tight">
                "Join our community of researchers and healthcare professionals using Neurolab's cutting-edge neural analysis platform."
              </p>
              <footer className="text-sm opacity-60">Neurolab Team</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 flex items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img src="/logo1.png" alt="neurolab's logo" className='size-14 filter drop-shadow-xl' />
              </div>
              <h1 className="text-4xl font-bold tracking-tighter text-foreground decoration-primary/30">
                {t('login.welcome')}
              </h1>
              <p className="text-muted-foreground font-medium">
                {t('login.subtitle')}
              </p>
            </div>

            <Card className="border-white/10 shadow-premium overflow-hidden">
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-sm font-semibold ml-1">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-muted/30 focus:bg-muted/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="password" className="text-sm font-semibold ml-1">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-muted/30 focus:bg-muted/50 transition-colors"
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
                  <div className="flex items-center justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      {t('login.forgot')}
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : t('login.signin')}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t border-white/5 bg-black/5 dark:bg-white/5 py-6">
                <p className="text-sm text-muted-foreground text-center">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-primary hover:underline">
                    Create an account
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 