import React from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function AppointmentsInner() {
    const navigate = useNavigate();
    const { data, isLoading } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/`, apiFetcher);

    const statusStyle = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-primary/10 text-primary';
            case 'PENDING': return 'bg-amber-500/10 text-amber-500';
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500';
            case 'CANCELLED': return 'bg-destructive/10 text-destructive';
            default: return 'bg-secondary text-muted-foreground';
        }
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">My Appointments</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Scheduled consultations and neural reviews</p>
                </div>
                <button
                    onClick={() => navigate('/user/booking')}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    Book Appointment
                </button>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-xl bg-card" />
                    ))
                ) : (
                    data?.map((apt: any) => (
                        <div key={apt.id} className="flex items-center justify-between rounded-xl border bg-card px-6 py-4 transition-colors hover:bg-secondary/30">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-secondary text-center">
                                    <span className="text-xs font-bold tabular-nums text-foreground">{apt.date.split('-')[2]}</span>
                                    <span className="text-[10px] uppercase text-muted-foreground">
                                        {new Date(apt.date).toLocaleString('en', { month: 'short' })}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{apt.type}</p>
                                    <p className="text-xs text-muted-foreground">{apt.doctorName} · {apt.startTime}–{apt.endTime}</p>
                                </div>
                            </div>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle(apt.status)}`}>{apt.status}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default function UserAppointments() {
    return (
        <PortalErrorBoundary serviceName="Appointment Service">
            <AppointmentsInner />
        </PortalErrorBoundary>
    );
}
