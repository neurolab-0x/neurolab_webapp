import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Activity, LineChart, Users, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useState, useEffect } from "react";
import { getUserAnalyses } from "@/api/analysisData";
import { useI18n } from '@/lib/i18n';

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
      <div className="space-y-6 w-full min-w-0 min-h-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div>
            <h1 className="text-4xl font-bold">{t('dashboard.welcome')} <span className="text-primary">@{user?.username}👋</span></h1>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full min-w-0 min-h-0 auto-cols-fr">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.cards.totalAnalyses')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{loading ? '...' : totalAnalyses}</div>
                <Brain className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.cards.activities')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{loading ? '...' : dashboardInfo.filter((a: any) => a.status === 'completed').length}</div>
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.cards.reports')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{loading ? '...' : dashboardInfo.filter((a: any) => a.status === 'processing').length}</div>
                <LineChart className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.cards.sessions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{loading ? '...' : dashboardInfo.filter((a: any) => a.status === 'pending').length}</div>
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 w-full min-w-0 min-h-0 auto-cols-fr">
          <Card className="lg:col-span-4 w-full">
            <CardHeader>
              <CardTitle>{t('dashboard.recent.title')}</CardTitle>
              <CardDescription>{t('dashboard.recent.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData.length > 0 ? chartData : [{ time: 'N/A', value: 0 }]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="time"
                      className="text-xs text-muted-foreground"
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis
                      className="text-xs text-muted-foreground"
                      tick={{ fill: 'currentColor' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 w-full">
            <CardHeader>
              <CardTitle>{t('dashboard.upcoming.title')}</CardTitle>
              <CardDescription>{t('dashboard.upcoming.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center p-3 border rounded-md">
                    <div className="mr-3 p-2 bg-primary/10 rounded">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Session #{item}</p>
                      <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</p>
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
