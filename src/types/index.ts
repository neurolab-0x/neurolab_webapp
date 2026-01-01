export interface MetricThreshold {
  min: number;
  max: number;
}

export interface CognitiveMetric {
  name: string;
  value: number;
  unit: string;
  threshold: MetricThreshold;
}

export interface ProcessingMetadata {
  processingTime: number;
  model: string;
  version: string;
}

export interface SessionMetadata {
  duration: number;
  dataPoints: number;
  signalQuality: string;
  connectionStatus: string;
  finalMetrics?: Record<string, any>;
  timelineData?: {
    labels: string[];
    dataPoints: Record<string, number[]>;
  };
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  stateDistribution: Record<string, number>;
  cognitiveMetrics: CognitiveMetric[];
  dominantState: string;
  confidence: number;
  clinicalRecommendations: string[];
  processingMetadata: ProcessingMetadata;
  processingModel?: string;
  sessionMetadata?: SessionMetadata;
  // allow additional backend fields
  [key: string]: any;
}

export interface AnalysisCreatePayload {
  deviceId: string;
  type: string;
  parameters: {
    samplingRate: number;
    duration: number;
    channels: string[];
  };
}