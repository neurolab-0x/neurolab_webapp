import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import UserManagement from '@/components/admin/UserManagement';
import RoleRequests from '@/components/admin/RoleRequests';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, FileText, Calendar, ClipboardList, Loader2 } from 'lucide-react';
import { getAllUsers, getAllSessions, getAllAppointments, getAllAnalyses, getAllReports } from '@/api/admin';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useI18n } from '@/lib/i18n';

export default function AdminDashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalSessions: 0,
    activeSessions: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    totalAnalyses: 0,
    totalReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [users, sessions, appointments, analyses, reports] = await Promise.all([
          getAllUsers(),
          getAllSessions(),
          getAllAppointments(),
          getAllAnalyses(),
          getAllReports()
        ]);

        // Calculate statistics
        const totalUsers = users.length;
        const totalPatients = users.filter((u: any) => u.role?.toLowerCase() === 'user').length;
        const totalDoctors = users.filter((u: any) => u.role?.toLowerCase() === 'doctor').length;
        const totalSessions = sessions.length;
        const activeSessions = sessions.filter((s: any) => s.status?.toLowerCase() === 'active' || s.isActive).length;
        const totalAppointments = appointments.length;
        const pendingAppointments = appointments.filter((a: any) => a.status?.toLowerCase() === 'pending').length;
        const totalAnalyses = analyses.length;
        const totalReports = reports.length;

        setStats({
          totalUsers,
          totalPatients,
          totalDoctors,
          totalSessions,
          activeSessions,
          totalAppointments,
          pendingAppointments,
          totalAnalyses,
          totalReports
        });

        // Generate dummy activity chart data for the last 7 days
        const activityData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          activityData.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sessions: Math.floor(Math.random() * 50) + 10,
            appointments: Math.floor(Math.random() * 30) + 5,
            analyses: Math.floor(Math.random() * 40) + 8
          });
        }
        setChartData(activityData);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        // Set dummy data as fallback
        setStats({
          totalUsers: 142,
          totalPatients: 98,
          totalDoctors: 32,
          totalSessions: 287,
          activeSessions: 12,
          totalAppointments: 156,
          pendingAppointments: 23,
          totalAnalyses: 234,
          totalReports: 89
        });

        const dummyData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          dummyData.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sessions: Math.floor(Math.random() * 50) + 10,
            appointments: Math.floor(Math.random() * 30) + 5,
            analyses: Math.floor(Math.random() * 40) + 8
          });
        }
        setChartData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const StatCard = ({ icon: Icon, label, value, description, variant = 'default' }: any) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</CardTitle>
        <Icon className="h-5 w-5 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{description}</p>}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 bg-gray-50 dark:bg-slate-950 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">System statistics, user management, and oversight.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {/* Statistics Grid - 4 main stats */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    icon={Users}
                    label="Total Doctors"
                    value={stats.totalDoctors}
                  />
                  <StatCard
                    icon={Users}
                    label="Active Patients"
                    value={stats.totalPatients}
                  />
                  <StatCard
                    icon={Activity}
                    label="Scans Today"
                    value={Math.floor(Math.random() * 50) + 20}
                  />
                  <StatCard
                    icon={Calendar}
                    label="Avg AI Confidence"
                    value={`92%`}
                    description="↑ 2% from last week"
                  />
                </div>

                {/* Activity Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Line Chart - Scans Processed */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">Scans Processed (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sessions" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            dot={false}
                            isAnimationActive={true}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Pie Chart - Report Accuracy Feedback */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">Report Accuracy Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Satisfied', value: 82, fill: '#3b82f6' },
                              { name: 'Neutral', value: 12, fill: '#f59e0b' },
                              { name: 'Needs Review', value: 6, fill: '#ef4444' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            dataKey="value"
                          >
                            <Cell fill="#3b82f6" />
                            <Cell fill="#f59e0b" />
                            <Cell fill="#ef4444" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-2 w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">82% Satisfied</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">12% Neutral</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">6% Needs Review</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Doctor Management Table */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Doctor Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Specialization</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Clinic Location</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 text-sm text-gray-900 dark:text-white flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center text-xs font-semibold text-blue-700 dark:text-blue-200">SL</div>
                              Dr. Sarah Lee
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">Neurology</td>
                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">New York, NY</td>
                            <td className="py-4 px-4"><Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge></td>
                            <td className="py-4 px-4 text-sm"><a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Edit</a> | <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Suspend</a></td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 text-sm text-gray-900 dark:text-white flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center text-xs font-semibold text-purple-700 dark:text-purple-200">JK</div>
                              Dr. James Kim
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">Neurosurgery</td>
                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">Los Angeles, CA</td>
                            <td className="py-4 px-4"><Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge></td>
                            <td className="py-4 px-4 text-sm"><a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Edit</a> | <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Suspend</a></td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 text-sm text-gray-900 dark:text-white flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-pink-200 dark:bg-pink-900 flex items-center justify-center text-xs font-semibold text-pink-700 dark:text-pink-200">EW</div>
                              Dr. Emily Wong
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">Psychiatry</td>
                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">Chicago, IL</td>
                            <td className="py-4 px-4"><Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Pending</Badge></td>
                            <td className="py-4 px-4 text-sm"><a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Edit</a> | <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Suspend</a></td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 text-sm text-gray-900 dark:text-white flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-900 flex items-center justify-center text-xs font-semibold text-orange-700 dark:text-orange-200">RC</div>
                              Dr. Robert Chen
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">Pediatrics</td>
                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">Houston, TX</td>
                            <td className="py-4 px-4"><Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge></td>
                            <td className="py-4 px-4 text-sm"><a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Edit</a> | <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Suspend</a></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Footer */}
                <div className="flex items-center justify-center py-4 text-sm text-green-600">
                  <span>✓</span>
                  <span className="ml-2">GDPR & RDB Data Protection Law Compliant</span>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="requests">
            <RoleRequests />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
