import { useState } from "react";
import { AnalysisResult } from "../types";
import StateDistribution from "./StateDistribution";
import CognitiveMetrics from "./CognitiveMetrics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Brain, Info, MessageSquare, LightbulbIcon, Download, Share2, AlertCircle, Activity, Zap, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/50 p-6 rounded-lg border">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            EEG Analysis Results
          </h2>
          <div className="flex items-center text-muted-foreground text-sm">
            <CalendarClock className="mr-2 h-4 w-4" />
            Analyzed on {formatDate(result.timestamp)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="px-3 py-1 text-sm cursor-help">
                  <Brain className="mr-2 h-4 w-4" />
                  {result.processingMetadata.model}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analysis model used</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/10">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/10">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dominant State</CardTitle>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {result.dominantState}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Primary cognitive state</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confidence</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {(result.confidence * 100).toFixed(0)}%
              </div>
              <Progress value={result.confidence * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {result.processingMetadata.processingTime}s
              </div>
              <p className="text-xs text-muted-foreground mt-1">Analysis duration</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
              <LightbulbIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {result.clinicalRecommendations.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Clinical insights</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[400px] bg-card/50">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Brain className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <LightbulbIcon className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="metadata" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Info className="h-4 w-4" />
            Metadata
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="overview" className="mt-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* State Distribution */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    State Distribution
                    <Badge variant="secondary" className="ml-2">Real-time</Badge>
                  </CardTitle>
                  <CardDescription>Distribution of cognitive states during the analysis period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(result.stateDistribution).map(([state, value]: [string, number]) => (
                      <motion.div
                        key={state}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{state.charAt(0).toUpperCase() + state.slice(1)}</span>
                          <span className="text-muted-foreground">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cognitive Metrics */}
              <Card className="hover:shadow-lg transition-all duration-300 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Cognitive Metrics
                    <Badge variant="secondary" className="ml-2">Detailed</Badge>
                  </CardTitle>
                  <CardDescription>Detailed analysis of cognitive performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.cognitiveMetrics.map((metric: any) => (
                      <motion.div
                        key={metric.name}
                        whileHover={{ scale: 1.02 }}
                        onHoverStart={() => setHoveredMetric(metric.name)}
                        onHoverEnd={() => setHoveredMetric(null)}
                        className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{metric.name}</span>
                          <span className="text-muted-foreground">{metric.value}{metric.unit}</span>
                        </div>
                        <Progress
                          value={((metric.value - metric.threshold.min) / (metric.threshold.max - metric.threshold.min)) * 100}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{metric.threshold.min}{metric.unit}</span>
                          <span>{metric.threshold.max}{metric.unit}</span>
                        </div>
                        {hoveredMetric === metric.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-xs text-muted-foreground"
                          >
                            Click for detailed analysis
                            <ChevronRight className="h-3 w-3 inline ml-1" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <StateDistribution data={result.stateDistribution} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CognitiveMetrics
                    metrics={result.cognitiveMetrics}
                    confidence={result.confidence}
                    dominantState={result.dominantState}
                  />
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <LightbulbIcon className="mr-3 h-5 w-5 text-neural-green" />
                      <h3 className="font-semibold text-lg">Clinical Recommendations</h3>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {result.clinicalRecommendations.length} recommendations
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {result.clinicalRecommendations.map((recommendation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-semibold text-neural-teal">{index + 1}.</span>
                          <p className="flex-1">{recommendation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>Need more insights?</span>
                    </div>
                    <Button variant="outline" className="gap-2 hover:bg-primary/10">
                      <MessageSquare className="h-4 w-4" />
                      Discuss with AI assistant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="metadata" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Info className="mr-3 h-5 w-5 text-neural-blue" />
                      <h3 className="font-semibold text-lg">Processing Metadata</h3>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      Version {result.processingMetadata.version}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        label: "Processing Time",
                        value: `${result.processingMetadata.processingTime}s`,
                        progress: result.processingMetadata.processingTime * 10,
                      },
                      {
                        label: "Model",
                        value: result.processingMetadata.model,
                      },
                      {
                        label: "Version",
                        value: result.processingMetadata.version,
                      },
                      {
                        label: "Analysis ID",
                        value: result.id,
                        isMono: true,
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <span className="text-sm text-muted-foreground block mb-2">{item.label}</span>
                        {item.progress ? (
                          <div className="flex items-center gap-2">
                            <Progress value={item.progress} className="flex-1" />
                            <span className="font-medium">{item.value}</span>
                          </div>
                        ) : (
                          <span className={`font-medium ${item.isMono ? 'font-mono' : ''}`}>{item.value}</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default AnalysisResults;
