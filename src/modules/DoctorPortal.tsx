import React, { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';

import { apiFetcher } from '../lib/fetcher';

const ClinicalDiagnosticsInner = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/patients/stream`, apiFetcher, {
        fallbackData: { status: 'streaming', rate: '500Hz' }
    });

    useEffect(() => {
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
        let offset = 0;

        const draw = () => {
            ctx.clearRect(0, 0, rect.width, rect.height);
            offset += 2;

            // Draw standard grid
            ctx.strokeStyle = 'hsl(var(--surface-border))';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < rect.width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, rect.height);
                ctx.stroke();
            }
            for (let i = 0; i < rect.height; i += 40) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(rect.width, i);
                ctx.stroke();
            }

            // Draw 3 desaturated clinical waveforms fitting the Deep Space clinical look
            const colors = ['#2E90FA', '#14B8A6', '#8B5CF6']; // Blue, Teal, Purple (desaturated by dark mode context)
            const baselines = [rect.height * 0.25, rect.height * 0.5, rect.height * 0.75];

            baselines.forEach((baseline, idx) => {
                ctx.beginPath();
                ctx.strokeStyle = colors[idx];
                ctx.lineWidth = 0.75; // The requested 0.75px width for clinical feeling

                for (let x = 0; x < rect.width; x++) {
                    // Complex waveform math (sine + noise)
                    const primary = Math.sin((x + offset * (idx + 1)) * 0.02) * 15;
                    const secondary = Math.cos((x - offset) * 0.05) * 5;
                    const noise = (Math.random() - 0.5) * 4;
                    const y = baseline + primary + secondary + noise;

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-display text-foreground">Clinical Diagnostics</h1>
                    <p className="text-muted-foreground mt-2">Real-time signal analysis and patient telemetry.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-1.5 text-xs font-medium tabular-nums text-foreground">
                        {isLoading ? 'INIT...' : data?.rate}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-sm">
                <div className="bg-sidebar px-6 py-3 border-b border-surface-border flex justify-between items-center">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cortex Stream C1-C3</span>
                    <div className="flex gap-2">
                        <span className="h-2 w-2 rounded-full bg-electric-blue"></span>
                        <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    </div>
                </div>

                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        className="h-[400px] w-full bg-background"
                        style={{ display: 'block' }}
                    />

                    {/* Annotation overlay layer */}
                    <div className="absolute top-4 left-4 rounded-md border border-surface-border bg-surface/80 p-3 backdrop-blur-md">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Target Anomaly</p>
                        <p className="text-sm font-medium tabular-nums">03:45:21 / +12µV</p>
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
