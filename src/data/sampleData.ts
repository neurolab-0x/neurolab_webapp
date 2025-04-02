
import { AnalysisResult } from "../types";

export const sampleAnalysisResult: AnalysisResult = {
  id: "analysis-123",
  timestamp: new Date().toISOString(),
  stateDistribution: {
    focused: 45,
    relaxed: 25,
    neutral: 20,
    distracted: 10
  },
  cognitiveMetrics: [
    {
      name: "Attention Score",
      value: 72,
      unit: "%",
      threshold: {
        min: 0,
        max: 100
      }
    },
    {
      name: "Cognitive Load",
      value: 65,
      unit: "%",
      threshold: {
        min: 0,
        max: 100
      }
    },
    {
      name: "Mental Fatigue",
      value: 28,
      unit: "%",
      threshold: {
        min: 0,
        max: 100
      }
    },
    {
      name: "Relaxation Level",
      value: 42,
      unit: "%",
      threshold: {
        min: 0,
        max: 100
      }
    }
  ],
  dominantState: "focused",
  confidence: 0.85,
  clinicalRecommendations: [
    "Consider short breaks every 25 minutes to maintain optimal focus levels.",
    "The subject shows good attention patterns but may benefit from mindfulness exercises to reduce cognitive load.",
    "Hydration and proper posture could improve sustained attention duration."
  ],
  processingMetadata: {
    processingTime: 1.25,
    model: "NeurAi v1.0",
    version: "nlPT 1-Preview"
  }
};

export const sampleMessages = [
  {
    id: "msg-1",
    sender: "NeuralAssistant",
    content: "Hello! I'm your NeuralAssistant. How can I help you interpret your EEG data today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    isUser: false
  },
  {
    id: "msg-2",
    sender: "User",
    content: "Hi! I just uploaded my EEG data. Can you tell me what the focus levels mean?",
    timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    isUser: true
  },
  {
    id: "msg-3",
    sender: "NeuralAssistant",
    content: "Of course! Focus levels indicate the percentage of time your brain waves showed patterns consistent with focused attention. Your score of 45% is within the normal range for someone engaged in analytical tasks.",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    isUser: false
  }
];
