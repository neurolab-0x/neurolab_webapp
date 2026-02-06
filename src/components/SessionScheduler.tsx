import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Plus, X, Loader2, Clock, CheckCircle } from "lucide-react";
import { format, addDays, setHours, setMinutes } from "date-fns";
import { toast } from "sonner";
import axios from "@/lib/axios/config";
import { Calendar } from "@/components/ui/calendar";
import { requestAppointment, getAvailableSlots } from "@/api/appointments";

interface Doctor {
  id: string;
  user: string;
  specialization: string;
  availability: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
}

interface Appointment {
  id: string;
  user: string;
  doctor: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';
}

const SessionScheduler = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Fetch doctors and appointments on mount
  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlotsForDate();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      // Try several possible endpoints for doctors list
      const candidates = ['/doctors', '/doctors/profile', '/users?role=doctor', '/admin/users?role=doctor', '/users'];
      let found: any[] = [];
      for (const path of candidates) {
        try {
          const resp = await axios.get(path);
          const d = resp?.data;
          if (!d) continue;
          if (Array.isArray(d)) {
            found = d;
            break;
          }
          if (Array.isArray(d?.doctors)) { found = d.doctors; break; }
          if (Array.isArray(d?.users)) { found = d.users.filter((u: any) => (u.role || '').toLowerCase() === 'doctor'); break; }
          if (Array.isArray(d?.data)) { found = d.data; break; }
          // single object
          if (d && typeof d === 'object') { found = [d]; break; }
        } catch (e: any) {
          const status = e?.response?.status;
          if (status === 401 || status === 403) throw e;
          continue;
        }
      }
      // Normalize doctor shape
      const normalized = (found || []).map((doc: any) => ({
        id: doc.id || doc._id || doc.user || doc.username || String(doc.email || doc.user || Math.random()),
        user: doc.fullName || doc.name || doc.user || doc.username || doc.email || 'Unknown',
        specialization: doc.specialization || doc.speciality || 'General',
        availability: doc.availability || []
      }));
      setDoctors(normalized);
    } catch (error: any) {
      // Fallback: Try to get a list of users or use a default
      console.warn('Could not fetch doctors list:', error);
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      // Fetch user's appointments - this endpoint might vary
      // For now, we'll just initialize an empty array
      setAppointments([]);
    } catch (error: any) {
      console.warn('Could not fetch appointments:', error);
    }
  };

  const fetchAvailableSlotsForDate = async () => {
    if (!selectedDoctor) return;

    setSlotsLoading(true);
    try {
      const slots = await getAvailableSlots(selectedDoctor);
      // Filter slots for selected date and format them
      const formattedSlots = slots
        .filter((slot) => slot.date === format(selectedDate!, 'yyyy-MM-dd'))
        .map((slot) => slot.time)
        .sort();
      setAvailableSlots(formattedSlots);
    } catch (error: any) {
      toast.error('Failed to fetch available slots');
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleRequestAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please select a doctor, date, and time');
      return;
    }

    setIsSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, minutes, 0);

      // Assuming 30 minute appointment
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);

      const payload = {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        message: message || undefined,
      };

      const result = await requestAppointment(selectedDoctor, payload);

      setAppointments([...appointments, result]);
      toast.success('Appointment requested successfully');

      // Reset form
      setSelectedTime('');
      setMessage('');
      setSelectedDate(new Date());
      setSelectedDoctor('');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to request appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'ACCEPTED':
        return 'bg-green-500/10 text-green-500';
      case 'DECLINED':
        return 'bg-red-500/10 text-red-500';
      case 'COMPLETED':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-8 p-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Request Appointment Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-white/5 shadow-premium overflow-hidden bg-card/30">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tighter">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                Request New Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Loading experts...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Select Specialist</label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50 focus:ring-primary/20">
                        <SelectValue placeholder="Choose a specialist" />
                      </SelectTrigger>
                      <SelectContent className="glass-platter">
                        {doctors.length === 0 ? (
                          <SelectItem value="default" disabled>
                            No specialists available
                          </SelectItem>
                        ) : (
                          doctors.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id} className="font-medium">
                              {doc.user} — <span className="opacity-60">{doc.specialization}</span>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Select Date</label>
                      <div className="border border-border/50 rounded-2xl p-4 bg-muted/10 shadow-inner">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-6 flex flex-col justify-start">
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Available Slots</label>
                        {slotsLoading ? (
                          <div className="flex items-center justify-center p-8 bg-muted/10 rounded-2xl border border-dashed border-border/50">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/10 rounded-2xl border border-dashed border-border/50 space-y-2">
                            <Clock className="h-6 w-6 text-muted-foreground opacity-30" />
                            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                              {selectedDoctor && selectedDate
                                ? 'No slots available'
                                : 'Select doctor & date'}
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto scrollbar-none pr-1">
                            {availableSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => setSelectedTime(slot)}
                                className={cn(
                                  "py-3 rounded-xl text-sm font-bold transition-all duration-200 press-effect border",
                                  selectedTime === slot
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                                    : "bg-muted/20 text-foreground border-border/40 hover:bg-primary/5 hover:border-primary/30"
                                )}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Session Notes (Optional)</label>
                    <Textarea
                      placeholder="Add any specific details about your neural session request..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="rounded-2xl bg-muted/20 border-border/50 focus:ring-primary/20 resize-none p-4"
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-14 rounded-2xl font-bold text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                    onClick={handleRequestAppointment}
                    disabled={!selectedDoctor || !selectedDate || !selectedTime || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-3 h-5 w-5" />
                        Confirm Session
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Appointment History */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-white/5 shadow-premium overflow-hidden bg-card/30 flex flex-col h-full max-h-[800px]">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tighter">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                  <div className="p-4 bg-muted/50 rounded-full">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground opacity-20" />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground/50 uppercase tracking-widest">
                    No scheduled sessions
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-full px-6 py-8">
                  <div className="space-y-4">
                    {appointments
                      .sort(
                        (a, b) =>
                          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
                      )
                      .map((apt) => (
                        <motion.div
                          key={apt.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border/40 hover:bg-muted/20 hover:border-border/60 transition-all group"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <Badge
                                className={cn(
                                  "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter border-none",
                                  getStatusColor(apt.status)
                                )}
                              >
                                {apt.status}
                              </Badge>
                              {apt.status === 'ACCEPTED' && (
                                <CheckCircle className="h-4 w-4 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                              )}
                            </div>
                            <div>
                              <p className="text-lg font-bold tracking-tight">
                                {format(new Date(apt.startTime), "EEEE, MMM d")}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs font-bold text-muted-foreground tracking-wide">
                                  {format(new Date(apt.startTime), "HH:mm")} —{' '}
                                  {format(new Date(apt.endTime), "HH:mm")}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionScheduler;
