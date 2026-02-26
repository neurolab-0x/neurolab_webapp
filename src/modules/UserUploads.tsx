import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Upload, File, Trash2 } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function UploadsInner() {
    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/uploads`, apiFetcher, {
        fallbackData: [
            { id: 'upl_001', filename: 'session_eeg_feb25.csv', size: '2.4 MB', uploadedAt: '2026-02-25 14:32', type: 'EEG' },
            { id: 'upl_002', filename: 'voice_sample_feb24.wav', size: '8.1 MB', uploadedAt: '2026-02-24 09:15', type: 'Voice' },
            { id: 'upl_003', filename: 'baseline_recording.csv', size: '1.8 MB', uploadedAt: '2026-02-20 16:45', type: 'EEG' },
        ]
    });

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">File Uploads</h1>
                    <p className="mt-1 text-sm text-muted-foreground">EEG recordings and voice samples</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                    <Upload size={14} /> Upload File
                </button>
            </div>

            {/* Drop zone */}
            <div className="mb-6 flex items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-card py-12 text-center transition-colors hover:border-primary/40">
                <div>
                    <Upload size={32} className="mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-muted-foreground">Drag & drop EEG or voice files here</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">.csv, .edf, .wav, .mp3 supported</p>
                </div>
            </div>

            <div className="space-y-2">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-14 animate-pulse rounded-lg bg-card" />
                    ))
                ) : (
                    data?.map((file: any) => (
                        <div key={file.id} className="flex items-center justify-between rounded-xl border bg-card px-5 py-3 transition-colors hover:bg-secondary/30">
                            <div className="flex items-center gap-3">
                                <File size={18} className="text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">{file.filename}</p>
                                    <p className="text-xs text-muted-foreground">{file.size} · {file.uploadedAt}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{file.type}</span>
                                <button className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))
                )}
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
