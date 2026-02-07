import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Activity, LineChart, Users, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useState, useEffect } from "react";
import { getUserAnalyses } from "@/api/analysisData";
import { useI18n } from '@/lib/i18n';
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [dashboardInfo, setDashboardInfo] = useState([]);
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);
        console.log('[Dashboard] Fetching analyses...');
        const analyses = await getUserAnalyses();
        console.log('[Dashboard] Got analyses:', analyses);
        const analysesArray = Array.isArray(analyses) ? analyses : [];
        setDashboardInfo(analysesArray);

        // Generate chart data from analyses
        const data = analysesArray.slice(0, 12).map((analysis, idx) => ({
          time: `${idx}:00`,
          value: Math.random() * 0.8 + 0.2
        }));
        setChartData(data);
      } catch (err) {
        console.error('[Dashboard] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
        setDashboardInfo([]);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const totalAnalyses = dashboardInfo.length;

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6 w-full">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">{t('common.error')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                {t('common.retry')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 w-full animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">
              {t('dashboard.welcome')}{' '}
              <span className="text-primary drop-shadow-sm">@{user?.username}👋</span>
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Here is what's happening with your brain data today.</p>
          </div>
          <Button className="h-11 px-6 rounded-xl shadow-lg shadow-primary/20">
            <Activity className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full auto-cols-fr">
          {[
            { title: t('dashboard.cards.totalAnalyses'), value: totalAnalyses, icon: Brain, color: 'text-primary' },
            { title: t('dashboard.cards.activities'), value: dashboardInfo.filter((a: any) => a.status === 'completed').length, icon: Activity, color: 'text-emerald-500' },
            { title: t('dashboard.cards.reports'), value: dashboardInfo.filter((a: any) => a.status === 'processing').length, icon: LineChart, color: 'text-amber-500' },
            { title: t('dashboard.cards.sessions'), value: dashboardInfo.filter((a: any) => a.status === 'pending').length, icon: Calendar, color: 'text-indigo-500' },
          ].map((card, i) => (
            <Card key={i} className="group hover:scale-[1.02] transition-transform duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold tracking-tighter">
                    {loading ? (
                      <div className="h-8 w-12 bg-muted animate-pulse rounded-md" />
                    ) : (
                      card.value
                    )}
                  </div>
                  <div className={cn("p-2 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors", card.color)}>
                    <card.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 w-full auto-cols-fr">
          <Card className="lg:col-span-4 w-full overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{t('dashboard.recent.title')}</CardTitle>
              <CardDescription className="text-sm font-medium">{t('dashboard.recent.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData.length > 0 ? chartData : [{ time: 'N/A', value: 0 }]}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      className="text-[10px] font-bold text-muted-foreground/50"
                      tick={{ fill: 'currentColor' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      className="text-[10px] font-bold text-muted-foreground/50"
                      tick={{ fill: 'currentColor' }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(var(--card), 0.8)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      }}
                      itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={4}
                      dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'white' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 w-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{t('dashboard.upcoming.title')}</CardTitle>
              <CardDescription className="text-sm font-medium">{t('dashboard.upcoming.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer group">
                    <div className="mr-4 p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Session #{item}</p>
                      <p className="text-xs font-medium text-muted-foreground">{t('common.tomorrow')}, 2:00 PM</p>
                    </div>
                    <div className="text-[10px] font-black uppercase text-primary bg-primary/5 px-2 py-1 rounded-md">
                      Confirmed
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
