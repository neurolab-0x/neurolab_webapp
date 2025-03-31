
import { useState } from "react";
import { AnalysisResult } from "../types";
import StateDistribution from "./StateDistribution";
import CognitiveMetrics from "./CognitiveMetrics";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Brain, Info, MessageSquare, LightbulbIcon } from "lucide-react";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">EEG Analysis Results</h2>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <CalendarClock className="mr-1 h-4 w-4" />
            Analyzed on {formatDate(result.timestamp)}
          </div>
        </div>
        
        <Badge variant="outline" className="px-3 py-1 text-sm">
          <Brain className="mr-2 h-4 w-4" />
          {result.processingMetadata.model}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StateDistribution data={result.stateDistribution} />
            <CognitiveMetrics 
              metrics={result.cognitiveMetrics}
              confidence={result.confidence}
              dominantState={result.dominantState}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <LightbulbIcon className="mr-3 h-5 w-5 text-neural-green" />
                <h3 className="font-semibold text-lg">Clinical Recommendations</h3>
              </div>
              
              <div className="space-y-4">
                {result.clinicalRecommendations.map((recommendation, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-border rounded-lg flex"
                  >
                    <span className="mr-3 font-semibold text-neural-teal">{index + 1}.</span>
                    <p>{recommendation}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex items-center justify-end">
                <button className="text-sm flex items-center text-neural-blue hover:text-neural-blue/80 transition-colors">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Discuss with AI assistant
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metadata" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Info className="mr-3 h-5 w-5 text-neural-blue" />
                <h3 className="font-semibold text-lg">Processing Metadata</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <span className="text-sm text-muted-foreground block mb-1">Processing Time</span>
                  <span className="font-medium">{result.processingMetadata.processingTime} seconds</span>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <span className="text-sm text-muted-foreground block mb-1">Model</span>
                  <span className="font-medium">{result.processingMetadata.model}</span>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <span className="text-sm text-muted-foreground block mb-1">Version</span>
                  <span className="font-medium">{result.processingMetadata.version}</span>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <span className="text-sm text-muted-foreground block mb-1">Analysis ID</span>
                  <span className="font-medium">{result.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
