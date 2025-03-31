
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import DataUpload from "@/components/DataUpload";
import AnalysisResults from "@/components/AnalysisResults";
import ChatInterface from "@/components/ChatInterface";
import { sampleAnalysisResult } from "@/data/sampleData";
import { Brain, Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const navigate = useNavigate();
  
  const handleDataUploaded = () => {
    setTimeout(() => {
      setAnalysisComplete(true);
    }, 1000);
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
                <h1 className="text-3xl md:text-4xl font-bold mb-3">NeuroLab Ai</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Upload your EEG data and get instant analysis with our advanced neural processing algorithms.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="neural-card p-6 md:p-8">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Upload your EEG data</h2>
                      <p className="text-muted-foreground mt-1">
                        We accept CSV, JSON, and EDF formats. Your data will be processed securely.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <DataUpload onDataUploaded={handleDataUploaded} />
                    
                    <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                      <p>All uploaded data is processed privately and securely. Your EEG information is not stored on our servers.</p>
                    </div>
                  </div>
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

                <div className="flex justify-center pt-4 space-x-4">
                  <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
                  <Button variant="outline" onClick={() => navigate("/private")}>Private Area</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalysisResults result={sampleAnalysisResult} />
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
