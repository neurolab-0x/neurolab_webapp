import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { apiFetcher } from '../lib/fetcher';
import { Search, Calendar as CalendarIcon, CreditCard, ChevronRight, Stethoscope, Star, CheckCircle2, Loader2, X, ChevronLeft } from 'lucide-react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isBefore, startOfDay, isSameDay } from 'date-fns';

const BASE = import.meta.env.VITE_API_BASE_URL;

interface Doctor {
    id?: string;
    _id?: string;
    user?: { fullName?: string; name?: string; _id?: string };
    fullName?: string;
    name?: string;
    specialization?: string;
    specialty?: string;
    rating?: number;
    consultationFee?: number;
    price?: number;
    availability?: Array<{ day: string; startTime: string; endTime: string } | string>;
}

interface Slot {
    startTime: string;
    endTime: string;
    date?: string;
}

function getDoctorId(doc: Doctor): string {
    return doc.id || doc._id || doc.user?._id || '';
}

function getDoctorName(doc: Doctor): string {
    return doc.fullName || doc.name || doc.user?.fullName || doc.user?.name || 'Unknown Doctor';
}

function getDoctorSpecialty(doc: Doctor): string {
    return doc.specialization || doc.specialty || 'Specialist';
}

function getDoctorFee(doc: Doctor): number {
    return doc.consultationFee ?? doc.price ?? 0;
}

function normalizeDoctors(raw: unknown): Doctor[] {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') {
        const obj = raw as Record<string, unknown>;
        for (const key of ['doctors', 'results', 'data', 'users']) {
            if (Array.isArray(obj[key])) return obj[key] as Doctor[];
        }
    }
    return [];
}

/** Simple debounce hook */
function useDebounce(value: string, delay: number) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

