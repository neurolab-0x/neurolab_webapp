// chartData.ts
export const generateChartData = (labels: string[], dataPoints: any) => {
    return {
      labels: labels,
      datasets: [
        {
          label: "Attention Score (%)",
          data: dataPoints.attention,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
          tension: 0.4,
          borderWidth: 1, // Reduced line thickness
        },
        {
          label: "Cognitive Load (%)",
          data: dataPoints.cognitiveLoad,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: false,
          tension: 0.4,
          borderWidth: 1, // Reduced line thickness
        },
        {
          label: "Mental Fatigue (%)",
          data: dataPoints.mentalFatigue,
          borderColor: "rgb(255, 205, 86)",
          backgroundColor: "rgba(255, 205, 86, 0.2)",
          fill: false,
          tension: 0.4,
          borderWidth: 1, // Reduced line thickness
        },
        {
          label: "Relaxation Level (%)",
          data: dataPoints.relaxation,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: false,
          tension: 0.4,
          borderWidth: 1, // Reduced line thickness
        },
      ],
    };
  };
  