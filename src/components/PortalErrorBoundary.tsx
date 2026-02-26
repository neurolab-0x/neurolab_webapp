import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
    children?: ReactNode;
    serviceName: string;
}

interface State {
    hasError: boolean;
    errorCode: string | null;
}

export class PortalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        errorCode: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Generate a simulated tabular-nums error code based on the error message length 
        // to maintain the "Laboratory/Industrial" aesthetic
        const baseCode = `ERR_SYNC_FAIL_${Math.floor(Math.random() * 900) + 100}`;
        return { hasError: true, errorCode: baseCode };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`[PortalErrorBoundary - ${this.props.serviceName}] Caught an error:`, error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, errorCode: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex w-full flex-col items-center justify-center rounded-2xl border bg-surface p-12 text-center" style={{ minHeight: '300px' }}>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <AlertCircle size={24} strokeWidth={1.5} className="text-muted-foreground" />
                    </div>

                    <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">
                        Module Sync Interrupted
                    </h3>

                    <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                        The <strong className="text-foreground">{this.props.serviceName}</strong> is currently unreachable or undergoing maintenance.
                    </p>

                    <div className="mb-8 flex items-center justify-center gap-2 rounded-md bg-secondary/50 px-3 py-1 text-xs font-medium tabular-nums text-slate-500">
                        {this.state.errorCode}
                    </div>

                    <button
                        onClick={this.handleRetry}
                        className="inline-flex h-9 items-center justify-center rounded-lg border bg-card px-4 text-xs font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Retry Connection
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
