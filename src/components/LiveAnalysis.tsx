import DashboardLayout from "@/components/DashboardLayout";
import { generateChartData } from "../data/chartData"; // Import the function
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import GaugeChart from "react-gauge-chart";
import { sampleAnalysisResult } from "../data/sampleData";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LiveAnalysis = () => {
  const navigate = useNavigate();
  const [isCapturing, setIsCapturing] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const [dataPoints, setDataPoints] = useState({
    attention: [] as number[],
    cognitiveLoad: [] as number[],
    mentalFatigue: [] as number[],
    relaxation: [] as number[],
  }); // Simulated real-time data for all cognitive metrics
  const [labels, setLabels] = useState<string[]>([]); // Time labels for x-axis
  const [analysisResult, setAnalysisResult] = useState<any>(null); // Post-capture analysis
  const maxCaptureTime = 1800; // 30 minutes in seconds

  // Simulate real-time EEG data for all cognitive metrics
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCapturing && elapsedTime < maxCaptureTime) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        setDataPoints((prev) => ({
          attention: [...prev.attention, Math.floor(Math.random() * 100)],
          cognitiveLoad: [...prev.cognitiveLoad, Math.floor(Math.random() * 100)],
          mentalFatigue: [...prev.mentalFatigue, Math.floor(Math.random() * 100)],
          relaxation: [...prev.relaxation, Math.floor(Math.random() * 100)],
        }));
        setLabels((prev) => {
          const time = new Date();
          return [...prev, `${time.getMinutes()}:${time.getSeconds()}`];
        });
      }, 1000); // Update every second
    } else if (elapsedTime >= maxCaptureTime) {
      stopCapture();
    }
    return () => clearInterval(interval);
  }, [isCapturing, elapsedTime]);

  // Use the generateChartData function to get chartData
  const chartData = generateChartData(labels, dataPoints);

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "Time" },
      },
      y: {
        title: { display: true, text: "Value (%)" },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Live EEG Cognitive Metrics" },
    },
  };

  // Stop capture and analyze
  const stopCapture = () => {
    setIsCapturing(false);
    setAnalysisResult(sampleAnalysisResult);
  };

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Get the latest value for each gauge
  const latestValues = {
    attention: dataPoints.attention[dataPoints.attention.length - 1] || 0,
    cognitiveLoad: dataPoints.cognitiveLoad[dataPoints.cognitiveLoad.length - 1] || 0,
    mentalFatigue: dataPoints.mentalFatigue[dataPoints.mentalFatigue.length - 1] || 0,
    relaxation: dataPoints.relaxation[dataPoints.relaxation.length - 1] || 0,
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Live EEG Analysis</h1>
        <div className="flex justify-between items-center mb-6">
          <p className="text-lg">
            Time Elapsed: {formatTime(elapsedTime)} / 30:00
          </p>
          <div className="space-x-4">
            {isCapturing && (
              <Button
                onClick={stopCapture}
                className="bg-red-600 hover:bg-red-700"
              >
                Stop Capture
              </Button>
            )}
            <Button
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary-dark"
            >
              Back to Home
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Attention Score</h3>
            <GaugeChart
              id="gauge-attention"
              nrOfLevels={20}
              percent={latestValues.attention / 100}
              colors={["#FF5F6D", "#00C49F"]}
              arcWidth={0.3}
              textColor="#FFFFFF"
              needleColor="#FFFFFF"
            />
            <p>{latestValues.attention}%</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Cognitive Load</h3>
            <GaugeChart
              id="gauge-cognitive"
              nrOfLevels={20}
              percent={latestValues.cognitiveLoad / 100}
              colors={["#FF5F6D", "#00C49F"]}
              arcWidth={0.3}
              textColor="#FFFFFF"
              needleColor="#FFFFFF"
            />
            <p>{latestValues.cognitiveLoad}%</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Mental Fatigue</h3>
            <GaugeChart
              id="gauge-fatigue"
              nrOfLevels={20}
              percent={latestValues.mentalFatigue / 100}
              colors={["#FF5F6D", "#00C49F"]}
              arcWidth={0.3}
              textColor="#FFFFFF"
              needleColor="#FFFFFF"
            />
            <p>{latestValues.mentalFatigue}%</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Relaxation Level</h3>
            <GaugeChart
              id="gauge-relaxation"
              nrOfLevels={20}
              percent={latestValues.relaxation / 100}
              colors={["#FF5F6D", "#00C49F"]}
              arcWidth={0.3}
              textColor="#FFFFFF"
              needleColor="#FFFFFF"
            />
            <p>{latestValues.relaxation}%</p>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        {analysisResult && !isCapturing && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Analysis Summary</h2>
            <p><strong>Analysis ID:</strong> {analysisResult.id}</p>
            <p><strong>Timestamp:</strong> {new Date(analysisResult.timestamp).toLocaleString()}</p>
            <p><strong>Dominant State:</strong> {analysisResult.dominantState}</p>
            <p><strong>Confidence:</strong> {(analysisResult.confidence * 100).toFixed(0)}%</p>
            <h3 className="text-xl font-medium mt-4 mb-2">State Distribution</h3>
            <ul className="list-disc list-inside">
              {Object.entries(analysisResult.stateDistribution).map(([state, value]: [string, number]) => (
                <li key={state}>{state.charAt(0).toUpperCase() + state.slice(1)}: {value}%</li>
              ))}
            </ul>
            <h3 className="text-xl font-medium mt-4 mb-2">Cognitive Metrics</h3>
            <ul className="list-disc list-inside">
              {analysisResult.cognitiveMetrics.map((metric: any) => (
                <li key={metric.name}>
                  {metric.name}: {metric.value}{metric.unit} (Range: {metric.threshold.min} - {metric.threshold.max})
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-medium mt-4 mb-2">Clinical Recommendations</h3>
            <ul className="list-disc list-inside">
              {analysisResult.clinicalRecommendations.map((rec: string, index: number) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
            <h3 className="text-xl font-medium mt-4 mb-2">Processing Metadata</h3>
            <p><strong>Processing Time:</strong> {analysisResult.processingMetadata.processingTime} seconds</p>
            <p><strong>Model:</strong> {analysisResult.processingMetadata.model}</p>
            <p><strong>Version:</strong> {analysisResult.processingMetadata.version}</p>
          </div>
        )}

        <Button onClick={() => navigate("/analysis")} className="bg-primary hover:bg-primary-dark">Visualize Data</Button>
      </div>
    </DashboardLayout>
  );
};

export default LiveAnalysis;
