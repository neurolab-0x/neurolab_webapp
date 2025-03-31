
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { StateDistributionData } from "../types";
import { Badge } from "@/components/ui/badge";

interface StateDistributionProps {
  data: StateDistributionData;
}

export const StateDistribution = ({ data }: StateDistributionProps) => {
  const chartData = [
    { name: "Focused", value: data.focused, color: "#0A4B9F" }, // neural-blue
    { name: "Relaxed", value: data.relaxed, color: "#4ECDC4" }, // neural-teal
    { name: "Neutral", value: data.neutral, color: "#8E9196" }, // neural-gray
    { name: "Distracted", value: data.distracted, color: "#FF6B6B" }, // custom red
  ];

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
            <span className="text-sm">{item.name}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StateDistribution;
