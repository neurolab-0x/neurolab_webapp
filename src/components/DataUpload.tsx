
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const DataUpload = ({ onDataUploaded }: { onDataUploaded: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate file upload with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          setFile(null);
          setProgress(0);
          toast.success("EEG data uploaded successfully!");
          onDataUploaded();
        }, 500);
      }
    }, 250);
  };
  
  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className="neural-card p-6">
      <h3 className="text-lg font-semibold mb-3">Upload EEG Data</h3>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          file ? "border-neural-teal/50" : "border-border hover:border-primary/50"
        } transition-colors duration-200`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!file && !uploading && (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your EEG file, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports CSV, JSON, and EDF formats
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              Select File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".csv,.json,.edf"
            />
          </div>
        )}
        
        {file && !uploading && (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-neural-teal/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-neural-teal" />
            </div>
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="flex justify-center space-x-2">
              <Button 
                size="sm" 
                onClick={handleUpload}
                className="bg-neural-green hover:bg-neural-green/90"
              >
                <Check className="mr-2 h-4 w-4" />
                Process
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleClearFile}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        )}
        
        {uploading && (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <div>
              <p className="font-medium">Processing {file?.name}</p>
              <p className="text-sm text-muted-foreground mb-2">
                {progress}% complete
              </p>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUpload;
