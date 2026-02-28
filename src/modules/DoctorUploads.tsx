import React, { useState, useRef, useEffect } from 'react';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { UploadCloud, FileType, Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, Download, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

const DoctorUploadsInner = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    // Generate simulated offline data
    const simulatedChannels = 16;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const timeRef = useRef(0);

    // Mock analysis state
    const [playbackState, setPlaybackState] = useState<'playing' | 'paused'>('paused');
    const [focusChannel, setFocusChannel] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalysisComplete(false);
        }
    };

    const runAnalysis = () => {
        if (!file) return;
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisComplete(true);
        }, 3000);
    };

    const generateReport = () => {
        const doc = new jsPDF();

        // --- Page Background / Watermark ---
        doc.setTextColor(230, 230, 230);
        doc.setFontSize(60);
        doc.setFont("helvetica", "bold");
        doc.text("NeurAI", 50, 150, { angle: 45 });

        // --- Header ---
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.text("NeurAI Clinical EEG Report", 20, 25);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 32);
        doc.text("Clinic: Kigali Neuro-Diagnostic Center", 20, 37);
        doc.text("Attending Physician: Dr. Landry", 20, 42);

        // --- Separator ---
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 47, 190, 47);

        // --- Patient Info ---
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Patient Information", 20, 60);
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text("Name: John Doe", 20, 68);
        doc.text("ID: P-98241", 20, 74);
        doc.text("DOB: 15-Jun-1985 (Age: 40)", 20, 80);
        doc.text("Recording File: " + (file?.name || "Unknown.edf"), 20, 86);

        // --- AI Analysis ---
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("NeurAI Automated Findings", 20, 105);

        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text("1. Normal Alpha Rhythm: Found dominant 9Hz oscillations over Occipital regions.", 20, 115);
        doc.text("2. Intermittent Slowing: Brief episodes of 5Hz theta waves observed in", 20, 122);
        doc.text("   frontal leads between 01:23 and 01:45.", 20, 128);

        // --- Prescriptions / Recommendations ---
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Physician Recommendations", 20, 150);

        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text("• Proceed with scheduled Follow-up via User Portal.", 20, 160);
        doc.text("• Adjust Levetiracetam dosage from 500mg BID to 750mg BID.", 20, 167);
        doc.text("• Monitor for increased daytime somnolence.", 20, 174);

        // --- Footer ---
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("This report is generated with the assistance of Artificial Intelligence.", 20, 280);
        doc.text("Final clinical judgment is reserved for the attending physician.", 20, 285);

        // Save
        doc.save(`NeurAI_Report_${new Date().getTime()}.pdf`);
    };

    // EEG Drawing Loop
    useEffect(() => {
        if (!analysisComplete || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        if (canvas.width === 0) resizeCanvas();

        const drawFrame = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Background
            ctx.fillStyle = '#1e293b'; // Slate 800
            ctx.fillRect(0, 0, width, height);

            // Grid lines
            ctx.strokeStyle = '#334155'; // Slate 700
            ctx.lineWidth = 1;
            for (let x = 0; x < width; x += 50) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            }
            for (let y = 0; y < height; y += 50) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
            }

            // Draw Channels
            const activeChannels = focusChannel ? 1 : simulatedChannels;
            const channelHeight = height / activeChannels;
            const labels = ['Fp1-F7', 'Fp2-F8', 'F7-T3', 'F8-T4', 'T3-T5', 'T4-T6', 'T5-O1', 'T6-O2', 'Fp1-F3', 'Fp2-F4', 'F3-C3', 'F4-C4', 'C3-P3', 'C4-P4', 'P3-O1', 'P4-O2'];

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#10b981'; // Emerald 500
            ctx.fillStyle = '#94a3b8'; // Slate 400
            ctx.font = '12px sans-serif';

            for (let c = 0; c < activeChannels; c++) {
                const yOffset = c * channelHeight + (channelHeight / 2);
                const label = focusChannel || labels[c];

                // Label
                ctx.fillText(label, 10, yOffset - 10);

                // Waveform
                ctx.beginPath();
                for (let x = 0; x < width; x++) {
                    // Simulate different frequencies for different channels
                    const freq1 = 0.05 + (c * 0.005);
                    const freq2 = 0.02 + (c * 0.01);

                    const t = timeRef.current + (x * 0.1);
                    let y = yOffset;

                    // Base oscillation
                    y += Math.sin(t * freq1) * (channelHeight * 0.3);
                    // Add complexity
                    y += Math.cos(t * freq2) * (channelHeight * 0.15);
                    // Add noise
                    y += (Math.random() - 0.5) * 5;

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Playhead
            ctx.strokeStyle = '#ef4444'; // Red 500
            ctx.lineWidth = 2;
            ctx.beginPath();
            const playheadX = (timeRef.current * 2) % width;
            ctx.moveTo(playheadX, 0);
            ctx.lineTo(playheadX, height);
            ctx.stroke();

            if (playbackState === 'playing') {
                timeRef.current += 1;
                animationRef.current = requestAnimationFrame(drawFrame);
            }
        };

        // Draw initial frame or continue animation
        if (playbackState === 'playing') {
            animationRef.current = requestAnimationFrame(drawFrame);
        } else {
            drawFrame(); // Draw static frame when paused
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [analysisComplete, playbackState, focusChannel]);


    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex items-baseline justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-display text-foreground">Offline Uploads & Analysis</h1>
                    <p className="mt-2 text-muted-foreground">Upload EDF/CSV files for deep AI visualization and reporting.</p>
                </div>
            </div>

            {!analysisComplete ? (
                <div className="rounded-2xl border border-surface-border bg-surface p-8 shadow-sm">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-surface-border rounded-xl p-12 bg-background/50 transition-colors hover:bg-surface-border/20">
                        <UploadCloud size={48} className="text-[#2E90FA] mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Upload Neural Data File</h3>
                        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                            Drag and drop an EDF or CSV file containing raw EEG recordings, or click to browse your local machine.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <label className="cursor-pointer rounded-xl bg-[#2E90FA] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#54A5FF] shadow-sm">
                                <span>Browse Files</span>
                                <input type="file" className="hidden" accept=".edf,.csv,.txt" onChange={handleFileUpload} />
                            </label>

                            {file && (
                                <div className="flex items-center gap-3 bg-card border border-surface-border px-4 py-2 rounded-lg">
                                    <FileType size={16} className="text-emerald-500" />
                                    <span className="text-sm font-medium text-foreground">{file.name}</span>
                                    <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {file && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                className="flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-sm font-semibold transition-all hover:bg-foreground/90 disabled:opacity-50"
                            >
                                {isAnalyzing ? 'Processing via NeurAI...' : 'Run Deep Analysis'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Visualizer Controls */}
                    <div className="flex items-center justify-between rounded-xl border border-surface-border bg-surface p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setPlaybackState(p => p === 'paused' ? 'playing' : 'paused')} className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2E90FA] text-white hover:bg-[#54A5FF] transition-colors">
                                {playbackState === 'playing' ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
                            </button>
                            <div className="flex items-center gap-2 border-l border-surface-border pl-4">
                                <button className="p-2 text-muted-foreground hover:bg-surface-border/50 rounded-lg transition-colors"><SkipBack size={18} /></button>
                                <button className="p-2 text-muted-foreground hover:bg-surface-border/50 rounded-lg transition-colors"><SkipForward size={18} /></button>
                            </div>
                            <div className="flex items-center gap-2 border-l border-surface-border pl-4">
                                <button className="p-2 text-muted-foreground hover:bg-surface-border/50 rounded-lg transition-colors"><ZoomOut size={18} /></button>
                                <button className="p-2 text-muted-foreground hover:bg-surface-border/50 rounded-lg transition-colors"><ZoomIn size={18} /></button>
                            </div>
                            <div className="border-l border-surface-border pl-4">
                                <select
                                    className="h-9 rounded-lg border border-surface-border bg-background px-3 text-sm text-foreground focus:outline-none focus:border-[#2E90FA]"
                                    value={focusChannel || ''}
                                    onChange={e => setFocusChannel(e.target.value || null)}
                                >
                                    <option value="">All Channels</option>
                                    <option value="Fp1-F7">Focus: Fp1-F7</option>
                                    <option value="Fp2-F8">Focus: Fp2-F8</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={generateReport}
                            className="flex items-center gap-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-4 py-2 text-sm font-semibold transition-colors border border-emerald-500/20"
                        >
                            <FileText size={16} />
                            Export PDF Report
                        </button>
                    </div>

                    {/* Canvas Area */}
                    <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden shadow-sm">
                        <div className="bg-sidebar px-4 py-3 border-b border-surface-border flex justify-between items-center">
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Playback: {file?.name}</span>
                        </div>
                        <canvas ref={canvasRef} className="w-full h-[500px] bg-background block" />
                    </div>

                    {/* Mock Analysis Results */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">AI Findings</h3>
                            <div className="space-y-4">
                                <div className="border-l-2 border-emerald-500 pl-4 py-1">
                                    <p className="text-sm font-medium text-foreground">Normal Alpha Rhythm</p>
                                    <p className="text-xs text-muted-foreground mt-1">Found dominant 9Hz oscillations over Occipital regions.</p>
                                </div>
                                <div className="border-l-2 border-amber-500 pl-4 py-1">
                                    <p className="text-sm font-medium text-foreground">Intermittent Slowing</p>
                                    <p className="text-xs text-muted-foreground mt-1">Brief episodes of 5Hz theta waves observed in frontal leads between 01:23 and 01:45.</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Patient Links</h3>
                            <p className="text-xs text-muted-foreground mb-4">Link this report to an existing patient roster entry to append the generated PDF.</p>
                            <button className="w-full py-2 rounded-lg border border-surface-border text-sm font-medium hover:bg-surface-border/50 transition-colors">Select Patient...</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function DoctorUploads() {
    return <PortalErrorBoundary serviceName="Offline Uploads"><DoctorUploadsInner /></PortalErrorBoundary>;
}
