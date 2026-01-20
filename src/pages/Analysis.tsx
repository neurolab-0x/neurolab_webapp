import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, BarChart2, Brain, Activity, Play, Pause, StopCircle, AlertCircle, Loader2, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import AnalysisResults from "@/components/AnalysisResults";
import { AnalysisResult } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from '@/lib/i18n';
import { getUserAnalyses } from "@/api/analysisData";

type SessionStatus = 'idle' | 'connecting' | 'active' | 'paused' | 'completed' | 'error';

const Analysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');
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
      // Construct payload based on file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      const payload = {
        deviceId: '123e4567-e89b-12d3-a456-426614174000',
        type: fileExtension?.toUpperCase() === 'EDF' ? 'EEG' : 'EEG',
        parameters: {
          samplingRate: 256,
          duration: 300,
          channels: ['Fp1', 'Fp2', 'C3', 'C4'],
          fileName: selectedFile.name,
          fileSize: selectedFile.size
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
      setSelectedFile(null);
      toast({ title: 'Analysis submitted', description: 'Your file is being analyzed. Results will appear below.' });
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
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${selectedFile ? "border-neural-teal/50" : "border-border hover:border-primary/50"}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {!selectedFile && !isAnalyzing && (
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">{t('analysis.uploadHeader')}</h3>
                        <p className="text-muted-foreground mb-2">{t('analysis.uploadDesc')}</p>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: CSV, EDF
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
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
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-neural-teal/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-neural-teal" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          onClick={handleAnalyse}
                          className="bg-neural-green hover:bg-neural-green/90"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Analyse
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleClearFile}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="font-medium">Analyzing {selectedFile?.name}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Processing...
                        </p>
                      </div>
                    </div>
                  )}
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
