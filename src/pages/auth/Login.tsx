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
  <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#030329]">
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
          <div className="absolute inset-0">
            <img 
              src="/brain-scan.jpg" 
              alt="Brain scan visualization" 
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/80 to-blue-800/70" />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src="/logo.png" alt="neurolab's logo" className='size-12 mr-2' />
            <span className="text-xl font-bold">Neurolab Inc.</span>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-4">
              <p className="text-2xl leading-relaxed">
                "Join our community of researchers and healthcare professionals using Neurolab's cutting-edge neural analysis platform."
              </p>
              <footer className="text-sm opacity-80">Neurolab Team</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <img src="/logo.png" alt="neurolab's logo" className='size-16' />
                <h1 className="text-2xl font-semibold tracking-tight text-foreground dark:text-white">
                  {t('login.welcome')}
                </h1>
              </div>
              <p className="text-sm text-gray-400">
                {t('login.subtitle')}
              </p>
            </div>

            <Card className="bg-transparent border-none backdrop-blur-md bg-opacity-10">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground dark:text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-transparent border-[#3A3A3A] text-foreground dark:text-white placeholder:text-gray-500 backdrop-blur-sm bg-opacity-5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground dark:text-gray-300">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-transparent border-[#3A3A3A] text-foreground dark:text-white placeholder:text-gray-500 backdrop-blur-sm bg-opacity-5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-500 hover:text-blue-400"
                    >
                      {t('login.forgot')}
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : t('login.signin')}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t border-[#2A2A2A] pt-6">
                <p className="text-sm text-gray-400 text-center">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-500 hover:text-blue-400">
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