
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { CognitiveMetric } from "../types";
import { Badge } from "@/components/ui/badge";

interface CognitiveMetricsProps {
  metrics: CognitiveMetric[];
  confidence: number;
  dominantState: string;
}

export const CognitiveMetrics = ({ metrics, confidence, dominantState }: CognitiveMetricsProps) => {
  // Format data for the chart
  const chartData = metrics.map(metric => ({
    name: metric.name,
    value: metric.value,
    unit: metric.unit,
    threshold: metric.threshold
  }));

  return (
    <div className="neural-card p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Cognitive Metrics</h3>
        <Badge variant="outline" className="text-xs font-normal">
          Brain Performance
        </Badge>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Dominant State</span>
          <Badge 
            className={`
              ${dominantState === 'focused' ? 'bg-neural-blue hover:bg-neural-blue/90' : ''}
              ${dominantState === 'relaxed' ? 'bg-neural-teal hover:bg-neural-teal/90' : ''}
              ${dominantState === 'neutral' ? 'bg-neural-gray hover:bg-neural-gray/90' : ''}
              ${dominantState === 'distracted' ? 'bg-destructive hover:bg-destructive/90' : ''}
            `}
          >
            {dominantState.charAt(0).toUpperCase() + dominantState.slice(1)}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Analysis Confidence</span>
          <span className="text-sm font-medium">{(confidence * 100).toFixed(0)}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-neural-blue rounded-full"
            style={{ width: `${confidence * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis 
              type="category" 
              dataKey="name"
              width={100}
              tick={{ fontSize: 12 }}  
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Value"]} 
              contentStyle={{ 
                backgroundColor: "var(--background)", 
                borderColor: "var(--border)" 
              }}
            />
            <ReferenceLine x={75} stroke="#0A4B9F" strokeDasharray="3 3" />
            <Bar 
              dataKey="value"
              fill="#4ECDC4"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CognitiveMetrics;
