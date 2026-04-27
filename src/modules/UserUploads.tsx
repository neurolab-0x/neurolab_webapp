import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Upload, File, Trash2, Loader2, X, Download, UserCheck, MessageSquare, BrainCircuit, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

import { apiFetcher, apiUploadFile } from '../lib/fetcher';

interface AnalysisResult {
    fileName: string;
    timestamp: string;
    raw: unknown;
    stateLabel?: string;
    confidence?: number;
    recommendations?: string[];
    dominantState?: number;
    statePercentages?: Record<string, number>;
    metadata?: Record<string, unknown>;
}

function UploadsInner() {
    const queryClient = useQueryClient();
    const { data: serverData, isPending: isLoading } = useQuery({
        queryKey: ['user-uploads'],
        queryFn: () => apiFetcher(`${import.meta.env.VITE_API_BASE_URL}/api/uploads`),
    });
    const mutate = () => queryClient.invalidateQueries({ queryKey: ['user-uploads'] });
    const files = Array.isArray(serverData) ? serverData : (serverData?.uploads || []);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Analysis state
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const handleFileUpload = async (newFiles: FileList | null) => {
        if (!newFiles || newFiles.length === 0) return;
        setIsUploading(true);
        try {
            for (let i = 0; i < newFiles.length; i++) {
                const formData = new FormData();
                formData.append('file', newFiles[i]);
                await apiUploadFile(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/upload`, formData);
            }
            await mutate();
        } catch (err) {
            console.error('Failed to upload files:', err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files); };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('neurolab_token') || ''}` }
            });
            mutate();
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    const handleAnalyze = async (fileRec: { id?: string; _id?: string; upload_id?: string; url?: string; filepath?: string; fileUrl?: string; filePath?: string; filename?: string; fileName?: string }) => {
        const id = fileRec.id || fileRec.upload_id || fileRec._id;
        setAnalyzingId(id);
        setAnalysisResult(null);
        setAnalysisError(null);

        try {
            const fileUrl = fileRec.url || fileRec.filepath || fileRec.fileUrl || fileRec.filePath;
            let fileToAnalyze: File | null = null;

            if (fileUrl) {
                const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${import.meta.env.VITE_API_BASE_URL}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
                const res = await fetch(fullUrl);
                if (res.ok) {
                    const blob = await res.blob();
                    fileToAnalyze = new globalThis.File([blob], fileRec.filename || fileRec.fileName || 'server_file.edf');
                } else {
                    throw new Error(`Could not retrieve file (HTTP ${res.status})`);
                }
            } else {
                throw new Error('No file URL available for this upload');
            }

            const formData = new FormData();
            formData.append('file', fileToAnalyze);
            formData.append('sessionId', 'manual-analysis');

            const response = await apiUploadFile(`${import.meta.env.VITE_API_BASE_URL}/api/analysis`, formData);

            if (response) {
                const data = response.analysis?.results || response.analysis?.summary || response.analysis || response;
                const parsed: AnalysisResult = {
                    fileName: fileRec.filename || fileRec.fileName || 'Unknown File',
                    timestamp: new Date().toLocaleString(),
                    raw: data,
                    stateLabel: data.state_label || undefined,
                    confidence: data.confidence !== undefined ? data.confidence * 100 : undefined,
                    recommendations: data.recommendations || data.clinical_recommendations || undefined,
                    dominantState: data.dominant_state,
                    statePercentages: data.state_percentages,
                    metadata: data.metadata,
                };
                setAnalysisResult(parsed);
            } else {
                throw new Error('Empty response from Neurolab backend');
            }
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Analysis failed", error);
            setAnalysisError(error.message || 'Server error');
        } finally {
            setAnalyzingId(null);
        }
    };

    // --- Action Handlers ---

    const getUserName = () => {
        try {
            const stored = localStorage.getItem('neurolab_user');
            if (stored) {
                const user = JSON.parse(stored);
                return user.name || user.fullName || user.firstName || 'Patient';
            }
        } catch { /* ignore */ }
        return 'Patient';
    };

    const handleSaveReport = () => {
        if (!analysisResult) return;
        const userName = getUserName();
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Neurolab Watermark (diagonal, faint) ---
        doc.setTextColor(230, 230, 240);
        doc.setFontSize(60);
        doc.text('Neurolab', pageWidth / 2 - 40, 160, { angle: 35 });

        // --- Header Bar ---
        doc.setFillColor(15, 23, 42); // Deep navy
        doc.rect(0, 0, pageWidth, 38, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Neurolab', 14, 18);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Neural Analysis Report', 14, 26);
        doc.text(`Generated: ${analysisResult.timestamp}`, 14, 33);

        // --- Patient Info Section ---
        let y = 50;
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Patient Information', 14, y);
        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text(`Name: ${userName}`, 14, y); y += 6;
        doc.text(`File: ${analysisResult.fileName}`, 14, y); y += 6;
        if (analysisResult.metadata?.session_id) {
            doc.text(`Session: ${analysisResult.metadata.session_id}`, 14, y); y += 6;
        }

        // --- Divider ---
        y += 4;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(14, y, pageWidth - 14, y);
        y += 10;

        // --- Key Findings ---
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Key Findings', 14, y);
        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);

        if (analysisResult.stateLabel) {
            doc.text(`Dominant State: ${analysisResult.stateLabel.charAt(0).toUpperCase() + analysisResult.stateLabel.slice(1)}`, 14, y);
            y += 6;
        }
        if (analysisResult.confidence !== undefined) {
            doc.text(`Confidence: ${analysisResult.confidence.toFixed(2)}%`, 14, y);
            y += 6;
        }
        if (analysisResult.statePercentages) {
            const pctStr = Object.entries(analysisResult.statePercentages).map(([k, v]) => `State ${k}: ${v}%`).join(', ');
            doc.text(`State Distribution: ${pctStr}`, 14, y); y += 6;
        }

        // --- Divider ---
        y += 4;
        doc.line(14, y, pageWidth - 14, y);
        y += 10;

        // --- Recommendations ---
        if (analysisResult.recommendations && analysisResult.recommendations.length > 0) {
            doc.setTextColor(30, 41, 59);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('Clinical Recommendations', 14, y);
            y += 8;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);

            for (const rec of analysisResult.recommendations) {
                if (!rec.trim()) continue;
                const lines = doc.splitTextToSize(`• ${rec}`, pageWidth - 32);
                if (y + lines.length * 5 > 275) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(lines, 16, y);
                y += lines.length * 5 + 2;
            }
        }

        // --- Footer ---
        const pageCount = doc.getNumberOfPages();
        for (let p = 1; p <= pageCount; p++) {
            doc.setPage(p);
            doc.setFontSize(7);
            doc.setTextColor(160, 170, 185);
            doc.text('Neurolab — Confidential Medical Report', 14, 290);
            doc.text(`Page ${p} of ${pageCount}`, pageWidth - 35, 290);
        }

        doc.save(`Neurolab_Report_${analysisResult.fileName.replace(/\.[^/.]+$/, '')}_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const handleShareWithDoctor = () => {
        if (!analysisResult) return;
        const existing = JSON.parse(localStorage.getItem('neurolab_shared_reports') || '[]');
        existing.push({
            ...analysisResult,
            sharedAt: new Date().toISOString(),
            patientName: getUserName(),
        });
        localStorage.setItem('neurolab_shared_reports', JSON.stringify(existing));
        setShareConfirmation('doctor');
        setTimeout(() => setShareConfirmation(null), 3000);
    };

    const handleDiscussWithAI = () => {
        if (!analysisResult) return;
        sessionStorage.setItem('neurolab_analysis_context', JSON.stringify({
            fileName: analysisResult.fileName,
            stateLabel: analysisResult.stateLabel,
            confidence: analysisResult.confidence,
            recommendations: analysisResult.recommendations,
            timestamp: analysisResult.timestamp,
            raw: analysisResult.raw,
        }));
        navigate('/user/chat');
    };

    const [shareConfirmation, setShareConfirmation] = useState<'doctor' | null>(null);

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6 md:mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">File Uploads</h1>
                    <p className="mt-1 text-sm text-muted-foreground">EEG recordings and voice samples</p>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    accept=".csv,.edf,.wav,.mp3"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {isUploading ? 'Uploading...' : 'Upload File'}
                </button>
            </div>

            {/* Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mb-6 flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed py-12 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 bg-card hover:border-primary/40'}`}
            >
                <div>
                    <Upload size={32} className={`mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground/40'}`} />
                    <p className="text-sm font-medium text-muted-foreground">
                        {isDragging ? 'Drop files here to upload...' : 'Drag & drop EEG or voice files here'}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">.csv, .edf, .wav, .mp3 supported</p>
                </div>
            </div>

            {/* File list */}
            <div className="space-y-2">
                <AnimatePresence>
                    {isLoading && !files.length ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-14 animate-pulse rounded-lg bg-card" />
                        ))
                    ) : (
                        files.map((file: { id?: string; _id?: string; upload_id?: string; filename?: string; fileName?: string; size?: number; metadata?: { fileSize?: number }; created_at?: string; uploadedAt?: string; createdAt?: string; file_type?: string; fileType?: string; type?: string }) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={file.id || file._id || file.upload_id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-card px-4 md:px-5 py-3 transition-colors hover:bg-secondary/30"
                            >
                                <div className="flex items-center gap-3">
                                    <File size={18} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{file.filename || file.fileName || 'Unknown File'}</p>
                                        <p className="text-xs text-muted-foreground">{file.size || file.metadata?.fileSize || 0} bytes · {new Date(file.created_at || file.uploadedAt || file.createdAt || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <button
                                        onClick={() => handleAnalyze(file)}
                                        disabled={!!analyzingId}
                                        className="rounded-lg bg-emerald-500/10 text-emerald-500 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                    >
                                        {analyzingId === (file.id || file._id || file.upload_id) ? (
                                            <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Analyzing...</span>
                                        ) : 'Analyse via Neurolab'}
                                    </button>
                                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{file.file_type || file.fileType || file.type || 'Data'}</span>
                                    <button onClick={() => handleDelete(file.id || file._id || file.upload_id)} className="text-muted-foreground hover:text-destructive transition-colors p-2 touch-target flex items-center justify-center"><Trash2 size={14} /></button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Analysis Error Banner */}
            <AnimatePresence>
                {analysisError && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className="text-destructive mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-destructive">Analysis Failed</h3>
                                <p className="mt-1 text-xs text-destructive/80">{analysisError}</p>
                            </div>
                            <button onClick={() => setAnalysisError(null)} className="text-destructive/60 hover:text-destructive transition-colors"><X size={16} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Analysis Results Panel */}
            <AnimatePresence>
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.97 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="mt-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.03] shadow-lg"
                    >
                        {/* Panel Header */}
                        <div className="flex items-center justify-between border-b border-border/50 bg-primary/5 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                    <BrainCircuit size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-foreground">Neurolab Analysis Report</h3>
                                    <p className="text-xs text-muted-foreground">{analysisResult.fileName} · {analysisResult.timestamp}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAnalysisResult(null)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Results Body */}
                        <div className="p-6 space-y-5">
                            {/* Key Metrics Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {analysisResult.stateLabel && (
                                    <div className="rounded-xl border border-border/50 bg-surface/50 p-4 text-center">
                                        <Activity size={18} className="mx-auto mb-2 text-emerald-500" />
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">State</p>
                                        <p className="mt-1 text-lg font-bold text-foreground capitalize">{analysisResult.stateLabel}</p>
                                    </div>
                                )}
                                {analysisResult.confidence !== undefined && (
                                    <div className="rounded-xl border border-border/50 bg-surface/50 p-4 text-center">
                                        <CheckCircle2 size={18} className={`mx-auto mb-2 ${analysisResult.confidence > 50 ? 'text-emerald-500' : 'text-amber-500'}`} />
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Confidence</p>
                                        <p className="mt-1 text-lg font-bold text-foreground">{analysisResult.confidence.toFixed(1)}%</p>
                                    </div>
                                )}
                                {analysisResult.statePercentages && (
                                    <div className="rounded-xl border border-border/50 bg-surface/50 p-4 text-center">
                                        <BrainCircuit size={18} className="mx-auto mb-2 text-primary" />
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Distribution</p>
                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            {Object.entries(analysisResult.statePercentages).map(([k, v]) => `State${k}: ${v}%`).join(' ')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Recommendations */}
                            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                                <div>
                                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommendations</h4>
                                    <div className="space-y-2">
                                        {analysisResult.recommendations.filter(r => r.trim()).map((rec, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-2.5 rounded-lg border border-border/30 bg-secondary/20 px-4 py-2.5 text-sm text-foreground/90"
                                            >
                                                <span className="mt-0.5 shrink-0 text-primary">{rec.startsWith('⚠️') ? '⚠️' : rec.startsWith('🎯') ? '🎯' : rec.startsWith('🌿') ? '🌿' : rec.startsWith('💚') ? '💚' : '•'}</span>
                                                <span>{rec.replace(/^(⚠️|🎯|🌿|💚)\s*/u, '')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Low confidence warning */}
                            {analysisResult.confidence !== undefined && analysisResult.confidence < 10 && (
                                <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-600 dark:text-amber-400">
                                    <AlertTriangle size={14} className="shrink-0" />
                                    <span>Low confidence detected. Consider recording a longer session for more accurate results.</span>
                                </div>
                            )}
                        </div>

                        {/* Action Footer */}
                        <div className="flex flex-wrap items-center gap-3 border-t border-border/50 bg-secondary/10 px-6 py-4">
                            <button
                                onClick={handleSaveReport}
                                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                            >
                                <Download size={14} />
                                Save as PDF
                            </button>
                            <button
                                onClick={handleShareWithDoctor}
                                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-secondary transition-all hover:scale-105 active:scale-95"
                            >
                                <UserCheck size={14} />
                                {shareConfirmation === 'doctor' ? (
                                    <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={12} /> Shared!</span>
                                ) : 'Share with Doctor'}
                            </button>
                            <button
                                onClick={handleDiscussWithAI}
                                className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary shadow-sm hover:bg-primary/10 transition-all hover:scale-105 active:scale-95"
                            >
                                <MessageSquare size={14} />
                                Discuss with Neurolab
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function UserUploads() {
    return (
        <PortalErrorBoundary serviceName="Upload Service">
            <UploadsInner />
        </PortalErrorBoundary>
    );
}
