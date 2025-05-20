import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, LineChart, Zap, Shield } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Advanced Analysis',
      description: 'State-of-the-art neural analysis tools powered by cutting-edge AI technology.',
    },
    {
      icon: LineChart,
      title: 'Real-time Monitoring',
      description: 'Monitor neural activity in real-time with our advanced visualization tools.',
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Lightning-fast data processing and analysis for immediate insights.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-muted">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">NeuroLab</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Advanced neural analysis platform for researchers and healthcare professionals.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-6 rounded-lg border bg-card"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">NeuroLab</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NeuroLab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
