import React, { useState } from 'react';
import useSWR from 'swr';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { apiFetcher } from '../lib/fetcher';
import { Search, Calendar as CalendarIcon, CreditCard, ChevronRight, Stethoscope, Star, CheckCircle2 } from 'lucide-react';

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    availability: string[];
    price: number;
}

const AppointmentBookingInner = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookingStep, setBookingStep] = useState<'search' | 'schedule' | 'payment' | 'confirmed'>('search');

    const { data: serverResponse, isLoading } = useSWR<Doctor[] | { doctors: Doctor[] }>(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments/doctors`,
        apiFetcher
    );

    const doctorsList = Array.isArray(serverResponse)
        ? serverResponse
        : (serverResponse?.doctors || []);

    const doctors = doctorsList.filter(doc =>
        (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.specialty || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBook = () => setBookingStep('payment');
    const handlePay = () => {
        // Simulate POST /api/appointments/payment/{id}
        setTimeout(() => setBookingStep('confirmed'), 1500);
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-display text-foreground">Book Appointment</h2>
                <p className="mt-1 text-sm text-muted-foreground">Find a specialist and schedule a session</p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-2 text-sm font-medium">
                <span className={bookingStep === 'search' ? 'text-foreground' : 'text-muted-foreground'}>1. Select Specialist</span>
                <ChevronRight size={16} className="text-muted-foreground" />
                <span className={bookingStep === 'schedule' ? 'text-foreground' : 'text-muted-foreground'}>2. Date & Time</span>
                <ChevronRight size={16} className="text-muted-foreground" />
                <span className={bookingStep === 'payment' ? 'text-foreground' : 'text-muted-foreground'}>3. Secure Payment</span>
            </div>

            {bookingStep === 'search' && (
                <div className="space-y-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, specialty, or condition..."
                            className="w-full rounded-xl border border-input bg-surface py-3 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-surface" />)
                        ) : (
                            doctors?.map(doc => (
                                <div key={doc.id} className="group relative flex flex-col justify-between rounded-2xl border border-surface-border bg-surface p-6 transition-all hover:border-primary/30 hover:shadow-md">
                                    <div>
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Stethoscope size={24} />
                                        </div>
                                        <h3 className="font-semibold text-foreground">{doc.name}</h3>
                                        <p className="text-sm text-muted-foreground">{doc.specialty}</p>

                                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-amber-500">
                                            <Star size={16} className="fill-current" />
                                            <span>{doc.rating || 0}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-surface-border pt-4">
                                        <span className="text-sm font-medium tabular-nums">{(doc.price || 0).toLocaleString()} RWF</span>
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

            {bookingStep === 'schedule' && selectedDoctor && (
                <div className="max-w-2xl rounded-2xl border border-surface-border bg-surface p-8 shadow-sm">
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-foreground">Schedule with {selectedDoctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedDoctor.specialty} · Consultation fee: {(selectedDoctor.price || 0).toLocaleString()} RWF</p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-foreground">Available Time Slots</label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {(selectedDoctor.availability || []).map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm transition-all ${selectedSlot === slot ? 'border-primary bg-primary/5 text-primary' : 'border-surface-border bg-background hover:border-muted-foreground/30 text-foreground'}`}
                                >
                                    <CalendarIcon size={16} />
                                    {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button onClick={() => setBookingStep('search')} className="rounded-lg border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-secondary text-foreground transition-colors">Back</button>
                        <button
                            onClick={handleBook}
                            disabled={!selectedSlot}
                            className="flex-1 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            Continue to Payment
                        </button>
                    </div>
                </div>
            )}

            {bookingStep === 'payment' && selectedDoctor && (
                <div className="max-w-md rounded-2xl border border-surface-border bg-surface p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Secure Checkout</h3>
                            <p className="text-sm text-muted-foreground">Complete your booking</p>
                        </div>
                    </div>

                    <div className="mb-8 space-y-3 rounded-xl bg-secondary/50 p-4 text-sm text-foreground">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Consultation</span>
                            <span className="font-medium">{selectedDoctor.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date & Time</span>
                            <span className="font-medium">{selectedSlot && new Date(selectedSlot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        <div className="my-2 border-t border-surface-border"></div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{(selectedDoctor.price || 0).toLocaleString()} RWF</span>
                        </div>
                    </div>

                    <p className="mb-6 text-xs text-muted-foreground text-center">
                        You will be redirected to the secure payment gateway (Stripe/MTN MoMo) to complete this transaction.
                    </p>

                    <div className="flex gap-4">
                        <button onClick={() => setBookingStep('schedule')} className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-secondary text-foreground transition-colors">Cancel</button>
                        <button
                            onClick={handlePay}
                            className="flex-1 rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
                        >
                            Pay {(selectedDoctor.price || 0).toLocaleString()} RWF
                        </button>
                    </div>
                </div>
            )}

            {bookingStep === 'confirmed' && (
                <div className="max-w-md rounded-2xl border border-emerald-500/20 bg-surface p-10 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-foreground">Booking Confirmed</h3>
                    <p className="mb-8 text-sm text-muted-foreground">
                        Your appointment has been scheduled successfully. You will receive an email confirmation shortly.
                    </p>
                    <button
                        onClick={() => window.location.href = '/user/appointments'}
                        className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
