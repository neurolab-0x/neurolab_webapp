import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { useI18n } from '@/lib/i18n';
import { useState } from "react";
import { motion } from "framer-motion";

interface Session {
  id: string;
  date: string;
  type: string;
  status: 'completed' | 'interrupted' | 'error';
  result: string;
  duration: number;
  metrics: {
    attention: number;
    cognitiveLoad: number;
    mentalFatigue: number;
    relaxation: number;
  };
  dataPoints: number;
  signalQuality: string;
}

const History = () => {
  const [selectedView, setSelectedView] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all');

  // Enhanced sample history data
  const historyItems: Session[] = [
    {
      id: "session-001",
      date: "2024-03-15T10:30:00Z",
      type: "EEG Analysis",
      status: "completed",
      result: "Focused",
      duration: 1800,
      metrics: {
        attention: 85,
        cognitiveLoad: 65,
        mentalFatigue: 30,
        relaxation: 45,
      },
      dataPoints: 230400,
      signalQuality: "Excellent",
    },
    {
      id: "session-002",
      date: "2024-03-14T15:45:00Z",
      type: "Brain Mapping",
      status: "completed",
      result: "Relaxed",
      duration: 1200,
      metrics: {
        attention: 70,
        cognitiveLoad: 45,
        mentalFatigue: 25,
        relaxation: 75,
      },
      dataPoints: 153600,
      signalQuality: "Good",
    },
    {
      id: "session-003",
      date: "2024-03-13T09:15:00Z",
      type: "EEG Analysis",
      status: "interrupted",
      result: "Distracted",
      duration: 900,
      metrics: {
        attention: 45,
        cognitiveLoad: 85,
        mentalFatigue: 60,
        relaxation: 30,
      },
      dataPoints: 115200,
      signalQuality: "Fair",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'interrupted':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'error':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const filteredSessions = historyItems.filter(session => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesSearch = session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.result.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const { t } = useI18n();

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
            <div className="grid grid-cols-1 gap-4">
              {filteredSessions.map((session) => (
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
                          <div className="text-lg font-semibold truncate">Session {session.id}</div>
                          <Badge variant="outline" className={getStatusColor(session.status)}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                            <div>{formatDate(session.date)}</div>
                          </div>
                        </div>
                      </div>

                      {session.reason && (
                        <div className="mt-2 text-sm text-muted-foreground truncate">{session.result} — {session.type}</div>
                      )}

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Attention</div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium w-8">{session.metrics.attention}%</div>
                            <Progress value={session.metrics.attention} className="h-2 flex-1" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Cognitive</div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium w-8">{session.metrics.cognitiveLoad}%</div>
                            <Progress value={session.metrics.cognitiveLoad} className="h-2 flex-1" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Fatigue</div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium w-8">{session.metrics.mentalFatigue}%</div>
                            <Progress value={session.metrics.mentalFatigue} className="h-2 flex-1" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Relax</div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium w-8">{session.metrics.relaxation}%</div>
                            <Progress value={session.metrics.relaxation} className="h-2 flex-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="font-mono">{formatDuration(session.duration)}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Data points</div>
                        <div className="font-mono">{session.dataPoints.toLocaleString()}</div>
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default History;
