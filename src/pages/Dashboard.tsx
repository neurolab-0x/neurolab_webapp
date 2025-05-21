import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Activity, LineChart, Users, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart - EEG data with longer intervals
const data = [
  { time: '00:00', value: 0.2 },
  { time: '01:00', value: 0.4 },
  { time: '02:00', value: 0.3 },
  { time: '03:00', value: 0.5 },
  { time: '04:00', value: 0.7 },
  { time: '05:00', value: 0.6 },
  { time: '06:00', value: 0.8 },
  { time: '07:00', value: 0.9 },
  { time: '08:00', value: 0.7 },
  { time: '09:00', value: 0.5 },
  { time: '10:00', value: 0.4 },
  { time: '11:00', value: 0.3 },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 w-full min-w-0 min-h-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your Neurolab control center.</p>
          </div>
          <Button>Upload New Data</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full min-w-0 min-h-0 auto-cols-fr">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">128</div>
                <Brain className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">43</div>
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">24</div>
                <LineChart className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">12</div>
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 w-full min-w-0 min-h-0 auto-cols-fr">
          <Card className="lg:col-span-4 w-full">
            <CardHeader>
              <CardTitle>Recent Analysis</CardTitle>
              <CardDescription>Your latest EEG data processing results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Scheduled data collection</CardDescription>
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
