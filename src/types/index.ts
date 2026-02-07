export interface MetricThreshold {
  min: number;
  max: number;
}

export type StateDistributionData = Record<string, number>;

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

export interface Review {
  id: string;
  analysisId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    fullName: string;
  };
}

export interface Partnership {
  id: string;
  name: string;
  contact: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  stateDistribution: Record<string, number>;
  cognitiveMetrics: CognitiveMetric[] | Record<string, number>;
  dominantState: string | number;
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