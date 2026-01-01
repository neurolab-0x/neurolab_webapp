import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, addMinutes } from "date-fns";
import { X, Check, Calendar as CalendarIcon, Loader2, Clock, Mail, Phone } from "lucide-react";
import { calendarService } from "@/services/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { useAppointmentStore, type AppointmentRequest } from "@/stores/appointmentStore";
import { useI18n } from '@/lib/i18n';

export default function Appointments() {
  const { t } = useI18n();
  const { requests, updateRequest } = useAppointmentStore();
  const [activeSuggestId, setActiveSuggestId] = useState<string | null>(null);
  const [suggestedDate, setSuggestedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Add some sample data if the store is empty (only for development)
  useEffect(() => {
    if (requests.length === 0) {
      useAppointmentStore.getState().addRequest({
        requester: "John Doe",
        requestedDate: addDays(new Date(), 2),
        requestedTime: "10:00",
        reason: "Follow-up on EEG results",
        status: "pending",
        duration: 30,
        email: "john.doe@example.com",
        phone: "+1234567890"
      });
      useAppointmentStore.getState().addRequest({
        requester: "Jane Smith",
        requestedDate: addDays(new Date(), 4),
        requestedTime: "14:30",
        reason: "Initial consultation",
        status: "pending",
        duration: 45,
        email: "jane.smith@example.com",
        phone: "+1987654321"
      });
    }
  }, [requests.length]);

  const fetchAvailableSlots = async (date: Date) => {
    setIsLoading(true);
    try {
      const activeRequest = requests.find(r => r.id === activeSuggestId);
      const slots = await calendarService.suggestAvailableSlots(date, activeRequest?.duration || 30);
      setAvailableSlots(slots);
    } catch (error) {
      toast.error("Failed to fetch available slots");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (suggestedDate && activeSuggestId) {
      fetchAvailableSlots(suggestedDate);
    }
  }, [suggestedDate, activeSuggestId]);

  const accept = async (id: string) => {
    setIsLoading(true);
    const request = requests.find(r => r.id === id);
    if (!request) return;

    try {
      const startDate = new Date(request.requestedDate);
      const [hours, minutes] = request.requestedTime.split(":").map(Number);
      startDate.setHours(hours, minutes);

      const event = await calendarService.addEvent({
        summary: `Neurolab Session with ${request.requester}`,
        description: request.reason,
        start: startDate,
        end: addMinutes(startDate, request.duration),
        attendees: [request.requester],
      });

      updateRequest(id, { status: "accepted", calendarEventId: event.id });
      toast.success("Appointment accepted and added to calendar");
    } catch (error) {
      toast.error("Failed to accept appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const reject = async (id: string) => {
    setIsLoading(true);
    try {
      const request = requests.find(r => r.id === id);
      if (request?.calendarEventId) {
        await calendarService.updateEventStatus(request.calendarEventId, "declined");
      }
      updateRequest(id, { status: "rejected" });
      toast.success("Appointment rejected");
    } catch (error) {
      toast.error("Failed to reject appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const openSuggest = (id: string) => {
    setActiveSuggestId(id);
    setSuggestedDate(new Date());
    setSelectedSlot("");
    setAvailableSlots([]);
  };

  const submitSuggestion = async () => {
    if (!activeSuggestId || !suggestedDate || !selectedSlot) return;
    
    setIsLoading(true);
    const request = requests.find(r => r.id === activeSuggestId);
    if (!request) return;

    try {
      const [hours, minutes] = selectedSlot.split(":").map(Number);
      const startDate = new Date(suggestedDate);
      startDate.setHours(hours, minutes);

      const event = await calendarService.addEvent({
        summary: `Suggested: Neurolab Session with ${request.requester}`,
        description: request.reason,
        start: startDate,
        end: addMinutes(startDate, request.duration),
        attendees: [request.requester],
      });

      updateRequest(activeSuggestId, {
        status: "suggested",
        suggestedDate: startDate,
        suggestedTime: selectedSlot,
        calendarEventId: event.id,
      });
      
      setActiveSuggestId(null);
      toast.success("Alternative date suggested");
    } catch (error) {
      toast.error("Failed to suggest alternative date");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('appointments.title')}</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-3 p-4 rounded-lg border hover:border-primary/50 transition-all"
              >
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-lg">{r.requester}</div>
                      <Badge
                        variant={
                          r.status === "accepted" ? "success" :
                          r.status === "rejected" ? "destructive" :
                          r.status === "suggested" ? "warning" : "secondary"
                        }
                        className="capitalize"
                      >
                        {r.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {format(r.requestedDate, "PPP")} at {r.requestedTime}
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    {r.reason && (
                      <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                        {r.reason}
                      </div>
                    )}
                    {r.email && (
                      <div className="text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                          {r.email}
                        </a>
                      </div>
                    )}
                    {r.phone && (
                      <div className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${r.phone}`} className="text-primary hover:underline">
                          {r.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {r.status === "suggested" && r.suggestedDate && (
                    <div className="mt-3 p-2 border border-warning/30 bg-warning/10 rounded-md">
                      <div className="text-sm font-medium mb-1">Suggested Alternative</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {format(r.suggestedDate, "PPP")} {r.suggestedTime && `at ${r.suggestedTime}`}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => accept(r.id)} disabled={r.status !== "pending"}>
                    <Check className="mr-2 h-4 w-4" />Accept
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => reject(r.id)} disabled={r.status !== "pending"}>
                    <X className="mr-2 h-4 w-4" />Reject
                  </Button>

                  <Dialog open={activeSuggestId === r.id} onOpenChange={(open) => !open && setActiveSuggestId(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openSuggest(r.id)}>
                        <CalendarIcon className="mr-2 h-4 w-4" />Suggest Date
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Suggest a new date for {r.requester}</DialogTitle>
                      </DialogHeader>

                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium">Pick a date</label>
                    <div className="border rounded-md p-2 mt-2">
                      <Calendar
                        mode="single"
                        selected={suggestedDate}
                        onSelect={(date) => {
                          setSuggestedDate(date);
                          setSelectedSlot("");
                        }}
                        disabled={(date) => date < new Date()}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Available Time Slots</label>
                    <div className="mt-2">
                      {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <ScrollArea className="h-[120px] border rounded-md p-2">
                          <div className="grid grid-cols-3 gap-2">
                            {availableSlots.map((slot) => (
                              <Button
                                key={slot.toISOString()}
                                variant={selectedSlot === format(slot, "HH:mm") ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedSlot(format(slot, "HH:mm"))}
                              >
                                {format(slot, "HH:mm")}
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-sm text-muted-foreground p-2 border rounded-md">
                          {suggestedDate ? "No available slots for this date" : "Select a date to see available slots"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>                      <DialogFooter className="mt-4">
                        <Button onClick={submitSuggestion}>Send Suggestion</Button>
                        <Button variant="ghost" onClick={() => setActiveSuggestId(null)}>
                          Cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}