const AppointmentBookingInner = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(() => format(new Date(), 'yyyy-MM-dd'));
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookingStep, setBookingStep] = useState<'search' | 'schedule' | 'payment' | 'confirmed'>('search');
    const [bookingState, setBookingState] = useState<'idle' | 'loading' | 'done'>('idle');

    const debouncedQuery = useDebounce(searchQuery, 400);

    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handlePrevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const today = startOfDay(new Date());

    // Scroll container ref for dates
    const dateScrollRef = React.useRef<HTMLDivElement>(null);

    // Effect to scroll to the selected date or today
    useEffect(() => {
        if (bookingStep === 'schedule' && dateScrollRef.current) {
            const container = dateScrollRef.current;
            const selectedButton = container.querySelector('[data-selected="true"]');
            if (selectedButton) {
                // simple center scroll
                const containerWidth = container.clientWidth;
                const buttonElement = selectedButton as HTMLElement;
                const scrollPos = buttonElement.offsetLeft - containerWidth / 2 + buttonElement.clientWidth / 2;
                container.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        }
    }, [bookingStep, currentMonth, selectedDate]);

    // Primary: load all doctors from GET /api/appointments ("Get all doctors" per API spec)
    const { data: allDoctorsRaw, isPending: listLoading } = useQuery({
        queryKey: ['appointment-doctors'],
        queryFn: () => apiFetcher(`${BASE}/api/appointments`),
        refetchOnWindowFocus: false,
    });
    const allDoctors = useMemo(() => normalizeDoctors(allDoctorsRaw), [allDoctorsRaw]);

    // Secondary: attempt the search endpoint when the user has typed 2+ chars
    const searchUrl = debouncedQuery.trim().length >= 2
        ? `${BASE}/api/appointments/doctors/search?query=${encodeURIComponent(debouncedQuery.trim())}`
        : null;

    const { data: searchRaw, isPending: searchLoading, error: searchError } = useQuery({
        queryKey: ['appointment-doctor-search', debouncedQuery],
        queryFn: () => apiFetcher(`${BASE}/api/appointments/doctors/search?query=${encodeURIComponent(debouncedQuery.trim())}`),
        enabled: debouncedQuery.trim().length >= 2,
        refetchOnWindowFocus: false,
        retry: false,
    });
    const serverSearchResults = useMemo(() => normalizeDoctors(searchRaw), [searchRaw]);

    // Client-side filter as fallback when search endpoint fails or returns nothing
    const clientFiltered = useMemo(() => {
        if (debouncedQuery.trim().length < 2) return allDoctors;
        const q = debouncedQuery.toLowerCase();
        return allDoctors.filter(d =>
            getDoctorName(d).toLowerCase().includes(q) ||
            getDoctorSpecialty(d).toLowerCase().includes(q)
        );
    }, [allDoctors, debouncedQuery]);

    // Use server results when available and not errored; otherwise fall back to client filter
    const doctors: Doctor[] = (searchUrl && !searchError && serverSearchResults.length > 0)
        ? serverSearchResults
        : clientFiltered;

    const isLoading = listLoading || (!!searchUrl && searchLoading && !searchError);

    // Fetch available slots when a doctor and date are selected
    const { data: slotsRaw, isPending: slotsLoading } = useQuery({
        queryKey: ['appointment-slots', selectedDoctor ? getDoctorId(selectedDoctor) : null, selectedDate],
        queryFn: () => apiFetcher(`${BASE}/api/appointments/available-slots/${getDoctorId(selectedDoctor!)}?date=${selectedDate}`),
        enabled: !!selectedDoctor && !!selectedDate,
        refetchOnWindowFocus: false,
        retry: false,
    });
    const slots: Slot[] = useMemo(() => {
        if (!slotsRaw) return [];
        if (Array.isArray(slotsRaw)) return slotsRaw;
        const obj = slotsRaw as Record<string, unknown>;
        for (const key of ['slots', 'data', 'results']) {
            if (Array.isArray(obj[key])) return obj[key] as Slot[];
        }
        return [];
    }, [slotsRaw]);

    const handlePay = () => {
        setBookingState('loading');
        setTimeout(() => {
            setBookingState('done');
            setBookingStep('confirmed');
        }, 1200);
    };

    const resetFlow = () => {
        setSelectedDoctor(null);
        setSelectedSlot(null);
        setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
        setCurrentMonth(new Date());
        setBookingStep('search');
        setBookingState('idle');
    };

    const formatSlot = (slot: Slot | string, i: number): string => {
        if (typeof slot === 'string') {
            try { return new Date(slot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); }
            catch { return slot; }
        }
        const day = slot.date ? `${new Date(slot.date).toLocaleDateString([], { dateStyle: 'short' })} ` : '';
        return `${day}${slot.startTime} – ${slot.endTime}`;
    };

    const slotKey = (slot: Slot | string, i: number) =>
        typeof slot === 'string' ? slot : `${slot.startTime}-${slot.endTime}-${i}`;

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-display text-foreground">Book Appointment</h2>
                <p className="mt-1 text-sm text-muted-foreground">Find a specialist and schedule a session</p>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-2 text-sm font-medium overflow-x-auto scrollbar-hide whitespace-nowrap pb-1">
                {(['search', 'schedule', 'payment', 'confirmed'] as const).map((step, i) => {
                    const labels = ['1. Select Specialist', '2. Date & Time', '3. Confirm Request', '✓ Done'];
                    const active = bookingStep === step;
                    return (
                        <React.Fragment key={step}>
                            {i > 0 && <ChevronRight size={16} className="text-muted-foreground shrink-0" />}
                            <span className={`shrink-0 ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{labels[i]}</span>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* ── Step 1: Search ── */}
            {bookingStep === 'search' && (
                <div className="space-y-6">
                    {/* Search bar */}
                    <div className="relative max-w-md">
                        {isLoading
                            ? <Loader2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />
                            : <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        }
                        <input
                            id="doctor-search"
                            type="text"
                            placeholder="Search by name or specialty…"
                            className="w-full rounded-xl border border-input bg-surface py-3 pl-10 pr-10 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Results count */}
                    {!isLoading && debouncedQuery.trim().length >= 2 && (
                        <p className="text-xs text-muted-foreground -mt-2">
                            {doctors.length > 0
                                ? `${doctors.length} doctor${doctors.length !== 1 ? 's' : ''} found`
                                : `No doctors found for "${debouncedQuery}"`}
                        </p>
                    )}

                    {/* Doctor cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-48 animate-pulse rounded-2xl bg-surface" />
                            ))
                        ) : doctors.length === 0 ? (
                            <div className="col-span-3 rounded-2xl border border-dashed border-surface-border bg-surface p-12 text-center">
                                <Stethoscope size={32} className="mx-auto mb-3 text-muted-foreground/40" />
                                <p className="text-sm font-medium text-foreground">No doctors available</p>
                                <p className="mt-1 text-xs text-muted-foreground">Try a different name or specialty</p>
                            </div>
                        ) : (
                            doctors.map(doc => (
                                <div
                                    key={getDoctorId(doc) || getDoctorName(doc)}
                                    className="group flex flex-col justify-between rounded-2xl border border-surface-border bg-surface p-6 transition-all hover:border-primary/30 hover:shadow-md"
                                >
                                    <div>
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Stethoscope size={24} />
                                        </div>
                                        <h3 className="font-semibold text-foreground">{getDoctorName(doc)}</h3>
                                        <p className="text-sm text-muted-foreground">{getDoctorSpecialty(doc)}</p>
                                        {doc.rating != null && (
                                            <div className="mt-3 flex items-center gap-1 text-sm font-medium text-amber-500">
                                                <Star size={14} className="fill-current" />
                                                <span>{doc.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 flex items-center justify-between border-t border-surface-border pt-4">
                                        <span className="text-sm font-medium tabular-nums">
                                            {getDoctorFee(doc) > 0
                                                ? `${getDoctorFee(doc).toLocaleString()} RWF`
                                                : 'Free consultation'}
                                        </span>
                                        <button
                                            onClick={() => { setSelectedDoctor(doc); setBookingStep('schedule'); }}
                                            className="rounded-lg bg-secondary px-4 py-2 text-xs font-semibold hover:bg-secondary/80 text-foreground transition-colors"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* ── Step 2: Schedule ── */}
            {bookingStep === 'schedule' && selectedDoctor && (
                <div className="max-w-2xl rounded-2xl border border-surface-border bg-surface p-4 sm:p-8 shadow-sm">
                    <div className="mb-8 border-b border-surface-border pb-6">
                        <h3 className="text-xl font-bold text-foreground">Schedule with {getDoctorName(selectedDoctor)}</h3>
                        <p className="text-sm text-muted-foreground">
                            {getDoctorSpecialty(selectedDoctor)}
                            {getDoctorFee(selectedDoctor) > 0 && ` · ${getDoctorFee(selectedDoctor).toLocaleString()} RWF`}
                        </p>
                    </div>

                    <div className="mb-8 p-4 sm:p-6 rounded-2xl border border-surface-border bg-background shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-foreground">Select Date</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Choose a day for your appointment.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handlePrevMonth} className="p-1.5 rounded-lg bg-surface hover:bg-surface-border text-foreground text-xs font-medium border border-surface-border transition-colors"><ChevronLeft size={16} /></button>
                                <span className="text-sm font-semibold text-foreground w-24 sm:w-32 text-center">{format(currentMonth, 'MMMM yyyy')}</span>
                                <button onClick={handleNextMonth} className="p-1.5 rounded-lg bg-surface hover:bg-surface-border text-foreground text-xs font-medium border border-surface-border transition-colors"><ChevronRight size={16} /></button>
                            </div>
                        </div>

                        {/* Horizontal Date Scroller */}
                        <div
                            ref={dateScrollRef}
                            className="flex overflow-x-auto gap-3 pb-2 snap-x scrollbar-hide"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {days.map(day => {
                                const dateStr = format(day, 'yyyy-MM-dd');
                                const isSelected = selectedDate === dateStr;
                                const isPast = isBefore(day, today);

                                return (
                                    <button
                                        key={day.toString()}
                                        data-selected={isSelected}
                                        onClick={() => {
                                            if (isPast) return;
                                            setSelectedDate(dateStr);
                                            setSelectedSlot(null);
                                        }}
                                        disabled={isPast}
                                        className={`flex-shrink-0 flex flex-col items-center justify-center w-[60px] h-[72px] rounded-2xl border transition-all snap-center relative
                                            ${isSelected
                                                ? 'bg-primary border-primary text-primary-foreground shadow-md'
                                                : isPast
                                                    ? 'bg-surface border-transparent text-muted-foreground/30 cursor-not-allowed'
                                                    : 'bg-surface border-surface-border text-foreground hover:border-primary/50'
                                            }
                                        `}
                                    >
                                        <span className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                            {format(day, 'EEE')}
                                        </span>
                                        <span className={`text-lg font-bold ${isToday(day) && !isSelected ? 'text-primary' : ''}`}>
                                            {format(day, 'd')}
                                        </span>
                                        {isToday(day) && !isSelected && (
                                            <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full mt-1" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Available Time Slots</label>
                        {slotsLoading ? (
                            <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                                <Loader2 size={16} className="animate-spin" /> Loading slots…
                            </div>
                        ) : slots.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-surface-border p-4 text-sm text-muted-foreground">
                                No slots listed. You can still submit a request and the doctor will confirm timing.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {slots.map((slot, i) => {
                                    const key = slotKey(slot, i);
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedSlot(key)}
                                            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs transition-all ${selectedSlot === key ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-surface-border bg-background hover:border-muted-foreground/30 text-foreground'}`}
                                        >
                                            <CalendarIcon size={14} />
                                            {formatSlot(slot, i)}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button onClick={resetFlow} className="rounded-lg border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-secondary text-foreground transition-colors">
                            Back
                        </button>
                        <button
                            onClick={() => setBookingStep('payment')}
                            className="flex-1 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Continue to Confirm
                        </button>
                    </div>
                </div>
            )}

            {/* ── Step 3: Confirm / Payment ── */}
            {bookingStep === 'payment' && selectedDoctor && (
                <div className="max-w-md rounded-2xl border border-surface-border bg-surface p-4 sm:p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Confirm Appointment</h3>
                            <p className="text-sm text-muted-foreground">Review and send request</p>
                        </div>
                    </div>

                    <div className="mb-8 space-y-3 rounded-xl bg-secondary/50 p-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Doctor</span>
                            <span className="font-medium text-foreground">{getDoctorName(selectedDoctor)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Specialty</span>
                            <span className="font-medium text-foreground">{getDoctorSpecialty(selectedDoctor)}</span>
                        </div>
                        {selectedSlot && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Requested slot</span>
                                <span className="font-medium text-foreground text-xs text-right">
                                    {new Date(selectedDate).toLocaleDateString([], { dateStyle: 'medium' })}<br />
                                    {selectedSlot}
                                </span>
                            </div>
                        )}
                        {getDoctorFee(selectedDoctor) > 0 && (
                            <>
                                <div className="border-t border-surface-border" />
                                <div className="flex justify-between font-bold text-base text-foreground">
                                    <span>Consultation fee</span>
                                    <span>{getDoctorFee(selectedDoctor).toLocaleString()} RWF</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setBookingStep('schedule')} className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-secondary text-foreground transition-colors">
                            Back
                        </button>
                        <button
                            onClick={handlePay}
                            disabled={bookingState === 'loading'}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
                        >
                            {bookingState === 'loading'
                                ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                                : 'Send Appointment Request'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Confirmed ── */}
            {bookingStep === 'confirmed' && (
                <div className="max-w-md rounded-2xl border border-emerald-500/20 bg-surface p-10 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-foreground">Request Sent!</h3>
                    <p className="mb-8 text-sm text-muted-foreground">
                        Your appointment request has been sent to <strong>{selectedDoctor ? getDoctorName(selectedDoctor) : 'the doctor'}</strong>.
                        You will be notified once it's confirmed.
                    </p>
                    <button
                        onClick={() => window.location.href = '/user/appointments'}
                        className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        View My Appointments
                    </button>
                </div>
            )}
        </div>
    );
};

export default function AppointmentBooking() {
    return (
        <PortalErrorBoundary serviceName="Scheduling Engine">
            <AppointmentBookingInner />
        </PortalErrorBoundary>
    );
}
