import React, { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Upload, File, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { apiFetcher, apiUploadFile } from '../lib/fetcher';

function UploadsInner() {
    // SWR will automatically fetch and manage the upload list state
    const { data: serverData, isLoading, mutate } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/uploads`, apiFetcher);
    const files = Array.isArray(serverData) ? serverData : (serverData?.uploads || []);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (newFiles: FileList | null) => {
        if (!newFiles || newFiles.length === 0) return;

        setIsUploading(true);
        try {
            for (let i = 0; i < newFiles.length; i++) {
                const formData = new FormData();
                formData.append('file', newFiles[i]);
                await apiUploadFile(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/upload`, formData);
            }
            await mutate(); // Refresh the list after all uploads finish
        } catch (err) {
            console.error('Failed to upload files:', err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('neurai_token') || ''}` }
            });
            mutate(); // Refresh list after deletion
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    const handleAnalyze = (id: string) => {
        // Mocking analysis connection for User uploads
        alert(`NeurAI is processing file ${id}. You will be notified when the clinical analysis is complete.`);
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
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
                className={`mb-6 flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed py-12 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 bg-card hover:border-primary/40'
                    }`}
            >
                <div>
                    <Upload size={32} className={`mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground/40'}`} />
                    <p className="text-sm font-medium text-muted-foreground">
                        {isDragging ? 'Drop files here to upload...' : 'Drag & drop EEG or voice files here'}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">.csv, .edf, .wav, .mp3 supported</p>
                </div>
            </div>

            <div className="space-y-2">
                <AnimatePresence>
                    {isLoading && !files.length ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-14 animate-pulse rounded-lg bg-card" />
                        ))
                    ) : (
                        files.map((file: any) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={file.id}
                                className="flex items-center justify-between rounded-xl border bg-card px-5 py-3 transition-colors hover:bg-secondary/30"
                            >
                                <div className="flex items-center gap-3">
                                    <File size={18} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{file.filename}</p>
                                        <p className="text-xs text-muted-foreground">{file.size} bytes · {new Date(file.created_at || file.uploadedAt || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleAnalyze(file.id || file.upload_id)}
                                        className="rounded-lg bg-emerald-500/10 text-emerald-500 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                                    >
                                        Analyse via NeurAI
                                    </button>
                                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{file.file_type || file.type || 'Data'}</span>
                                    <button onClick={() => handleDelete(file.id || file.upload_id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
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
