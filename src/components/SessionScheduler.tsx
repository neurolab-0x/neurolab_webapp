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
      // Assuming there's an endpoint to get doctors, otherwise fetch from users with role 'doctor'
      const response = await axios.get('/doctors/profile');
      // If this returns a single doctor, wrap it in an array
      if (response.data && !Array.isArray(response.data)) {
        setDoctors([response.data]);
      } else {
        setDoctors(response.data || []);
      }
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Appointment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Request New Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Doctor</label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.length === 0 ? (
                        <SelectItem value="default" disabled>
                          No doctors available
                        </SelectItem>
                      ) : (
                        doctors.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.user} ({doc.specialization})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <div className="border rounded-md p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Time Slot</label>
                  {slotsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground border border-dashed rounded">
                      {selectedDoctor && selectedDate
                        ? 'No available slots for this date'
                        : 'Select a doctor and date to see available slots'}
                    </div>
                  ) : (
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message (Optional)</label>
                  <Textarea
                    placeholder="Add any notes or reason for appointment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleRequestAppointment}
                  disabled={!selectedDoctor || !selectedDate || !selectedTime || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Request Appointment
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Your Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No appointments yet
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {appointments
                    .sort(
                      (a, b) =>
                        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
                    )
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-start justify-between p-4 rounded-lg border"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(apt.status)}
                            >
                              {apt.status}
                            </Badge>
                            {apt.status === 'ACCEPTED' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(apt.startTime), "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(apt.startTime), "HH:mm")} -{' '}
                            {format(new Date(apt.endTime), "HH:mm")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionScheduler; 