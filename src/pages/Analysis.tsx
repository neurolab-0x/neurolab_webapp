import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, BarChart2, Brain, Activity, Play, Pause, StopCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AnalysisResults from "@/components/AnalysisResults";
import { AnalysisResult } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for demonstration
const mockAnalysisResult: AnalysisResult = {
  id: "analysis-123",
  timestamp: new Date().toISOString(),
  dominantState: "focused",
  confidence: 0.89,
  stateDistribution: {
    focused: 45,
    relaxed: 30,
    distracted: 15,
    neutral: 10
  },
  cognitiveMetrics: [
    {
      name: "Attention Level",
      value: 85,
      unit: "%",
      threshold: { min: 0, max: 100 }
    },
    {
      name: "Mental Load",
      value: 65,
      unit: "%",
      threshold: { min: 0, max: 100 }
    },
    {
      name: "Cognitive Performance",
      value: 78,
      unit: "%",
      threshold: { min: 0, max: 100 }
    },
    {
      name: "Stress Level",
      value: 35,
      unit: "%",
      threshold: { min: 0, max: 100 }
    }
  ],
  clinicalRecommendations: [
    "Consider taking short breaks every 45 minutes to maintain optimal focus",
    "Your attention levels are highest in the morning - schedule important tasks accordingly",
    "Practice mindfulness exercises to reduce stress levels during high-intensity periods",
    "Maintain regular sleep patterns to improve cognitive performance"
  ],
  processingMetadata: {
    model: "NeuralLab v2.1",
    version: "2.1.0",
    processingTime: 3.5
  }
};

type SessionStatus = 'idle' | 'connecting' | 'active' | 'paused' | 'completed' | 'error';

const Analysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Simulate live session progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStatus === 'active') {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
        setSessionProgress(prev => Math.min(prev + 0.5, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStatus]);

  const handleFileUpload = () => {
    setIsAnalyzing(true);
    setError(null);
    // Simulate analysis process
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleStartSession = () => {
    setSessionStatus('connecting');
    setError(null);
    // Simulate connection delay
    setTimeout(() => {
      setSessionStatus('active');
      setSessionProgress(0);
      setSessionDuration(0);
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
    // Simulate final analysis
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Analysis</h1>
            <p className="text-muted-foreground">Upload and analyze your EEG data for cognitive insights.</p>
          </div>
          <div className="flex items-center gap-3">
            {sessionStatus === 'idle' && (
              <Button
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors"
                onClick={handleStartSession}
              >
                <Play className="h-4 w-4" />
                Start Live Session
              </Button>
            )}
            {sessionStatus === 'active' && (
              <>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handlePauseSession}
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={handleStopSession}
                >
                  <StopCircle className="h-4 w-4" />
                  Stop Session
                </Button>
              </>
            )}
            {sessionStatus === 'paused' && (
              <Button
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors"
                onClick={handleResumeSession}
              >
                <Play className="h-4 w-4" />
                Resume Session
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sessionStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        Live Session
                        <Badge variant={sessionStatus === 'active' ? 'default' : 'secondary'}>
                          {sessionStatus === 'active' ? 'Active' : sessionStatus === 'paused' ? 'Paused' : 'Connecting...'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {sessionStatus === 'active' ? 'Recording and analyzing in real-time' :
                          sessionStatus === 'paused' ? 'Session paused' : 'Establishing connection...'}
                      </CardDescription>
                    </div>
                    {sessionStatus === 'active' && (
                      <div className="text-2xl font-mono font-bold">
                        {formatDuration(sessionDuration)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={sessionProgress} className="h-2" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Signal Quality</span>
                            <Badge variant="outline">Excellent</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Data Points</span>
                            <span className="font-mono">{sessionDuration * 128}</span>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attention</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+4% from baseline</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 live, 1 scheduled</p>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Analysis Tools</CardTitle>
            <CardDescription>Upload your EEG data or view previous analysis results.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="flex items-center gap-2"
                  disabled={!analysisResult}
                >
                  <FileText className="h-4 w-4" />
                  Results
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload your EEG data</h3>
                  <p className="text-muted-foreground mb-4">Drag and drop your files here, or click to browse</p>
                  <Button
                    variant="outline"
                    onClick={handleFileUpload}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Select Files"
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="results" className="mt-6">
                <AnimatePresence mode="wait">
                  {analysisResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <AnalysisResults result={analysisResult} />
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Your analysis results will appear here.</p>
                    </div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Analysis;
