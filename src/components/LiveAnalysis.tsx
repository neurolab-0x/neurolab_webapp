import DashboardLayout from "@/components/DashboardLayout";
import { generateChartData } from "../data/chartData"; // Import the function
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import GaugeChart from "react-gauge-chart";
import { sampleAnalysisResult } from "../data/sampleData";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Clock, Zap, AlertCircle, Play, Pause, StopCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AnalysisResults from "@/components/AnalysisResults";
import SessionHistory from "@/components/SessionHistory";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type SessionStatus = 'idle' | 'connecting' | 'active' | 'paused' | 'completed' | 'error';
type ReportStatus = 'generating' | 'completed' | 'error';

const LiveAnalysis = () => {
  const navigate = useNavigate();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const [dataPoints, setDataPoints] = useState({
    attention: [] as number[],
    cognitiveLoad: [] as number[],
    mentalFatigue: [] as number[],
    relaxation: [] as number[],
  }); // Simulated real-time data for all cognitive metrics
  const [labels, setLabels] = useState<string[]>([]); // Time labels for x-axis
  const [analysisResult, setAnalysisResult] = useState<any>(null); // Post-capture analysis
  const [error, setError] = useState<string | null>(null);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const maxCaptureTime = 1800; // 30 minutes in seconds
  const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null);
  const [reportProgress, setReportProgress] = useState(0);

  // Simulate real-time EEG data for all cognitive metrics
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStatus === 'active' && elapsedTime < maxCaptureTime) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        setDataPoints((prev) => ({
          attention: [...prev.attention, Math.floor(Math.random() * 100)],
          cognitiveLoad: [...prev.cognitiveLoad, Math.floor(Math.random() * 100)],
          mentalFatigue: [...prev.mentalFatigue, Math.floor(Math.random() * 100)],
          relaxation: [...prev.relaxation, Math.floor(Math.random() * 100)],
        }));
        setLabels((prev) => {
          const time = new Date();
          return [...prev, `${time.getMinutes()}:${time.getSeconds()}`];
        });
      }, 1000); // Update every second
    } else if (elapsedTime >= maxCaptureTime) {
      handleStopSession();
    }
    return () => clearInterval(interval);
  }, [sessionStatus, elapsedTime]);

  // Use the generateChartData function to get chartData
  const chartData = generateChartData(labels, dataPoints);

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        title: { display: true, text: "Value (%)" },
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      title: {
        display: true,
        text: "Live EEG Cognitive Metrics",
        color: 'rgba(255, 255, 255, 0.9)',
      },
    },
  };

  const handleStartSession = () => {
    setSessionStatus('connecting');
    setError(null);
    // Simulate connection delay
    setTimeout(() => {
      setSessionStatus('active');
      setElapsedTime(0);
      setDataPoints({
        attention: [],
        cognitiveLoad: [],
        mentalFatigue: [],
        relaxation: [],
      });
      setLabels([]);
    }, 1500);
  };

  const handlePauseSession = () => {
    setSessionStatus('paused');
  };

  const handleResumeSession = () => {
    setSessionStatus('active');
  };

  const handleStopSession = () => {
    setSessionStatus('completed');
    setShowStopDialog(false);
    setReportStatus('generating');
    setReportProgress(0);

    // Simulate report generation steps
    const steps = [
      { progress: 20, delay: 1000, message: "Processing raw EEG data..." },
      { progress: 40, delay: 1500, message: "Analyzing cognitive patterns..." },
      { progress: 60, delay: 2000, message: "Generating state distribution..." },
      { progress: 80, delay: 1500, message: "Calculating final metrics..." },
      { progress: 100, delay: 1000, message: "Preparing analysis report..." }
    ];

    let currentStep = 0;
    const processStep = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setReportProgress(step.progress);
        setTimeout(() => {
          currentStep++;
          processStep();
        }, step.delay);
      } else {
        // Create enhanced analysis result with session metadata
        const enhancedAnalysisResult = {
          ...sampleAnalysisResult,
          sessionMetadata: {
            duration: elapsedTime,
            dataPoints: elapsedTime * 128,
            signalQuality: "Excellent",
            connectionStatus: "Stable",
            finalMetrics: {
              attention: dataPoints.attention[dataPoints.attention.length - 1] || 0,
              cognitiveLoad: dataPoints.cognitiveLoad[dataPoints.cognitiveLoad.length - 1] || 0,
              mentalFatigue: dataPoints.mentalFatigue[dataPoints.mentalFatigue.length - 1] || 0,
              relaxation: dataPoints.relaxation[dataPoints.relaxation.length - 1] || 0
            },
            timelineData: {
              labels,
              dataPoints
            }
          }
        };
        setAnalysisResult(enhancedAnalysisResult);
        setReportStatus('completed');
      }
    };

    processStep();
  };

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Get the latest value for each gauge
  const latestValues = {
    attention: dataPoints.attention[dataPoints.attention.length - 1] || 0,
    cognitiveLoad: dataPoints.cognitiveLoad[dataPoints.cognitiveLoad.length - 1] || 0,
    mentalFatigue: dataPoints.mentalFatigue[dataPoints.mentalFatigue.length - 1] || 0,
    relaxation: dataPoints.relaxation[dataPoints.relaxation.length - 1] || 0,
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Live EEG Analysis</h1>
            <p className="text-muted-foreground">Real-time monitoring of cognitive metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={sessionStatus === 'active' ? "default" : "secondary"} className="gap-2">
              <Activity className="h-4 w-4" />
              {sessionStatus === 'active' ? 'Live' :
                sessionStatus === 'paused' ? 'Paused' :
                  sessionStatus === 'connecting' ? 'Connecting...' : 'Idle'}
            </Badge>
            {sessionStatus === 'idle' && (
              <Button
                onClick={handleStartSession}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Start Session
              </Button>
            )}
            {sessionStatus === 'active' && (
              <>
                <Button
                  variant="outline"
                  onClick={handlePauseSession}
                  className="gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
                <Dialog open={showStopDialog} onOpenChange={setShowStopDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="gap-2"
                    >
                      <StopCircle className="h-4 w-4" />
                      Stop Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Stop Session?</DialogTitle>
                      <DialogDescription>
                        This will end the current session and generate a final analysis report.
                        Are you sure you want to proceed?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowStopDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleStopSession}>
                        Stop Session
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            {sessionStatus === 'paused' && (
              <Button
                onClick={handleResumeSession}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Resume Session
              </Button>
            )}
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="gap-2"
            >
              Back to Home
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sessionStatus !== 'idle' && sessionStatus !== 'completed' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Session Progress
                      </CardTitle>
                      <CardDescription>
                        {sessionStatus === 'active' ? 'Recording and analyzing in real-time' :
                          sessionStatus === 'paused' ? 'Session paused' : 'Establishing connection...'}
                      </CardDescription>
                    </div>
                    <span className="text-2xl font-bold">{formatTime(elapsedTime)} / 30:00</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={(elapsedTime / maxCaptureTime) * 100} className="h-2" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Signal Quality</span>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">Excellent</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Data Points</span>
                            <span className="font-mono">{elapsedTime * 128}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Connection</span>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">Stable</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {sessionStatus !== 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Attention Score</CardTitle>
                      <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <GaugeChart
                        id="gauge-attention"
                        nrOfLevels={20}
                        percent={latestValues.attention / 100}
                        colors={["#FF5F6D", "#00C49F"]}
                        arcWidth={0.3}
                        textColor="#FFFFFF"
                        needleColor="#FFFFFF"
                      />
                      <div className="text-center mt-2">
                        <span className="text-2xl font-bold">{latestValues.attention}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Cognitive Load</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <GaugeChart
                        id="gauge-cognitive"
                        nrOfLevels={20}
                        percent={latestValues.cognitiveLoad / 100}
                        colors={["#FF5F6D", "#00C49F"]}
                        arcWidth={0.3}
                        textColor="#FFFFFF"
                        needleColor="#FFFFFF"
                      />
                      <div className="text-center mt-2">
                        <span className="text-2xl font-bold">{latestValues.cognitiveLoad}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Mental Fatigue</CardTitle>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <GaugeChart
                        id="gauge-fatigue"
                        nrOfLevels={20}
                        percent={latestValues.mentalFatigue / 100}
                        colors={["#FF5F6D", "#00C49F"]}
                        arcWidth={0.3}
                        textColor="#FFFFFF"
                        needleColor="#FFFFFF"
                      />
                      <div className="text-center mt-2">
                        <span className="text-2xl font-bold">{latestValues.mentalFatigue}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Relaxation Level</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <GaugeChart
                        id="gauge-relaxation"
                        nrOfLevels={20}
                        percent={latestValues.relaxation / 100}
                        colors={["#FF5F6D", "#00C49F"]}
                        arcWidth={0.3}
                        textColor="#FFFFFF"
                        needleColor="#FFFFFF"
                      />
                      <div className="text-center mt-2">
                        <span className="text-2xl font-bold">{latestValues.relaxation}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Live Metrics Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line data={chartData} options={chartOptions} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {reportStatus === 'generating' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Analysis Report
                  </CardTitle>
                  <CardDescription>
                    Please wait while we process your session data and generate insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={reportProgress} className="h-2" />
                  <div className="text-sm text-muted-foreground text-center">
                    {reportProgress < 20 && "Processing raw EEG data..."}
                    {reportProgress >= 20 && reportProgress < 40 && "Analyzing cognitive patterns..."}
                    {reportProgress >= 40 && reportProgress < 60 && "Generating state distribution..."}
                    {reportProgress >= 60 && reportProgress < 80 && "Calculating final metrics..."}
                    {reportProgress >= 80 && "Preparing analysis report..."}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {analysisResult && reportStatus === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <AnalysisResults result={analysisResult} />
            </motion.div>
          )}
        </AnimatePresence>

        <Separator className="my-8" />

      </motion.div>
    </DashboardLayout>
  );
};

export default LiveAnalysis;
