import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, BarChart2, Brain, Activity, Play, Pause, StopCircle, AlertCircle, Loader2, X, Check, Mic } from "lucide-react";
import VoiceAnalysis from "@/components/VoiceAnalysis";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import AnalysisResults from "@/components/AnalysisResults";
import { AnalysisResult } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from '@/lib/i18n';
import { getUserAnalyses } from "@/api/analysisData";
import { cn } from "@/lib/utils";

type SessionStatus = 'idle' | 'connecting' | 'active' | 'paused' | 'completed' | 'error';

const mockAnalysisResult: AnalysisResult = {
  id: 'mock-session-1',
  timestamp: new Date().toISOString(),
  dominantState: 'Focus',
  confidence: 0.89,
  stateDistribution: { Focus: 60, Relax: 30, Fatigue: 10 },
  cognitiveMetrics: [],
  clinicalRecommendations: [],
  processingMetadata: { model: 'v1', version: '1.0', processingTime: 100 }
};

// Helper to normalize z-scores (-3 to 3) to 0-100 scale
const normalizeMetric = (value: number): number => {
  // Clamp between -3 and 3 approx
  const clamped = Math.max(-3, Math.min(3, value));
  // Map -3..3 to 0..100
  return Math.round(((clamped + 3) / 6) * 100);
};

// Helper to map numeric state keys to descriptive labels
const mapStateKeys = (distribution: Record<string, number>): Record<string, number> => {
  const mapping: Record<string, string> = {
    "0": "Relaxed",
    "1": "Focused",
    "2": "Stress"
  };

  const mapped: Record<string, number> = {};
  Object.entries(distribution).forEach(([key, value]) => {
    const newKey = mapping[key] || key;
    mapped[newKey] = value;
  });
  return mapped;
};

const Analysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'voice' | 'results'>('upload');
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();
  const { toast } = useToast();

  // Fetch user's analyses on component mount
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        const data = await getUserAnalyses();
        setAnalyses(data as unknown as AnalysisResult[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analyses');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      // Validate file type
      if (!['csv', 'edf'].includes(fileExtension || '')) {
        setError('Invalid file type. Please select a CSV or EDF file.');
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      // Validate file type
      if (!['csv', 'edf'].includes(fileExtension || '')) {
        setError('Invalid file type. Please select a CSV or EDF file.');
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyse = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // If a file is present, use multipart upload (doctor flow)
      const { uploadAnalysisFile } = await import('@/api/analysis');
      const resp = await uploadAnalysisFile(selectedFile as File);

      const backendAnalysis = resp?.analysis || resp || {};

      // Normalized Confidence Logic
      const rawConfidence = backendAnalysis.confidence ?? 0;
      const normalizedConfidence = rawConfidence > 1 ? rawConfidence / 100 : rawConfidence;

      // Handle snake_case properties from backend
      const rawCognitiveMetrics = backendAnalysis.cognitiveMetrics || backendAnalysis.cognitive_metrics || {};
      const rawStateDistribution = backendAnalysis.statePercentages || backendAnalysis.state_percentages || backendAnalysis.stateDistribution || {};
      const rawStateLabel = backendAnalysis.stateLabel || backendAnalysis.state_label || backendAnalysis.dominantState || 'unknown';

      // Transform Cognitive Metrics Object to Array
      let transformedMetrics: any[] = [];
      if (rawCognitiveMetrics && !Array.isArray(rawCognitiveMetrics)) {
        transformedMetrics = Object.entries(rawCognitiveMetrics).map(([key, value]) => ({
          name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // "attention_index" -> "Attention Index"
          value: normalizeMetric(value as number),
          unit: 'idx',
          threshold: { min: 0, max: 100 }
        }));
      } else if (Array.isArray(rawCognitiveMetrics)) {
        transformedMetrics = rawCognitiveMetrics;
      }

      // Map State Distribution keys
      const mappedDistribution = mapStateKeys(rawStateDistribution);

      // Map Dominant State
      const dominantStateMap: Record<string, string> = { "0": "Relaxed", "1": "Focused", "2": "Stress" };
      let dominantState = rawStateLabel;

      // If it's the numeric enum "1", map it. If it's already "focused", capitalize it.
      if (dominantStateMap[String(dominantState)]) {
        dominantState = dominantStateMap[String(dominantState)];
      } else if (typeof dominantState === 'string') {
        dominantState = dominantState.charAt(0).toUpperCase() + dominantState.slice(1);
      }

      const analysisResultFromBackend: AnalysisResult = {
        ...backendAnalysis, // Spread FIRST so we don't overwrite our normalized values
        id: backendAnalysis.id || backendAnalysis._id || 'unknown',
        timestamp: backendAnalysis.timestamp || new Date().toISOString(),
        dominantState: dominantState,
        confidence: normalizedConfidence,
        stateDistribution: mappedDistribution,
        cognitiveMetrics: transformedMetrics,
        clinicalRecommendations: backendAnalysis.recommendations || backendAnalysis.clinicalRecommendations || backendAnalysis.clinical_recommendations || [],
        processingMetadata: backendAnalysis.processingMetadata || {
          model: backendAnalysis.metadata?.model_path || 'unknown',
          version: '1.0',
          processingTime: backendAnalysis.temporal_analysis?.total_samples || 0
        }
      };

      setAnalysisResult(analysisResultFromBackend);
      setActiveTab('results');
      setSelectedFile(null);
      toast({ title: 'Analysis submitted', description: 'Your file is being analyzed. Results will appear below.' });
    } catch (err: any) {
      console.error(err);
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
      <div className="w-full space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">
              {t('analysis.title')}
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              Upload your neuro-data or connect a device for real-time monitoring.
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="glass-platter border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">{t('common.error')}</AlertTitle>
            <AlertDescription className="font-medium opacity-90">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="w-full overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
            <CardTitle className="text-xl font-bold">Neural Session</CardTitle>
            <CardDescription className="text-sm font-medium">Manage your active sessions and historical data.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b border-border/40 bg-muted/10 p-0 h-12">
                <TabsTrigger
                  value="upload"
                  className="px-8 flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all font-bold h-full"
                >
                  <Upload className="h-4 w-4" />
                  {t('analysis.upload')}
                </TabsTrigger>
                <TabsTrigger
                  value="voice"
                  className="px-8 flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all font-bold h-full"
                >
                  <Mic className="h-4 w-4" />
                  Voice
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="px-8 flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all font-bold h-full"
                  disabled={!analysisResult}
                >
                  <FileText className="h-4 w-4" />
                  {t('analysis.results')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="p-8 m-0 relative">
                {/* Ambient blob for the upload area */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

                <div
                  className={cn(
                    "border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 relative group overflow-hidden",
                    selectedFile
                      ? "border-primary/50 bg-primary/5 ring-4 ring-primary/5"
                      : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {!selectedFile && !isAnalyzing && (
                    <div className="space-y-6">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight mb-2">{t('analysis.uploadHeader')}</h3>
                        <p className="text-muted-foreground font-medium max-w-md mx-auto">{t('analysis.uploadDesc')}</p>
                        <div className="flex items-center justify-center gap-4 mt-6">
                          <Badge variant="outline" className="px-3 py-1 font-bold border-border/60 uppercase text-[10px]">.CSV</Badge>
                          <Badge variant="outline" className="px-3 py-1 font-bold border-border/60 uppercase text-[10px]">.EDF</Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-11 px-8 rounded-xl font-bold border-border shadow-sm hover:bg-primary/5"
                      >
                        Browse Files
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".csv,.edf"
                      />
                    </div>
                  )}

                  {selectedFile && !isAnalyzing && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shadow-inner">
                        <FileText className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xl font-bold tracking-tight">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground font-medium mt-1">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Ready for analysis
                        </p>
                      </div>
                      <div className="flex justify-center gap-3">
                        <Button
                          size="lg"
                          onClick={handleAnalyse}
                          className="h-11 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Start Analysis
                        </Button>
                        <Button
                          size="lg"
                          variant="ghost"
                          onClick={handleClearFile}
                          className="h-11 px-6 rounded-xl font-bold text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Clear
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {isAnalyzing && (
                    <div className="space-y-6 py-8">
                      <div className="relative mx-auto w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Activity className="w-8 h-8 text-primary animate-pulse-subtle" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xl font-bold tracking-tight">Processing Neural Data</p>
                        <p className="text-sm text-muted-foreground font-medium mt-1 animate-pulse">
                          Running predictive models...
                        </p>
                      </div>
                      <Progress value={65} className="h-2 w-64 mx-auto rounded-full bg-muted shadow-inner" />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="voice" className="p-0 m-0">
                <VoiceAnalysis onAnalysisComplete={(res) => {
                  setAnalysisResult(res);
                  setActiveTab('results');
                  toast({ title: 'Analysis Complete', description: 'Voice analysis results ready.' });
                }} />
              </TabsContent>

              <TabsContent value="results" className="p-0 m-0">
                <AnimatePresence mode="wait">
                  {analysisResult ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8"
                    >
                      <AnalysisResults result={analysisResult} />
                    </motion.div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground font-medium">
                      {t('analysis.resultsPlaceholder')}
                    </div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analysis;
