import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Upload, ArrowRight, Bluetooth, Usb, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataUpload from "@/components/DataUpload";
import AnalysisResults from "@/components/AnalysisResults";
import ChatInterface from "@/components/ChatInterface";
import Header from "@/components/Header";

const Index = () => {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const navigate = useNavigate();

  const handleDataUploaded = () => {
    setTimeout(() => {
      setAnalysisComplete(true);
    }, 1000);
  };

  const handleDeviceConnect = () => {
    setTimeout(() => {
      setDeviceConnected(true);
    }, 1000);
  };

  const handleDeviceDisconnect = () => {
    setDeviceConnected(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {!analysisComplete ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full neural-gradient flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">NeurAi</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Upload your EEG data or connect your device for real-time analysis.
                </p>
              </div>
              
              <div className="space-y-8">
                {/* Recorded EEG Data Upload */}
                <div className="neural-card p-6 md:p-8">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Upload Recorded EEG Data</h2>
                      <p className="text-muted-foreground mt-1">
                        We accept CSV, JSON, and EDF formats. Your data will be processed securely.
                      </p>
                    </div>
                  </div>
                  <DataUpload onDataUploaded={handleDataUploaded} />
                </div>

                {/* Real-time Device Connection */}
                <div className="neural-card p-6 md:p-8">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                      <Bluetooth className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Connect Your EEG Device</h2>
                      <p className="text-muted-foreground mt-1">
                        Simulate connection via Bluetooth or USB for real-time EEG analysis.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    {!deviceConnected ? (
                      <>
                        <Button onClick={handleDeviceConnect}>
                          <Bluetooth className="mr-2 w-5 h-5" /> Connect via Bluetooth
                        </Button>
                        <Button onClick={handleDeviceConnect} variant="outline">
                          <Usb className="mr-2 w-5 h-5" /> Connect via USB
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={handleDeviceDisconnect} variant="destructive">
                          Disconnect Device
                        </Button>
                        <Button onClick={() => navigate("/live-analysis")}>
                          <PlayCircle className="mr-2 w-5 h-5" /> Start Capturing Data
                        </Button>
                      </>
                    )}
                  </div>
                  {deviceConnected && (
                    <p className="text-green-600 mt-4">Device connected successfully!</p>
                  )}
                </div>

                <div className="flex justify-center text-muted-foreground text-sm">
                  <div className="flex items-center">
                    <span>Upload</span>
                    <ArrowRight className="mx-2 h-4 w-4" />
                    <span>Analysis</span>
                    <ArrowRight className="mx-2 h-4 w-4" />
                    <span>Review Results</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalysisResults result={{ sample: "Sample Analysis Result" }} />
              </div>
              <div className="lg:col-span-1 h-[700px]">
                <ChatInterface />
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>NeuroLab Ai &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
