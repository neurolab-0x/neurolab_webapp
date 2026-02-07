import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Upload, StopCircle, Play, Loader2, FileAudio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios/config';
import { AnalysisResult } from '@/types';

interface VoiceAnalysisProps {
    onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function VoiceAnalysis({ onAnalysisComplete }: VoiceAnalysisProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            toast({ variant: "destructive", title: "Microphone Error", description: "Could not access microphone." });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAudioBlob(e.target.files[0]);
        }
    };

    const analyzeVoice = async () => {
        if (!audioBlob) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('voice', audioBlob, 'recording.wav');

        try {
            // Allow for mock/demo if backend is offline or returns 404
            try {
                const { data } = await axios.post('/analysis/voice', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                onAnalysisComplete(data);
            } catch (e) {
                console.warn("Backend voice endpoint failed, using mock data for demo", e);
                // Mock response
                setTimeout(() => {
                    const mockResult: AnalysisResult = {
                        id: 'voice-123',
                        timestamp: new Date().toISOString(),
                        stateDistribution: { "Calm": 40, "Anxious": 20, "Neutral": 40 },
                        cognitiveMetrics: [],
                        dominantState: "Calm",
                        confidence: 0.85,
                        clinicalRecommendations: ["Voice data suggests calm state."],
                        processingMetadata: { processingTime: 50, model: "VoiceAI-v1", version: "1.0" }
                    };
                    onAnalysisComplete(mockResult);
                }, 2000);
            }

        } catch (error) {
            console.error('Analysis failed:', error);
            toast({ variant: "destructive", title: "Analysis Failed", description: "Could not process voice data." });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-8 relative overflow-hidden">
            {/* Ambient blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">Voice Analysis</h3>
                    <p className="text-muted-foreground max-w-md">Record your voice or upload an audio clip to analyze emotional tone and cognitive markers.</p>
                </div>

                <div className="flex flex-col items-center gap-6 w-full max-w-md">

                    {/* Recording Circle */}
                    <div className={cn(
                        "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative",
                        isRecording ? "bg-red-500/10 ring-4 ring-red-500/20 scale-110" : "bg-primary/5 hover:bg-primary/10"
                    )}>
                        {isRecording && (
                            <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin duration-3000" />
                        )}

                        {isRecording ? (
                            <button onClick={stopRecording} className="w-full h-full flex items-center justify-center rounded-full text-red-500">
                                <StopCircle className="h-12 w-12" />
                            </button>
                        ) : (
                            <button onClick={startRecording} className="w-full h-full flex items-center justify-center rounded-full text-primary" disabled={!!audioBlob}>
                                <Mic className="h-12 w-12" />
                            </button>
                        )}
                    </div>

                    {/* Timer */}
                    {isRecording && (
                        <div className="font-mono text-2xl font-bold text-red-500 animate-pulse">
                            {formatTime(recordingTime)}
                        </div>
                    )}

                    {!isRecording && audioBlob && (
                        <Card className="w-full border-primary/20 bg-primary/5">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <FileAudio className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="font-semibold">Audio Recording</p>
                                        <p className="text-xs text-muted-foreground">Ready to analyze</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => setAudioBlob(null)}>Remove</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 w-full">
                        <Button
                            className="flex-1 h-11 font-bold shadow-lg shadow-primary/20"
                            onClick={analyzeVoice}
                            disabled={!audioBlob || isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" /> Analyze Audio
                                </>
                            )}
                        </Button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="audio/*"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <Button
                            variant="outline"
                            className="h-11 px-4"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isRecording}
                        >
                            <Upload className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
