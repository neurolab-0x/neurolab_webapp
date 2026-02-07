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
      toast.error(error?.message || t('history.failedFetch'));
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
      <div className="w-full space-y-8 animate-fade-in relative">
        {/* Ambient Background Blur */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter">{t('history.title')}</h1>
            <p className="text-muted-foreground font-medium">{t('history.description')}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 rounded-xl font-bold border-border/60 hover:bg-primary/5 transition-all">
              <Download className="h-4 w-4 mr-2" />
              {t('common.export')}
            </Button>
            <Button variant="ghost" className="h-11 rounded-xl font-bold text-muted-foreground hover:text-primary transition-all">
              <Share2 className="h-4 w-4 mr-2" />
              {t('common.share')}
            </Button>
          </div>
        </div>

        <Card className="border-white/5 shadow-premium overflow-hidden bg-card/30">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-11 w-full md:w-[180px] rounded-xl bg-muted/20 border-border/50">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="glass-platter">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="interrupted">Interrupted</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="h-11 w-full md:w-[160px] rounded-xl bg-muted/20 border-border/50">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent className="glass-platter">
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground opacity-50" />
                  <Input
                    placeholder="Search session ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-10 w-full md:w-[320px] rounded-xl bg-muted/20 border-border/50 focus:ring-primary/20"
                  />
                </div>

                <div className="hidden md:flex items-center gap-2 p-1 bg-muted/20 rounded-xl border border-border/50">
                  <Button
                    variant={selectedView === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setSelectedView('list')}
                    className="h-9 w-9 rounded-lg"
                  >
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedView === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setSelectedView('grid')}
                    className="h-9 w-9 rounded-lg"
                  >
                    <PieChart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading history...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="p-6 bg-muted/50 rounded-full">
                  <CalendarClock className="h-12 w-12 text-muted-foreground opacity-20" />
                </div>
                <p className="text-lg font-bold text-muted-foreground/60 uppercase tracking-widest">{t('history.noSessions')}</p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {filteredSessions.map((session, idx) => {
                  const startDate = new Date(session.startTime);
                  const endDate = new Date(session.endTime || new Date());
                  const durationSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
                  const statusDisplay = String(session.status || 'PENDING').charAt(0).toUpperCase() + String(session.status || 'PENDING').slice(1).toLowerCase();

                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group hover:bg-primary/[0.02] transition-colors"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6">
                        <div className="flex-1 min-w-0 space-y-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="text-xl font-bold tracking-tight">Session <span className="text-primary">{session.id.slice(-8).toUpperCase()}</span></div>
                              <Badge className={cn(
                                "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter border-none",
                                getStatusColor(session.status)
                              )}>
                                {statusDisplay}
                              </Badge>
                            </div>

                            <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                              <div className="flex items-center gap-2">
                                <CalendarClock className="h-4 w-4 text-primary opacity-50" />
                                <div>{formatDate(session.startTime)}</div>
                              </div>
                            </div>
                          </div>

                          {session.analysisResults && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                              {[
                                { label: 'Attention', value: session.analysisResults.attention, color: 'bg-primary' },
                                { label: 'Cognitive', value: session.analysisResults.cognitiveLoad, color: 'bg-emerald-500' },
                                { label: 'Fatigue', value: session.analysisResults.mentalFatigue, color: 'bg-amber-500' },
                                { label: 'Relax', value: session.analysisResults.relaxation, color: 'bg-indigo-500' }
                              ].map((metric, i) => metric.value !== undefined && (
                                <div key={i} className="space-y-1.5">
                                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                    <span>{metric.label}</span>
                                    <span>{Math.round(metric.value)}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${metric.value}%` }}
                                      transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                                      className={cn("h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]", metric.color)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:border-l border-border/40 md:pl-8">
                          <div className="text-left md:text-right">
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Duration</div>
                            <div className="font-mono text-lg font-bold">{formatDuration(durationSeconds)}</div>
                          </div>

                          <Button variant="outline" className="h-10 rounded-xl px-4 font-bold border-border/60 hover:bg-primary/5 group-hover:border-primary/40 group-hover:text-primary transition-all">
                            View Report
                            <ChevronRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                          </Button>
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
