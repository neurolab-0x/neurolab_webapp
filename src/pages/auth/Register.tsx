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

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 8 characters long",
      });
      return false;
    }

    if (!formData.email.includes('@')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid email address",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });
      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      });
      navigate("/login");
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to register",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative">
      {/* Ambient Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-subtle" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-subtle" style={{ animationDelay: '1s' }} />

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
        <div className="lg:p-4 flex items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
            <div className="flex flex-col space-y-2 text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <img src="/logo1.png" alt="neurolab's logo" className='size-12 filter drop-shadow-xl' />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter text-foreground">
                {t('register.title')}
              </h1>
              <p className="text-muted-foreground font-medium">
                {t('register.subtitle')}
              </p>
            </div>

            <Card className="border-white/10 shadow-premium overflow-hidden">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs font-semibold ml-1">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-muted/30 focus:bg-muted/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs font-semibold ml-1">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-muted/30 focus:bg-muted/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-xs font-semibold ml-1">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="bg-muted/30 focus:bg-muted/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold ml-1">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-muted/30 focus:bg-muted/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-semibold ml-1">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="bg-muted/30 focus:bg-muted/50 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
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
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold ml-1">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="bg-muted/30 focus:bg-muted/50 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 border-t border-white/5 bg-black/5 dark:bg-white/5 py-6">
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-primary hover:underline">
                    Sign in
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