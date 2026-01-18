import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Search,
  BarChart2,
  PieChart,
  ChevronRight,
  CalendarClock,
  Share2,
  Loader2,
} from "lucide-react";
import { useI18n } from '@/lib/i18n';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getUserSessions, getSessionResults } from "@/api/history";
import type { Session } from "@/api/history";

const History = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all');

  const { t } = useI18n();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const data = await getUserSessions();
      setSessions(data);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch session history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'INTERRUPTED':
      case 'interrupted':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'ERROR':
      case 'error':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const filteredSessions = sessions.filter(session => {
    const statusLower = String(session.status || '').toLowerCase();
    const matchesStatus = filterStatus === 'all' || statusLower === filterStatus;
    const matchesSearch = session.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply time range filter
    if (selectedTimeRange !== 'all') {
      const sessionDate = new Date(session.startTime);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (selectedTimeRange === 'today' && daysDiff > 0) return false;
      if (selectedTimeRange === 'week' && daysDiff > 7) return false;
      if (selectedTimeRange === 'month' && daysDiff > 30) return false;
    }
    
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold">{t('history.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('history.description')}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="interrupted">Interrupted</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full md:w-[280px]"
                  />
                </div>

                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant={selectedView === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedView('list')}
                  >
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedView === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedView('grid')}
                  >
                    <PieChart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">No sessions found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredSessions.map((session) => {
                  const startDate = new Date(session.startTime);
                  const endDate = new Date(session.endTime || new Date());
                  const durationSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
                  const statusDisplay = String(session.status || 'PENDING').charAt(0).toUpperCase() + String(session.status || 'PENDING').slice(1).toLowerCase();
                  
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg border hover:shadow-md transition">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="text-lg font-semibold truncate">Session {session.id.slice(-8)}</div>
                              <Badge variant="outline" className={getStatusColor(session.status)}>
                                {statusDisplay}
                              </Badge>
                            </div>

                            <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                <div>{formatDate(session.startTime)}</div>
                              </div>
                            </div>
                          </div>

                          {session.type && (
                            <div className="mt-2 text-sm text-muted-foreground truncate">{session.type}</div>
                          )}

                          {session.analysisResults && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {session.analysisResults.attention !== undefined && (
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">Attention</div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium w-8">{Math.round(session.analysisResults.attention)}%</div>
                                    <Progress value={session.analysisResults.attention} className="h-2 flex-1" />
                                  </div>
                                </div>
                              )}

                              {session.analysisResults.cognitiveLoad !== undefined && (
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">Cognitive</div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium w-8">{Math.round(session.analysisResults.cognitiveLoad)}%</div>
                                    <Progress value={session.analysisResults.cognitiveLoad} className="h-2 flex-1" />
                                  </div>
                                </div>
                              )}

                              {session.analysisResults.mentalFatigue !== undefined && (
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">Fatigue</div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium w-8">{Math.round(session.analysisResults.mentalFatigue)}%</div>
                                    <Progress value={session.analysisResults.mentalFatigue} className="h-2 flex-1" />
                                  </div>
                                </div>
                              )}

                              {session.analysisResults.relaxation !== undefined && (
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">Relax</div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium w-8">{Math.round(session.analysisResults.relaxation)}%</div>
                                    <Progress value={session.analysisResults.relaxation} className="h-2 flex-1" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Duration</div>
                            <div className="font-mono">{formatDuration(durationSeconds)}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              View
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default History;
