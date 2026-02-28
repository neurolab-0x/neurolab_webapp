import React, { useState, useRef, useEffect } from 'react';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { UploadCloud, FileType, Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, Download, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

const DoctorUploadsInner = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);

    // Parse Real Data
    const [parsedData, setParsedData] = useState<{ labels: string[], data: number[][], maxVals: number[] } | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timeRef = useRef(0);
    const [zoom, setZoom] = useState(1);

    const [playbackState, setPlaybackState] = useState<'playing' | 'paused'>('paused');
    const playbackStateRef = useRef(playbackState);
    useEffect(() => { playbackStateRef.current = playbackState; }, [playbackState]);

    const [focusChannel, setFocusChannel] = useState<string | null>(null);

    // Patient Selection
    const [showPatientSelect, setShowPatientSelect] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalysisComplete(false);
            setParsedData(null);
        }
    };

    const runAnalysis = () => {
        if (!file) return;
        setIsAnalyzing(true);

        if (file.name.toLowerCase().endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                if (text) {
                    const lines = text.split('\n').filter(l => l.trim().length > 0);
                    if (lines.length > 0) {
                        const headers = lines[0].split(',').map(h => h.trim());
                        const hasHeaders = isNaN(parseFloat(headers[0]));
                        const dataStartIndex = hasHeaders ? 1 : 0;

                        let timeColIndex = -1;
                        if (hasHeaders) {
                            timeColIndex = headers.findIndex(h => h.toLowerCase() === 'time' || h.toLowerCase() === 'timestamp');
                        }

                        const validCols = headers.reduce((acc, h, i) => {
                            if (i !== timeColIndex) acc.push(i);
                            return acc;
                        }, [] as number[]);

                        const standardLabels = [
                            'Fp1-F7', 'F7-T3', 'T3-T5', 'T5-O1', // Left Temporal
                            'Fp2-F8', 'F8-T4', 'T4-T6', 'T6-O2', // Right Temporal
                            'Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1', // Left Parasagittal
                            'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2', // Right Parasagittal
                            'Fz-Cz', 'Cz-Pz',                    // Midline
                            'A1-T3', 'T4-A2',                    // Additional Temporal/Ear
                            'Fz-F3', 'Fz-F4', 'Pz-P3', 'Pz-P4'   // Transverse Reference
                        ];

                        const finalLabels = validCols.map((colIdx, i) => {
                            if (hasHeaders && headers[colIdx]) return headers[colIdx];
                            return standardLabels[i] || `Ch ${i + 1}`;
                        });

                        const dataMatrix: number[][] = [];
                        for (let i = 0; i < validCols.length; i++) dataMatrix.push([]);

                        const maxLines = Math.min(lines.length, 25000); // Process up to 25k points to ensure smooth memory
                        for (let i = dataStartIndex; i < maxLines; i++) {
                            const row = lines[i].split(',');
                            if (row.length <= Math.max(...validCols)) continue;
                            validCols.forEach((colIdx, outIdx) => {
                                const val = parseFloat(row[colIdx]);
                                dataMatrix[outIdx].push(isNaN(val) ? 0 : val);
                            });
                        }

                        const maxVals = dataMatrix.map(chanLine => {
                            let max = 0;
                            for (let i = 0; i < chanLine.length; i++) {
                                if (Math.abs(chanLine[i]) > max) max = Math.abs(chanLine[i]);
                            }
                            return max === 0 ? 1 : max;
                        });

                        setParsedData({ labels: finalLabels, data: dataMatrix, maxVals });
                    }
                }
                finishAnalysis();
            };
            reader.readAsText(file);
        } else {
            // Simulated delay for other files
            setTimeout(finishAnalysis, 2000);
        }
    };

    const finishAnalysis = () => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        timeRef.current = 0;
    };

    const generateReport = () => {
        const doc = new jsPDF();

        doc.setTextColor(230, 230, 230);
        doc.setFontSize(60);
        doc.setFont("helvetica", "bold");
        doc.text("NeurAI", 50, 150, { angle: 45 });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.text("NeurAI Clinical EEG Report", 20, 25);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 32);
        doc.text("Clinic: Kigali Neuro-Diagnostic Center", 20, 37);
        doc.text("Attending Physician: Dr. Landry", 20, 42);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 47, 190, 47);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Patient Information", 20, 60);
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);

        const ptNameStr = selectedPatient ? selectedPatient.split(' (')[0] : "Unknown";
        const ptIdStr = selectedPatient ? selectedPatient.match(/\(([^)]+)\)/)?.[1] : "Unlinked";

        doc.text(`Name: ${ptNameStr}`, 20, 68);
        doc.text(`ID: ${ptIdStr}`, 20, 74);
        doc.text("DOB: 15-Jun-1985 (Age: 40)", 20, 80);
        doc.text("Recording File: " + (file?.name || "Unknown.edf"), 20, 86);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("NeurAI Automated Findings", 20, 105);

        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text("1. Normal Alpha Rhythm: Found dominant 9Hz oscillations over Occipital regions.", 20, 115);
        doc.text("2. Intermittent Slowing: Brief episodes of 5Hz theta waves observed in", 20, 122);
        doc.text("   frontal leads between 01:23 and 01:45.", 20, 128);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Physician Recommendations", 20, 150);

        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text("• Proceed with scheduled Follow-up via User Portal.", 20, 160);
        doc.text("• Adjust Levetiracetam dosage from 500mg BID to 750mg BID.", 20, 167);
        doc.text("• Monitor for increased daytime somnolence.", 20, 174);

        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("This report is generated with the assistance of Artificial Intelligence.", 20, 280);
        doc.text("Final clinical judgment is reserved for the attending physician.", 20, 285);

        doc.save(`NeurAI_Report_${new Date().getTime()}.pdf`);
    };

    // Render loop
    useEffect(() => {
        if (!analysisComplete || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const logicalWidth = rect.width || canvas.parentElement?.clientWidth || 800;
        const logicalHeight = rect.height || 600;

        // Reset and apply High-DPI scaling when dependencies change
        canvas.width = logicalWidth * dpr;
        canvas.height = logicalHeight * dpr;
        ctx.scale(dpr, dpr);

        let continueLoop = true;
        const SIDEBAR_WIDTH = 110;

        const drawFrame = () => {
            if (!continueLoop) return;
            const width = logicalWidth;
            const height = logicalHeight;

            // 1. Clear Main Background (Premium Dark Slate)
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, width, height);

            // 2. Draw Grid Lines (Only for signal area)
            ctx.strokeStyle = '#1e293b'; // Subtle line
            ctx.lineWidth = 1;
            for (let x = SIDEBAR_WIDTH + 50; x < width; x += 50) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            }
            for (let y = 0; y < height; y += 50) {
                ctx.beginPath(); ctx.moveTo(SIDEBAR_WIDTH, y); ctx.lineTo(width, y); ctx.stroke();
            }

            // 3. Draw Left Axis/Labels Panel
            ctx.fillStyle = '#111827'; // Darker contrasting slate for sidebar
            ctx.fillRect(0, 0, SIDEBAR_WIDTH, height);
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(SIDEBAR_WIDTH, 0); ctx.lineTo(SIDEBAR_WIDTH, height); ctx.stroke();

            const activeChannels = focusChannel ? 1 : (parsedData ? parsedData.labels.length : 24);
            const channelHeight = height / activeChannels;

            const labels = parsedData
                ? (focusChannel ? [focusChannel] : parsedData.labels)
                : (focusChannel ? [focusChannel] : [
                    'Fp1-F7', 'F7-T3', 'T3-T5', 'T5-O1',
                    'Fp2-F8', 'F8-T4', 'T4-T6', 'T6-O2',
                    'Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1',
                    'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2',
                    'Fz-Cz', 'Cz-Pz',
                    'A1-T3', 'T4-A2',
                    'Fz-F3', 'Fz-F4', 'Pz-P3', 'Pz-P4'
                ]);

            // Setup Text Style perfectly
            ctx.font = '500 10.5px "Inter", system-ui, sans-serif'; // Clean, crisp font
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Setup Line Style
            ctx.lineWidth = 1.0;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            for (let c = 0; c < activeChannels; c++) {
                const yOffset = c * channelHeight + (channelHeight / 2);
                let label = labels[c];
                if (label.length > 15) label = label.substring(0, 13) + '...';

                // Color mapping logic
                const l = label.toUpperCase();
                let strokeColor = '#3b82f6'; // Deep Blue default

                const leftHem = ['FP1-F7', 'F7-T3', 'T3-T5', 'T5-O1', 'FP1-F3', 'F3-C3', 'C3-P3', 'P3-O1', 'A1-T3', 'FZ-F3', 'PZ-P3', 'ALPHA', 'THETA', 'DELTA'];
                const rightHem = ['FP2-F8', 'F8-T4', 'T4-T6', 'T6-O2', 'FP2-F4', 'F4-C4', 'C4-P4', 'P4-O2', 'T4-A2', 'FZ-F4', 'PZ-P4', 'BETA', 'GAMMA'];
                const midline = ['FZ-CZ', 'CZ-PZ', 'STATE'];

                if (leftHem.includes(l)) strokeColor = '#3b82f6';
                else if (rightHem.includes(l)) strokeColor = '#10b981'; // Emerald
                else if (midline.includes(l)) strokeColor = '#8b5cf6'; // Purple
                else if (l.match(/[13579]\b/) || l.match(/[13579]-/)) strokeColor = '#3b82f6';
                else if (l.match(/[2468]\b/) || l.match(/[2468]-/)) strokeColor = '#10b981';
                else if (l.match(/Z\b/) || l.match(/Z-/)) strokeColor = '#8b5cf6';

                // Draw Label in sidebar
                ctx.fillStyle = '#64748b'; // Slate 500 for clean subtle text
                ctx.fillText(label, SIDEBAR_WIDTH / 2, yOffset);

                // Draw Signal Trace
                ctx.strokeStyle = strokeColor;
                ctx.beginPath();

                for (let x = SIDEBAR_WIDTH; x < width; x++) {
                    const dataIndex = Math.floor(timeRef.current + (x - SIDEBAR_WIDTH) / zoom);
                    let y = yOffset;

                    if (parsedData) {
                        const originalIndex = focusChannel ? parsedData.labels.indexOf(focusChannel) : c;
                        const validIndex = originalIndex >= 0 ? originalIndex : 0;
                        const dataArray = parsedData.data[validIndex];
                        if (dataArray && dataIndex < dataArray.length) {
                            const val = dataArray[dataIndex];
                            const maxVal = Math.max(parsedData.maxVals[validIndex], 0.001);
                            y -= (val / maxVal) * (channelHeight * 0.4);
                        }
                    } else {
                        const originalIndex = focusChannel ? parseInt(label.charCodeAt(0).toString()) % 16 : c;
                        const freq1 = 0.05 + (originalIndex * 0.005);
                        const freq2 = 0.02 + (originalIndex * 0.01);
                        y += Math.sin(dataIndex * freq1) * (channelHeight * 0.3) + Math.cos(dataIndex * freq2) * (channelHeight * 0.15) + (Math.random() - 0.5) * 5;
                    }

                    if (x === SIDEBAR_WIDTH) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Central Playhead Reference (Red Dashed Line)
            ctx.strokeStyle = '#ef4444'; // Red 500
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            const playheadX = SIDEBAR_WIDTH + (width - SIDEBAR_WIDTH) * 0.5;
            ctx.moveTo(playheadX, 0);
            ctx.lineTo(playheadX, height);
            ctx.stroke();
            ctx.setLineDash([]);

            if (playbackStateRef.current === 'playing') {
                timeRef.current += 2 / zoom;
                if (parsedData) {
                    const maxLen = parsedData.data[0].length;
                    if (timeRef.current > maxLen) {
                        timeRef.current = maxLen;
                        setPlaybackState('paused'); // Auto-pause at end
                    }
                }
            }

            requestAnimationFrame(drawFrame);
        };

        const animId = requestAnimationFrame(drawFrame);

        return () => {
            continueLoop = false;
            cancelAnimationFrame(animId);
        };
    }, [analysisComplete, focusChannel, zoom, parsedData]);

    const handleSkip = (dir: number) => {
        timeRef.current = Math.max(0, timeRef.current + (dir * 100 / zoom));
        if (parsedData) {
            const maxLen = Math.max(0, parsedData.data[0].length - 100);
            if (timeRef.current > maxLen) timeRef.current = maxLen;
        }
    };

    const handleZoom = (dir: number) => {
        setZoom(z => Math.max(0.1, Math.min(z + dir * 0.2, 5)));
    };

    const channelOptions = parsedData
        ? parsedData.labels
        : [
            'Fp1-F7', 'F7-T3', 'T3-T5', 'T5-O1',
            'Fp2-F8', 'F8-T4', 'T4-T6', 'T6-O2',
            'Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1',
            'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2',
            'Fz-Cz', 'Cz-Pz',
            'A1-T3', 'T4-A2',
            'Fz-F3', 'Fz-F4', 'Pz-P3', 'Pz-P4'
        ];

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
                                <button onClick={() => handleSkip(-1)} className="p-2 text-muted-foreground hover:bg-surface-border/50 rounded-lg transition-colors" title='Rewind'><SkipBack size={18} /></button>
                                <button onClick={() => handleSkip(1)} className="p-2 text-muted-foreground hover:bg-surface-border/50 rounded-lg transition-colors" title='Fast Forward'><SkipForward size={18} /></button>
                            </div>
                            <div className="flex items-center gap-2 border-l border-surface-border pl-4">
                                <button onClick={() => handleZoom(-1)} className="p-2 text-muted-foreground hover:bg-surface-border/50 rounded-lg transition-colors" title='Zoom Out'><ZoomOut size={18} /></button>
                                <button onClick={() => handleZoom(1)} className="p-2 text-muted-foreground hover:bg-surface-border/50 rounded-lg transition-colors" title='Zoom In'><ZoomIn size={18} /></button>
                            </div>
                            <div className="border-l border-surface-border pl-4">
                                <select
                                    className="h-9 rounded-lg border border-surface-border bg-background px-3 text-sm text-foreground focus:outline-none focus:border-[#2E90FA] max-w-xs"
                                    value={focusChannel || ''}
                                    onChange={e => setFocusChannel(e.target.value || null)}
                                >
                                    <option value="">All Channels / Signals</option>
                                    {channelOptions.map(l => (
                                        <option key={l} value={l}>Focus: {l}</option>
                                    ))}
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
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Playback: {file?.name} {parsedData && `(${parsedData.labels.length} Extracted Channels)`}</span>
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Zoom: {zoom.toFixed(1)}x</span>
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
                                    <p className="text-xs text-muted-foreground mt-1">Found dominant oscillations over Occipital regions matching expected baseline.</p>
                                </div>
                                <div className="border-l-2 border-amber-500 pl-4 py-1">
                                    <p className="text-sm font-medium text-foreground">Intermittent Slowing</p>
                                    <p className="text-xs text-muted-foreground mt-1">Brief episodes of theta waves observed in frontal leads between 01:23 and 01:45.</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm relative">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Patient Links</h3>
                            <p className="text-xs text-muted-foreground mb-4">Link this report to an existing patient roster entry to append the generated PDF.</p>

                            <button
                                onClick={() => setShowPatientSelect(!showPatientSelect)}
                                className="w-full py-2 rounded-lg border border-surface-border bg-background text-sm font-medium hover:bg-surface-border/50 text-foreground transition-colors"
                            >
                                {selectedPatient ? `Linked: ${selectedPatient}` : 'Select Patient...'}
                            </button>

                            <AnimatePresence>
                                {showPatientSelect && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute left-6 right-6 top-[calc(100%-1rem)] mt-2 border border-surface-border rounded-lg bg-surface shadow-xl p-2 max-h-40 overflow-y-auto z-10"
                                    >
                                        {['John Doe (P-98241)', 'Marie Claire (P-33214)', 'Jean Pierre (P-10492)', 'Paul Kagame Jr. (P-88421)'].map(p => (
                                            <button
                                                key={p}
                                                onClick={() => { setSelectedPatient(p); setShowPatientSelect(false); }}
                                                className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-[#2E90FA] hover:text-white rounded-md transition-colors"
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
