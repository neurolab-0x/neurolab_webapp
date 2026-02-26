import React, { useState } from 'react';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Award, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

const DoctorCertificationsInner = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        // Simulate API call to POST /api/doctors/certifications
        setTimeout(() => {
            setIsUploading(false);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-display text-foreground">Certifications & Credentials</h2>
                <p className="mt-1 text-sm text-muted-foreground">Manage your clinical licenses and board certifications.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Upload Form */}
                <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Upload Credential</h3>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Certification Name</label>
                            <input type="text" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="e.g. Board Certified Neurologist" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Issuing Authority</label>
                            <input type="text" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="e.g. American Board of Psychiatry and Neurology" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Document (PDF, JPG)</label>
                            <div className="mt-1 flex justify-center rounded-lg border border-dashed border-border px-6 py-8">
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
                        >
                            {isUploading ? 'Uploading...' : 'Submit Credential'}
                        </button>
                        {uploadSuccess && (
                            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-500">
                                <CheckCircle2 size={16} /> Credential uploaded successfully.
                            </div>
                        )}
                    </form>
                </div>

                {/* Existing Credentials */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Active Credentials</h3>

                    <div className="flex items-start gap-4 rounded-xl border border-surface-border bg-surface p-4">
                        <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                            <Award size={20} />
                        </div>
                        <div>
                            <h4 className="font-medium text-foreground">Board Certified Neurologist</h4>
                            <p className="text-sm text-muted-foreground">American Board of Psychiatry and Neurology</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <FileText size={14} /> <span>abpn_cert_2023.pdf</span>
                                <span className="ml-auto text-emerald-500">Verified</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-xl border border-surface-border bg-surface p-4">
                        <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                            <Award size={20} />
                        </div>
                        <div>
                            <h4 className="font-medium text-foreground">Medical License</h4>
                            <p className="text-sm text-muted-foreground">State Medical Board</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <FileText size={14} /> <span>med_license_active.pdf</span>
                                <span className="ml-auto text-emerald-500">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function DoctorCertifications() {
    return (
        <PortalErrorBoundary serviceName="Credentialing Service">
            <DoctorCertificationsInner />
        </PortalErrorBoundary>
    );
}
