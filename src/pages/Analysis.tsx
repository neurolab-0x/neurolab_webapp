import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
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
import { useI18n } from '@/lib/i18n';

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
    model: "NeurAI v2.1",
    version: "2.1.0",
    processingTime: 3.5
  }
};

type SessionStatus = 'idle' | 'connecting' | 'active' | 'paused' | 'completed' | 'error';

const Analysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();
  const { toast } = useToast();

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

  const handleFileUpload = async () => {
    setIsAnalyzing(true);
    setError(null);

    // For now we simulate an upload and call the backend createAnalysis API
    try {
      // Construct payload - in a real flow this would be based on the uploaded file
      const payload = {
        deviceId: '123e4567-e89b-12d3-a456-426614174000',
        type: 'EEG',
        parameters: {
          samplingRate: 256,
          duration: 300,
          channels: ['Fp1', 'Fp2', 'C3', 'C4']
        }
      };

      const { createAnalysis } = await import('@/api/analysis');
      const backendAnalysis = await createAnalysis(payload as any);

      // Map backend response to AnalysisResult shape if necessary
      const analysisResultFromBackend: AnalysisResult = {
        id: backendAnalysis.id || backendAnalysis._id || 'unknown',
        timestamp: backendAnalysis.createdAt || new Date().toISOString(),
        dominantState: backendAnalysis.dominantState || 'unknown',
        confidence: backendAnalysis.confidence ?? 0,
        stateDistribution: backendAnalysis.stateDistribution || {},
        cognitiveMetrics: backendAnalysis.cognitiveMetrics || [],
        clinicalRecommendations: backendAnalysis.clinicalRecommendations || [],
        processingMetadata: backendAnalysis.processingMetadata || {
          model: backendAnalysis.model || 'unknown',
          version: backendAnalysis.version || 'unknown',
          processingTime: backendAnalysis.processingTime || 0
        },
        ...backendAnalysis
      };

      setAnalysisResult(analysisResultFromBackend);
      setActiveTab('results');
      toast({ title: 'Analysis submitted', description: 'Analysis created on the backend and results are available.' });
    } catch (err: any) {
      setError(err.message || 'Failed to run analysis');
    } finally {
      setIsAnalyzing(false);
    }
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
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('analysis.title')}</CardTitle>
            <CardDescription>{t('analysis.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {t('analysis.upload')}
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="flex items-center gap-2"
                  disabled={!analysisResult}
                >
                  <FileText className="h-4 w-4" />
                  {t('analysis.results')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('analysis.uploadHeader')}</h3>
                  <p className="text-muted-foreground mb-4">{t('analysis.uploadDesc')}</p>
                  <Button
                    variant="outline"
                    onClick={handleFileUpload}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('analysis.analyzing')}
                      </>
                    ) : (
                      t('analysis.selectFiles')
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
                      <p className="text-muted-foreground">{t('analysis.resultsPlaceholder')}</p>
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
