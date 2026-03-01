import React, { useState } from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Calendar, CheckCircle, Clock, XCircle, CalendarDays, Settings, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { apiFetcher } from '../lib/fetcher';

import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

const AvailabilityManager = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // State: map of date string (yyyy-MM-dd) to array of time slots
    const [availability, setAvailability] = useState<Record<string, { start: string, end: string }[]>>({
        [format(new Date(), 'yyyy-MM-dd')]: [{ start: '09:00', end: '17:00' }],
    });

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const selectedSlots = availability[selectedDateStr] || [];

    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handlePrevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = monthStart; // For simplicity, not padding with previous month days here, just showing the month
    const endDate = monthEnd;
    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const handleAddSlot = () => {
        setAvailability(prev => ({
            ...prev,
            [selectedDateStr]: [...(prev[selectedDateStr] || []), { start: '09:00', end: '17:00' }]
        }));
        setSaved(false);
    };

    const handleRemoveSlot = (index: number) => {
        setAvailability(prev => {
            const newSlots = [...(prev[selectedDateStr] || [])];
            newSlots.splice(index, 1);
            return { ...prev, [selectedDateStr]: newSlots };
        });
        setSaved(false);
    };

    const handleChangeSlot = (index: number, field: 'start' | 'end', value: string) => {
        setAvailability(prev => {
            const newSlots = [...(prev[selectedDateStr] || [])];
            newSlots[index] = { ...newSlots[index], [field]: value };
            return { ...prev, [selectedDateStr]: newSlots };
        });
        setSaved(false);
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 800);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm flex gap-8"
        >
            {/* Calendar Section */}
            <div className="w-1/2 border-r border-surface-border pr-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Select Dates</h2>
                        <p className="text-sm text-muted-foreground mt-1">Choose specific days to set hours.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrevMonth} className="p-1 rounded bg-surface hover:bg-surface-border text-foreground text-sm font-medium border border-surface-border transition-colors">Prev</button>
                        <span className="text-sm font-semibold text-foreground w-24 text-center">{format(currentMonth, 'MMMM yyyy')}</span>
                        <button onClick={handleNextMonth} className="p-1 rounded bg-surface hover:bg-surface-border text-foreground text-sm font-medium border border-surface-border transition-colors">Next</button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className="text-xs font-semibold text-muted-foreground text-center uppercase">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {/* Padding for first day of month */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-10 w-10" />
                    ))}

                    {days.map(day => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isSelected = isSameDay(day, selectedDate);
                        const hasAvailability = availability[dateStr] && availability[dateStr].length > 0;

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors relative
                                    ${isSelected ? 'bg-[#2E90FA] text-white shadow-md' : 'text-foreground hover:bg-surface-border/50'}
                                    ${isToday(day) && !isSelected ? 'ring-2 ring-[#2E90FA]/30' : ''}
                                `}
                            >
                                {format(day, dateFormat)}
                                {hasAvailability && !isSelected && (
                                    <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots Section */}
            <div className="w-1/2 flex flex-col">
                <div className="mb-6 flex items-center justify-between border-b border-surface-border pb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">{format(selectedDate, 'EEEE, MMMM do')}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">Edit available hours for this date.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-xl bg-[#2E90FA] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#54A5FF] disabled:opacity-50"
                    >
                        {isSaving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> : <Save size={16} />}
                        {saved ? 'Saved!' : 'Save Slots'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                    {selectedSlots.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 rounded-xl border border-dashed border-surface-border bg-background/50 text-muted-foreground">
                            <AlertCircle size={24} className="mb-2 opacity-50" />
                            <p className="text-sm">No availability set for this date.</p>
                        </div>
                    ) : (
                        selectedSlots.map((slot, idx) => (
                            <div key={idx} className="flex items-center justify-between rounded-xl border border-surface-border bg-background p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-muted-foreground" />
                                    <input
                                        type="time"
                                        value={slot.start}
                                        onChange={(e) => handleChangeSlot(idx, 'start', e.target.value)}
                                        className="rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground outline-none focus:border-[#2E90FA] transition-colors tabular-nums"
                                    />
                                    <span className="text-muted-foreground">—</span>
                                    <input
                                        type="time"
                                        value={slot.end}
                                        onChange={(e) => handleChangeSlot(idx, 'end', e.target.value)}
                                        className="rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground outline-none focus:border-[#2E90FA] transition-colors tabular-nums"
                                    />
                                </div>
                                <button
                                    onClick={() => handleRemoveSlot(idx)}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                >
                                    <XCircle size={16} />
                                </button>
                            </div>
                        ))
                    )}

                    <button
                        onClick={handleAddSlot}
                        className="w-full py-3 rounded-xl border border-dashed border-surface-border text-sm font-medium text-[#2E90FA] hover:bg-[#2E90FA]/5 transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        + Add Time Slot
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

function AppointmentsInner() {
    const [activeTab, setActiveTab] = useState<'schedule' | 'availability'>('schedule');

    const { data, mutate } = useSWR(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/doctor/mock_id`, apiFetcher, {
        fallbackData: [
            { id: 'apt_d01', patientName: 'Jean Pierre', date: '2026-02-28', startTime: '10:00', endTime: '11:00', status: 'CONFIRMED', type: 'EEG Review' },
            { id: 'apt_d02', patientName: 'Marie Claire', date: '2026-02-28', startTime: '14:00', endTime: '15:00', status: 'PENDING', type: 'Consultation' },
            { id: 'apt_d03', patientName: 'Ange Teta', date: '2026-03-01', startTime: '09:00', endTime: '10:00', status: 'CONFIRMED', type: 'Follow-up' },
            { id: 'apt_d04', patientName: 'Paul Kagame Jr.', date: '2026-02-25', startTime: '11:00', endTime: '12:00', status: 'COMPLETED', type: 'Neural Assessment' },
        ]
    });

    const handleStatusChange = (id: string, status: string) => {
        if (!data) return;
        const updated = data.map((a: any) => a.id === id ? { ...a, status } : a);
        mutate(updated, false);
    };

    const statusIcon = (s: string) => {
        if (s === 'CONFIRMED') return <CheckCircle size={14} className="text-[#2E90FA]" />;
        if (s === 'PENDING') return <Clock size={14} className="text-amber-500" />;
        if (s === 'COMPLETED') return <CheckCircle size={14} className="text-emerald-500" />;
        return <XCircle size={14} className="text-red-500" />;
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-baseline justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-display text-foreground">Schedule Management</h1>
                    <p className="mt-2 text-muted-foreground">Appointments and availability configuration.</p>
                </div>
            </div>

            <div className="inline-flex rounded-xl bg-surface border border-surface-border p-1 mb-6">
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'schedule'
                        ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <CalendarDays size={16} />
                    Upcoming Appointments
                </button>
                <button
                    onClick={() => setActiveTab('availability')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'availability'
                        ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Settings size={16} />
                    Availability Rules
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'schedule' ? (
                    <motion.div
                        key="schedule"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                    >
                        {data?.map((apt: any) => (
                            <div key={apt.id} className="flex items-center justify-between rounded-xl border border-surface-border bg-surface px-6 py-4 shadow-sm hover:border-[#2E90FA]/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-background border border-surface-border text-center">
                                        <span className="text-xs font-bold tabular-nums text-foreground">{apt.date.split('-')[2]}</span>
                                        <span className="text-[10px] uppercase text-muted-foreground">{new Date(apt.date).toLocaleString('en', { month: 'short' })}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{apt.patientName} <span className="text-muted-foreground mx-1">•</span> {apt.type}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{apt.startTime} – {apt.endTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {statusIcon(apt.status)}
                                    <span className="text-xs font-medium text-muted-foreground">{apt.status}</span>
                                    {apt.status === 'PENDING' && (
                                        <div className="ml-4 flex gap-2">
                                            <button onClick={() => handleStatusChange(apt.id, 'CONFIRMED')} className="rounded-lg bg-[#2E90FA] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#54A5FF]">Accept</button>
                                            <button onClick={() => handleStatusChange(apt.id, 'CANCELLED')} className="rounded-lg border border-surface-border bg-background px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground hover:bg-surface-border/50">Decline</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <AvailabilityManager key="availability" />
                )}
            </AnimatePresence>
        </div>
    );
}

export default function DoctorAppointments() {
    return <PortalErrorBoundary serviceName="Schedule Service"><AppointmentsInner /></PortalErrorBoundary>;
}
