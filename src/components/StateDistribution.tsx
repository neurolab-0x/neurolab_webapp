
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { StateDistributionData } from "../types";
import { Badge } from "@/components/ui/badge";

interface StateDistributionProps {
  data: StateDistributionData;
}

export const StateDistribution = ({ data }: StateDistributionProps) => {
  // Define color mapping for known states, fallback for others
  const colorMap: Record<string, string> = {
    Focused: "#0A4B9F", // neural-blue
    Relaxed: "#4ECDC4", // neural-teal
    Neutral: "#8E9196", // neural-gray
    Stress: "#FF6B6B",  // custom red
    Fatigue: "#F59E0B", // amber
    Flow: "#8B5CF6",    // violet
  };

  const defaultColors = ["#0A4B9F", "#4ECDC4", "#8E9196", "#FF6B6B", "#F59E0B"];

  const chartData = Object.entries(data).map(([name, value], index) => {
    // Normalize name to Title Case for display if needed, but assuming data is already clean or mapped
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    return {
      name: displayName,
      value: typeof value === 'number' ? value : 0,
      color: colorMap[displayName] || defaultColors[index % defaultColors.length]
    };
  }).filter(item => item.value > 0);

  return (
    <div className="neural-card p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">State Distribution</h3>
        <Badge variant="outline" className="text-xs font-normal">
          Brain States
        </Badge>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              strokeWidth={2}
              stroke="var(--background)"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, "Percentage"]}
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)"
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm">{item.name}: {item.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StateDistribution;
