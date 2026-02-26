import React from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

import { apiFetcher } from '../lib/fetcher';

function AppointmentsInner() {
    const { data } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/doctor/mock_id`, apiFetcher, {
        fallbackData: [
            { id: 'apt_d01', patientName: 'Jean Pierre', date: '2026-02-28', startTime: '10:00', endTime: '11:00', status: 'CONFIRMED', type: 'EEG Review' },
            { id: 'apt_d02', patientName: 'Marie Claire', date: '2026-02-28', startTime: '14:00', endTime: '15:00', status: 'PENDING', type: 'Consultation' },
            { id: 'apt_d03', patientName: 'Ange Teta', date: '2026-03-01', startTime: '09:00', endTime: '10:00', status: 'CONFIRMED', type: 'Follow-up' },
            { id: 'apt_d04', patientName: 'Paul Kagame Jr.', date: '2026-02-25', startTime: '11:00', endTime: '12:00', status: 'COMPLETED', type: 'Neural Assessment' },
        ]
    });

    const statusIcon = (s: string) => {
        if (s === 'CONFIRMED') return <CheckCircle size={14} className="text-primary" />;
        if (s === 'PENDING') return <Clock size={14} className="text-amber-500" />;
        if (s === 'COMPLETED') return <CheckCircle size={14} className="text-emerald-500" />;
        return <XCircle size={14} className="text-destructive" />;
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8"><h1 className="text-2xl font-bold tracking-tight text-foreground">My Schedule</h1><p className="mt-1 text-sm text-muted-foreground">Appointments and patient consultations</p></div>
            <div className="space-y-3">
                {data?.map((apt: any) => (
                    <div key={apt.id} className="flex items-center justify-between rounded-xl border bg-card px-6 py-4 hover:bg-secondary/30">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-secondary text-center">
                                <span className="text-xs font-bold tabular-nums text-foreground">{apt.date.split('-')[2]}</span>
                                <span className="text-[10px] uppercase text-muted-foreground">{new Date(apt.date).toLocaleString('en', { month: 'short' })}</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{apt.patientName} — {apt.type}</p>
                                <p className="text-xs text-muted-foreground">{apt.startTime}–{apt.endTime}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {statusIcon(apt.status)}
                            <span className="text-xs font-medium text-muted-foreground">{apt.status}</span>
                            {apt.status === 'PENDING' && (
                                <div className="ml-3 flex gap-1">
                                    <button className="rounded-md bg-primary px-2.5 py-1 text-[10px] font-medium text-primary-foreground hover:bg-primary/90">Accept</button>
                                    <button className="rounded-md border px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:bg-secondary">Decline</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function DoctorAppointments() {
    return <PortalErrorBoundary serviceName="Schedule Service"><AppointmentsInner /></PortalErrorBoundary>;
}
