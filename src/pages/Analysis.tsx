
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Upload, AlertCircle } from "lucide-react";

const Analysis = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 section-padding">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h1 className="font-bold">Analysis</h1>
              <p className="text-muted-foreground">Upload and analyze your EEG data.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Data
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upload">Upload Data</TabsTrigger>
              <TabsTrigger value="results">Analysis Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload EEG Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border rounded-md">
                    <Brain className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Drag & Drop your EEG files</h3>
                    <p className="text-muted-foreground text-center mb-4 max-w-md">
                      We accept CSV, JSON, and EDF formats. Your data will be processed securely.
                    </p>
                    <Button>Select Files</Button>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center p-3 bg-primary/5 rounded">
                      <AlertCircle className="mr-2 h-4 w-4 text-primary" />
                      <p className="text-sm">All uploaded data is processed privately and securely.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-md">
                    <p className="text-muted-foreground">Upload data to see analysis results</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>NeurAi &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Analysis;
