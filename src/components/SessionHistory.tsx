import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CalendarClock,
  ChevronRight,
  Download,
  Share2,
  Search,
  BarChart2,
  PieChart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Session {
  id: string;
  timestamp: string;
  duration: number;
  dominantState: string;
  confidence: number;
  metrics: {
    attention: number;
    cognitiveLoad: number;
    mentalFatigue: number;
    relaxation: number;
  };
  status: 'completed' | 'interrupted' | 'error';
  dataPoints: number;
  signalQuality: string;
}

// Mock data for demonstration
const mockSessions: Session[] = [
  {
    id: "session-001",
    timestamp: "2024-03-15T10:30:00Z",
    duration: 1800,
    dominantState: "Focused",
    confidence: 0.89,
    metrics: {
      attention: 85,
      cognitiveLoad: 65,
      mentalFatigue: 30,
      relaxation: 45,
    },
    status: 'completed',
    dataPoints: 230400,
    signalQuality: "Excellent",
  },
  {
    id: "session-002",
    timestamp: "2024-03-14T15:45:00Z",
    duration: 1200,
    dominantState: "Relaxed",
    confidence: 0.92,
    metrics: {
      attention: 70,
      cognitiveLoad: 45,
      mentalFatigue: 25,
      relaxation: 75,
    },
    status: 'completed',
    dataPoints: 153600,
    signalQuality: "Good",
  },
  {
    id: "session-003",
    timestamp: "2024-03-13T09:15:00Z",
    duration: 900,
    dominantState: "Distracted",
    confidence: 0.78,
    metrics: {
      attention: 45,
      cognitiveLoad: 85,
      mentalFatigue: 60,
      relaxation: 30,
    },
    status: 'interrupted',
    dataPoints: 115200,
    signalQuality: "Fair",
  },
];

const SessionHistory = () => {
  const [selectedView, setSelectedView] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all');

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

  const filteredSessions = mockSessions.filter(session => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesSearch = session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.dominantState.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Session History</h2>
          <p className="text-muted-foreground">View and analyze your past EEG sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="interrupted">Interrupted</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>
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
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="mt-6">
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">Session {session.id}</h3>
                              <Badge variant="outline" className={getStatusColor(session.status)}>
                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarClock className="mr-2 h-4 w-4" />
                              {formatDate(session.timestamp)}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Duration</div>
                              <div className="font-mono">{formatDuration(session.duration)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Data Points</div>
                              <div className="font-mono">{session.dataPoints.toLocaleString()}</div>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-2">
                              View Details
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Attention</span>
                              <span className="font-medium">{session.metrics.attention}%</span>
                            </div>
                            <Progress value={session.metrics.attention} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Cognitive Load</span>
                              <span className="font-medium">{session.metrics.cognitiveLoad}%</span>
                            </div>
                            <Progress value={session.metrics.cognitiveLoad} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Mental Fatigue</span>
                              <span className="font-medium">{session.metrics.mentalFatigue}%</span>
                            </div>
                            <Progress value={session.metrics.mentalFatigue} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Relaxation</span>
                              <span className="font-medium">{session.metrics.relaxation}%</span>
                            </div>
                            <Progress value={session.metrics.relaxation} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    Analytics view coming soon...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    Insights view coming soon...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionHistory; 