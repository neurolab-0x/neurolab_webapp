import React from 'react';
import { motion } from 'framer-motion';
import {
    Users, Activity, UploadCloud, Calendar, Lightbulb,
    Award, Bell, RefreshCw, Settings, Sun, Play,
    SkipBack, SkipForward, ZoomIn, ZoomOut, ChevronDown,
    FileText, Hexagon
} from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    // Waveform generator for background visualization
    const generateWave = (offset: number, amplitude: number, frequency: number, phase: number) => {
        let points = [];
        for (let x = 0; x <= 1000; x += 5) {
            // Combine fundamental and harmonic frequencies
            const y1 = Math.sin((x * frequency) + phase) * (amplitude * 0.5);
            const y2 = Math.sin((x * frequency * 2.1) + phase) * (amplitude * 0.2);
            const y3 = Math.cos((x * frequency * 0.5) + phase) * (amplitude * 0.3);

            // Add low-amplitude noise simulating EEG artifact
            const noise = (Math.random() - 0.5) * (amplitude * 0.08);

            const finalY = offset + y1 + y2 + y3 + noise;
            points.push(`${x},${finalY}`);
        }
        return points.join(' L ');
    };

    const CHANNELS = [
        'Fp1-F7', 'F7-T3', 'T3-T5', 'T5-O1',
        'Fp2-F8', 'F8-T4', 'T4-T6', 'T6-O2',
        'Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1',
        'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2',
        'Fz-Cz', 'Cz-Pz'
    ];

    return (
        <div className="flex min-h-screen bg-[#05050A] selection:bg-[#2E90FA]/30 selection:text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            {/* Form container */}
            <div className="flex flex-1 flex-col justify-center px-4 sm:px-6 py-safe sm:py-safe-12 lg:flex-none lg:w-[43%] xl:w-[40%] 2xl:w-[40%] relative z-20 bg-[#05050A] safe-area-top safe-area-bottom">
                <div className="mx-auto w-full max-w-[360px] relative z-10">
                    {children}
                </div>
            </div>

            {/* Dashboard visual container */}
            <div className="relative hidden lg:flex flex-1 p-3">
                <div className="relative w-full h-full bg-[#0A0F1C] rounded-2xl overflow-hidden shadow-2xl border border-[#1E293B]/60">
                    {/* Background pattern layer */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.2]"
                        style={{
                            backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 150px, #000 150px, #000 300px)`
                        }}
                    />

                    {/* Ambient glow effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#2E90FA] rounded-full blur-[180px] opacity-15 pointer-events-none" />

                    {/* Off-screen clipped dashboard container */}
                    <div className="absolute top-[15%] left-[15%] w-[130%] h-[130%] min-w-[1000px] min-h-[850px] perspective-1000">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full h-full"
                        >
                            {/* Backdrop blur layer */}
                            <div className="absolute -inset-4 bg-white/[0.08] backdrop-blur-3xl rounded-tl-[2rem] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] z-0" />

                            {/* Inner Mockup Window */}
                            <div className="relative z-10 w-full h-full bg-[#0C0C14] rounded-tl-2xl border border-[#1E293B] shadow-[0_0_0_1px_rgba(30,41,59,0.5)] flex overflow-hidden">
                                {/* Sidebar */}
                                <div className="w-64 border-r border-[#1E293B] bg-[#05050A] flex flex-col h-full shrink-0">
                                    {/* Dashboard Logo */}
                                    <div className="h-16 flex items-center px-6 border-b border-[#1E293B]/50">
                                        <img src="/logo1.png" alt="Logo" className="h-8" />
                                        <span className="ml-3 text-lg font-bold text-white tracking-tight flex items-baseline">
                                            Neurolab <span className="w-1 h-1 rounded-full bg-[#2E90FA] ml-0.5" />
                                        </span>
                                    </div>

                                    {/* Nav menu */}
                                    <div className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
                                        {[
                                            { icon: Users, label: 'My Patients' },
                                            { icon: Activity, label: 'Live Analysis' },
                                            { icon: UploadCloud, label: 'Offline Uploads', active: true },
                                            { icon: Calendar, label: 'Schedule' },
                                            { icon: Lightbulb, label: 'Decision Support' },
                                            { icon: Award, label: 'Certifications' },
                                            { icon: Bell, label: 'Notifications' },
                                        ].map((item, i) => (
                                            <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${item.active ? 'bg-[#1E293B] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/50'}`}>
                                                <item.icon size={16} className={item.active ? "text-[#2E90FA]" : "text-slate-500"} />
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bottom Actions */}
                                    <div className="p-4 border-t border-[#1E293B]/50 flex flex-col gap-1">
                                        {[
                                            { icon: RefreshCw, label: 'Calendar Sync' },
                                            { icon: Settings, label: 'Settings' },
                                            { icon: Sun, label: 'Light Mode' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500">
                                                <item.icon size={16} />
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 flex flex-col h-full bg-[#05050A]/50">
                                    {/* Top Header */}
                                    <div className="h-16 border-b border-[#1E293B] flex items-center justify-between px-8 bg-[#0C0C14]">
                                        <span className="text-[13px] text-slate-400 font-medium tracking-wide">Facility Management Engine</span>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                            <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">System Online</span>
                                        </div>
                                    </div>

                                    {/* Dashboard Body */}
                                    <div className="p-8 flex-1 flex flex-col overflow-hidden">
                                        <div>
                                            <h1 className="text-2xl font-bold text-slate-50 tracking-tight">Offline Uploads & Analysis</h1>
                                            <p className="mt-1.5 text-sm text-slate-400">Upload EDF/CSV files for deep AI visualization and reporting.</p>
                                        </div>

                                        {/* Toolbar */}
                                        <div className="mt-8 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex bg-[#0C0C14] border border-[#1E293B] rounded-lg p-1">
                                                    <button className="p-1.5 bg-[#2E90FA] text-white rounded-md shadow-sm"><Play size={16} className="ml-0.5" fill="currentColor" /></button>
                                                    <button className="p-1.5 text-slate-400 hover:text-white px-3"><SkipBack size={16} /></button>
                                                    <button className="p-1.5 text-slate-400 hover:text-white px-3"><SkipForward size={16} /></button>
                                                </div>
                                                <div className="h-6 w-px bg-[#1E293B]" />
                                                <div className="flex gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-white"><ZoomIn size={16} /></button>
                                                    <button className="p-2 text-slate-400 hover:text-white"><ZoomOut size={16} /></button>
                                                </div>
                                                <div className="flex items-center justify-between w-48 px-3 py-2 bg-[#0C0C14] border border-[#1E293B] rounded-lg text-xs text-slate-200">
                                                    <span>All Channels / Signals</span>
                                                    <ChevronDown size={14} className="text-slate-500" />
                                                </div>
                                            </div>

                                            <button className="flex items-center gap-2 px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-lg text-[13px] font-bold transition-colors">
                                                <FileText size={16} /> Export PDF Report
                                            </button>
                                        </div>

                                        {/* EEG Chart Viewer */}
                                        <div className="mt-6 flex-1 border border-[#1E293B] rounded-xl bg-[#05050A] shadow-inner overflow-hidden flex flex-col">
                                            {/* Chart Header */}
                                            <div className="px-4 py-2.5 bg-[#0C0C14] border-b border-[#1E293B] flex justify-between items-center text-[10px] uppercase font-mono tracking-wider text-slate-500">
                                                <span>Playback: TEST_RELAXED_50EPOCHS.CSV</span>
                                                <span>Zoom: 1.0x</span>
                                            </div>

                                            {/* Chart Area */}
                                            <div className="flex-1 flex p-4 relative">
                                                {/* Y-Axis Labels */}
                                                <div className="w-14 shrink-0 flex flex-col justify-between py-2 text-[11px] font-mono text-slate-400 text-right pr-4 border-r border-[#1E293B]/30 z-10">
                                                    {CHANNELS.map((ch, i) => <span key={i}>{ch}</span>)}
                                                </div>

                                                {/* Grid Line (Red Cursor) */}
                                                <div className="absolute top-0 bottom-0 left-[65%] w-px bg-red-500/70 z-20" style={{ borderLeft: '1px dashed rgba(239,68,68,0.7)' }} />

                                                {/* SVG Waveforms */}
                                                <div className="flex-1 h-full mx-2 overflow-hidden relative opacity-80">
                                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000">
                                                        {/* Draw horizontal grid lines */}
                                                        {CHANNELS.map((_, i) => (
                                                            <line key={`grid-${i}`} x1="0" y1={(1000 / CHANNELS.length) * i + (1000 / CHANNELS.length / 2)} x2="1000" y2={(1000 / CHANNELS.length) * i + (1000 / CHANNELS.length / 2)} stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="4 4" />
                                                        ))}

                                                        {/* Draw complex sine waves simulating EEG */}
                                                        {CHANNELS.map((_, i) => {
                                                            const rowHeight = 1000 / CHANNELS.length;
                                                            const offset = (rowHeight * i) + (rowHeight / 2);

                                                            // Determine color based on vertical position (blue -> green -> purple)
                                                            let color = "#3b82f6"; // default blue
                                                            if (i > 5 && i <= 11) color = "#10b981"; // green
                                                            if (i > 11) color = "#8b5cf6"; // purple

                                                            // Generate unique frequency/phase for each channel
                                                            const freq = 0.05 + (i * 0.003) + (Math.sin(i) * 0.02);
                                                            const phase = i * 2.5;

                                                            return (
                                                                <path
                                                                    key={`wave-${i}`}
                                                                    d={`M 0,${offset} L ` + generateWave(offset, rowHeight * 0.8, freq, phase)}
                                                                    fill="none"
                                                                    stroke={color}
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="opacity-90"
                                                                />
                                                            );
                                                        })}
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
