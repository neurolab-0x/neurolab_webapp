import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { apiFetcher } from '../lib/fetcher';
import { Activity, Cpu, Wifi, CheckCircle2, Loader2, Settings, Zap, Download, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortalStore } from '../store/usePortalStore';
import { getSecureRandomFloat } from '../lib/crypto';

const ClinicalDiagnosticsInner = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = usePortalStore();
    const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [config, setConfig] = useState({
        deviceType: 'Contec KT88-3200',
        system: '10-20 International',
        channels: '32',
        paste: 'Ten20 Conductive Paste',
    });

    const { data } = useQuery({
        queryKey: ['doctor-stream'],
        queryFn: () => apiFetcher(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/patients/stream`),
        enabled: connectionState === 'connected',
    });

    const handleConnect = () => {
        setConnectionState('connecting');
        setTimeout(() => {
            setConnectionState('connected');
        }, 2500); // Simulate connection handshake
    };

    const handleScreenshot = () => {
        if (!canvasRef.current) return;
        const url = canvasRef.current.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `EEG_Snapshot_${new Date().getTime()}.png`;
        a.click();
    };

    const handleSaveData = () => {
        // Generate a simulated CSV of the recent buffer
        const numChannels = parseInt(config.channels) || 16;
        let csvContent = "data:text/csv;charset=utf-8,Timestamp,";
        for (let i = 1; i <= numChannels; i++) csvContent += `Ch${i},`;
        csvContent += "\n";

        for (let t = 0; t < 100; t++) {
            csvContent += `${new Date().getTime() - (100 - t) * 10},`;
            for (let i = 1; i <= numChannels; i++) {
                csvContent += `${(getSecureRandomFloat() * 50 - 25).toFixed(2)},`;
            }
            csvContent += "\n";
        }

        const encodedUri = encodeURI(csvContent);
        const a = document.createElement('a');
        a.href = encodedUri;
        a.download = `EEG_Data_${new Date().getTime()}.csv`;
        a.click();
    };

    useEffect(() => {
        if (connectionState !== 'connected') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // High fidelity canvas setup
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        let animationFrameId: number;
        let time = 0;

        // Dynamically build channel montage based on user configuration
        const numChannels = parseInt(config.channels) || 16;
        let channels: string[] = [];

        if (config.system === '10-10 Extended' && numChannels >= 32) {
            // High-density 32-channel 10-10 system
            channels = [
                'Fp1-AF7', 'AF7-F7', 'F7-FT7', 'FT7-T7', 'T7-TP7', 'TP7-P7', 'P7-PO7', 'PO7-O1',
                'Fp2-AF8', 'AF8-F8', 'F8-FT8', 'FT8-T8', 'T8-TP8', 'TP8-P8', 'P8-PO8', 'PO8-O2',
                'Fp1-AF3', 'AF3-F3', 'F3-FC3', 'FC3-C3', 'C3-CP3', 'CP3-P3', 'P3-PO3', 'PO3-O1',
                'Fp2-AF4', 'AF4-F4', 'F4-FC4', 'FC4-C4', 'C4-CP4', 'CP4-P4', 'P4-PO4', 'PO4-O2'
            ];
        } else if (numChannels >= 24) {
            // Standard 24-channel clinical (adds midline/vertex)
            channels = [
                'Fp1-F7', 'F7-T3', 'T3-T5', 'T5-O1',
                'Fp2-F8', 'F8-T4', 'T4-T6', 'T6-O2',
                'Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1',
                'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2',
                'Fz-Cz', 'Cz-Pz', 'A1-T3', 'T4-A2',
                'Fz-F3', 'Fz-F4', 'Pz-P3', 'Pz-P4'
            ];
        } else {
            // Portable 16-channel routine
            channels = [
                'Fp1-F7', 'F7-T3', 'T3-T5', 'T5-O1',
                'Fp2-F8', 'F8-T4', 'T4-T6', 'T6-O2',
                'Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1',
                'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2'
            ];
            // Adjust length if literally 16 was selected
            channels = channels.slice(0, numChannels);
        }

        const channelSpacing = rect.height / (channels.length + 1);

        // Pre-generate unique noise parameters for each channel
        const channelParams = channels.map(() => ({
            alphaBase: getSecureRandomFloat() * 2 + 8, // 8-10Hz alpha dominance
            betaBase: getSecureRandomFloat() * 5 + 15, // 15-20Hz beta
            thetaBase: getSecureRandomFloat() * 3 + 4, // 4-7Hz
            ampMultiplier: getSecureRandomFloat() * 0.4 + 0.8 // 0.8x to 1.2x amplitude var
        }));

        // Impedance/Conductivity mapping based on setup
        let noiseFloor = 3; // Baseline Ten20 paste noise
        if (config.paste === 'Elefix Paste') noiseFloor = 1.5; // Premium, lower impedance
        if (config.paste === 'Saline Solution (Cap)') noiseFloor = 6; // Quick setup, higher baseline artifact

        const isDark = theme === 'dark';

        const draw = () => {
            ctx.clearRect(0, 0, rect.width, rect.height);
            time += 0.5;

            // Draw standard clinical background grid
            // Major grid (1 second intervals)
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 1;
            const pixelsPerSecond = 100;
            const timeOffset = (time * 2) % pixelsPerSecond;

            for (let i = -timeOffset; i < rect.width; i += pixelsPerSecond) {
                if (i > 0) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, rect.height);
                    ctx.stroke();
                }
            }
            // Minor grid (200ms intervals)
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
            ctx.lineWidth = 0.5;
            for (let i = -timeOffset; i < rect.width; i += (pixelsPerSecond / 5)) {
                if (i > 0) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, rect.height);
                    ctx.stroke();
                }
            }

            // Draw horizontal dividers for channels
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
            for (let i = 1; i <= channels.length; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * channelSpacing);
                ctx.lineTo(rect.width, i * channelSpacing);
                ctx.stroke();
            }

            // Draw Channel Labels (Fixed to the left)
            ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(241, 245, 249, 0.9)'; // Dark backdrop for labels
            ctx.fillRect(0, 0, 80, rect.height);

            ctx.font = '500 11px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Draw Waveforms
            channels.forEach((label, idx) => {
                const baseline = (idx + 1) * channelSpacing;
                const params = channelParams[idx];

                // Draw Label
                ctx.fillStyle = isDark ? '#64748B' : '#475569'; // Slate 500 vs Slate 600
                // Adjust font size slightly if 32 channels to fit
                if (numChannels >= 32) ctx.font = '400 9px system-ui, -apple-system, sans-serif';
                ctx.fillText(label, 40, baseline);

                // Draw Signal
                ctx.beginPath();

                // Colors based on hemisphere: Left=Blueish, Right=Tealish, Mid/Vertex=Purpleish
                if (label.includes('1') || label.includes('3') || label.includes('5') || label.includes('7')) {
                    ctx.strokeStyle = isDark ? 'rgba(46, 144, 250, 0.8)' : 'rgba(37, 99, 235, 0.8)'; // Left hemisphere
                } else if (label.includes('2') || label.includes('4') || label.includes('6') || label.includes('8')) {
                    ctx.strokeStyle = isDark ? 'rgba(20, 184, 166, 0.8)' : 'rgba(13, 148, 136, 0.8)'; // Right hemisphere
                } else {
                    ctx.strokeStyle = isDark ? 'rgba(139, 92, 246, 0.8)' : 'rgba(124, 58, 237, 0.8)'; // Midline (z/A)
                }

                ctx.lineWidth = 1;

                // Dynamic display gain (compress amplitude vertically if more channels)
                const gain = numChannels >= 32 ? 0.15 : numChannels >= 24 ? 0.25 : 0.35;

                // We draw from x=80 (after label) to the end
                for (let x = 80; x < rect.width; x++) {
                    const t = (x + time * 2) * 0.01;

                    // Simulate EEG: Combination of Alpha, Beta, Theta, and environmental noise
                    const alpha = Math.sin(t * params.alphaBase * Math.PI) * 12;
                    const beta = Math.sin(t * params.betaBase * Math.PI) * 4;
                    const theta = Math.sin(t * params.thetaBase * Math.PI) * 18;
                    const noise = (getSecureRandomFloat() - 0.5) * noiseFloor; // Noise scales with electrode paste type

                    // Add occasional artificial "blink" artifact to Fp1/Fp2 channels
                    let artifact = 0;
                    if ((label.includes('Fp1') || label.includes('Fp2')) && Math.sin(t * 0.5) > 0.98) {
                        artifact = 40 * Math.sin((t * 0.5 - 0.98) * 50);
                    }

                    const signal = (alpha + beta + theta + noise + artifact) * gain * params.ampMultiplier;
                    const y = baseline + signal;

                    if (x === 80) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationFrameId);
    }, [connectionState, config, theme]);

    if (connectionState === 'disconnected' || connectionState === 'connecting') {
        return (
            <div className="max-w-3xl mx-auto mt-6">
                <div className="mb-8 border-b border-surface-border pb-6">
                    <h1 className="text-3xl font-bold tracking-display text-foreground flex items-center gap-3">
                        Hardware Initialization
                    </h1>
                    <p className="text-muted-foreground mt-2">Configure and connect to local clinical EEG hardware.</p>
                </div>

                <div className="rounded-2xl border border-surface-border bg-surface p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">EEG Telemetry Link</h2>
                            <p className="text-sm text-muted-foreground">
                                {connectionState === 'connecting' ? 'Establishing secure handshake...' : 'Awaiting hardware configuration.'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 relative">
                        {connectionState === 'connecting' && (
                            <div className="absolute inset-0 z-10 bg-surface/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                                <div className="bg-background border border-surface-border rounded-lg p-4 flex items-center gap-3 shadow-xl">
                                    <Loader2 className="animate-spin text-[#2E90FA]" size={20} />
                                    <span className="text-sm font-medium text-foreground">Calibrating 10-20 Array...</span>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hardware Model</label>
                            <select
                                disabled={connectionState === 'connecting'}
                                value={config.deviceType}
                                onChange={e => setConfig({ ...config, deviceType: e.target.value })}
                                className="w-full h-11 rounded-lg border border-surface-border bg-background px-4 text-sm text-foreground focus:outline-none focus:border-[#2E90FA] transition-colors"
                            >
                                <option value="Contec KT88-3200">Contec KT88-3200 (Common)</option>
                                <option value="Contec KT88-2400">Contec KT88-2400</option>
                                <option value="Neurostyle Series">Neurostyle Mobile Series</option>
                                <option value="Nihon Kohden Neurofax">Nihon Kohden Neurofax</option>
                                <option value="Cadwell Easy III">Cadwell Easy III</option>
                                <option value="Natus Quantum">Natus Quantum</option>
                                <option value="RMS Maximus">RMS Maximus</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Electrode System</label>
                            <select
                                disabled={connectionState === 'connecting'}
                                value={config.system}
                                onChange={e => setConfig({ ...config, system: e.target.value })}
                                className="w-full h-11 rounded-lg border border-surface-border bg-background px-4 text-sm text-foreground focus:outline-none focus:border-[#2E90FA] transition-colors"
                            >
                                <option value="10-20 International">10-20 International System</option>
                                <option value="10-10 Extended">10-10 Extended System</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Channel Count</label>
                            <select
                                disabled={connectionState === 'connecting'}
                                value={config.channels}
                                onChange={e => setConfig({ ...config, channels: e.target.value })}
                                className="w-full h-11 rounded-lg border border-surface-border bg-background px-4 text-sm text-foreground focus:outline-none focus:border-[#2E90FA] transition-colors"
                            >
                                <option value="32">32 Channels (Diagnostic)</option>
                                <option value="24">24 Channels (Standard)</option>
                                <option value="16">16 Channels (Portable)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conductive Medium</label>
                            <select
                                disabled={connectionState === 'connecting'}
                                value={config.paste}
                                onChange={e => setConfig({ ...config, paste: e.target.value })}
                                className="w-full h-11 rounded-lg border border-surface-border bg-background px-4 text-sm text-foreground focus:outline-none focus:border-[#2E90FA] transition-colors"
                            >
                                <option value="Ten20 Conductive Paste">Ten20 Conductive Paste</option>
                                <option value="Elefix Paste">Elefix Paste</option>
                                <option value="Saline Solution (Cap)">Saline Solution (Pre-configured Cap)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        disabled={connectionState === 'connecting'}
                        onClick={handleConnect}
                        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#2E90FA] text-white font-semibold transition-all hover:bg-[#54A5FF] disabled:opacity-50"
                    >
                        {connectionState === 'connecting' && <Loader2 className="animate-spin" size={18} />}
                        {connectionState === 'connecting' ? 'Syncing Hardware...' : 'Initialize Connection'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold tracking-display text-foreground">Clinical Diagnostics</h1>
                    <p className="text-muted-foreground mt-2">Real-time signal analysis and patient telemetry.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-xs text-muted-foreground font-medium">
                        <Wifi size={14} className="text-emerald-500" />
                        {config.deviceType} ({config.channels} Ch)
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-1.5 text-xs font-medium tabular-nums text-foreground shadow-sm">
                        {data?.rate || <span className="text-emerald-500 animate-pulse">500Hz</span>}
                    </div>
                    {connectionState === 'connected' && (
                        <>
                            <button
                                onClick={handleScreenshot}
                                className="flex items-center gap-2 text-xs font-medium text-foreground bg-surface border border-surface-border hover:bg-surface-border/50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Camera size={14} className="text-muted-foreground" />
                                Snapshot
                            </button>
                            <button
                                onClick={handleSaveData}
                                className="flex items-center gap-2 text-xs font-medium text-foreground bg-surface border border-surface-border hover:bg-surface-border/50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Download size={14} className="text-muted-foreground" />
                                Save Data
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setConnectionState('disconnected')}
                        className="text-xs font-medium text-red-400 hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
                    >
                        Disconnect
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-sm ring-1 ring-white/5">
                <div className="bg-sidebar px-6 py-3 border-b border-surface-border flex justify-between items-center">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cortex Stream C1-C3 • {config.system} • {config.paste}</span>
                    <div className="flex gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#2E90FA] animate-pulse"></span>
                        <span className="h-2 w-2 rounded-full bg-[#14B8A6] animate-pulse" style={{ animationDelay: '200ms' }}></span>
                        <span className="h-2 w-2 rounded-full bg-[#8B5CF6] animate-pulse" style={{ animationDelay: '400ms' }}></span>
                    </div>
                </div>

                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        className="h-[350px] md:h-[450px] lg:h-[600px] w-full bg-background"
                        style={{ display: 'block' }}
                    />

                    {/* Annotation overlay layer */}
                    <div className="absolute top-4 right-4 rounded-md border border-surface-border bg-surface/80 p-3 backdrop-blur-md shadow-lg pointer-events-none">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#2E90FA] mb-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E90FA] animate-ping" />
                            Target Anomaly
                        </p>
                        <p className="text-sm font-medium tabular-nums text-foreground">03:45:21 / +12µV</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function DoctorPortal() {
    return (
        <PortalErrorBoundary serviceName="Diagnostic Rendering Engine">
            <ClinicalDiagnosticsInner />
        </PortalErrorBoundary>
    );
}
