
export interface EEGData {
  id: string;
  timestamp: string;
  data: number[];
}

export interface StateDistributionData {
  focused: number;
  relaxed: number;
  neutral: number;
  distracted: number;
}

export interface CognitiveMetric {
  name: string;
  value: number;
  unit?: string;
  threshold?: {
    min: number;
    max: number;
  };
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  stateDistribution: StateDistributionData;
  cognitiveMetrics: CognitiveMetric[];
  dominantState: 'focused' | 'relaxed' | 'neutral' | 'distracted';
  confidence: number;
  clinicalRecommendations: string[];
  processingMetadata: {
    processingTime: number;
    model: string;
    version: string;
  };
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

export interface WebSocketMessage {
  type: 'message' | 'status' | 'analysis';
  payload: any;
}
