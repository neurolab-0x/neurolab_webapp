import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Clock, Plus, X } from "lucide-react";
import { format, addDays, isSameDay, isBefore, isAfter } from "date-fns";

interface ScheduledSession {
  id: string;
  date: Date;
  time: string;
  duration: number;
  type: 'eeg' | 'brain-mapping' | 'cognitive-test' | 'therapy-session';
  status: 'scheduled' | 'completed' | 'cancelled';
}

const SessionScheduler = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [selectedType, setSelectedType] = useState<string>("eeg");
  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([
    {
      id: "1",
      date: addDays(new Date(), 1),
      time: "10:00",
      duration: 30,
      type: "eeg",
      status: "scheduled",
    },
    {
      id: "2",
      date: addDays(new Date(), 2),
      time: "14:30",
      duration: 45,
      type: "brain-mapping",
      status: "scheduled",
    },
    {
      id: "3",
      date: addDays(new Date(), 3),
      time: "09:00",
      duration: 60,
      type: "cognitive-test",
      status: "scheduled",
    },
  ]);

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor((i + 18) / 2);
    const minute = (i + 18) % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const isTimeSlotAvailable = (date: Date, time: string) => {
    return !scheduledSessions.some(
      (session) =>
        isSameDay(session.date, date) &&
        session.time === time &&
        session.status !== "cancelled"
    );
  };

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) return;

    const newSession: ScheduledSession = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      time: selectedTime,
      duration: selectedDuration,
      type: selectedType as 'eeg' | 'brain-mapping' | 'cognitive-test' | 'therapy-session',
      status: "scheduled",
    };

    setScheduledSessions([...scheduledSessions, newSession]);
    setSelectedTime("");
  };

  const cancelSession = (id: string) => {
    setScheduledSessions(
      scheduledSessions.map((session) =>
        session.id === id ? { ...session, status: "cancelled" } : session
      )
    );
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "eeg":
        return "bg-blue-500/10 text-blue-500";
      case "brain-mapping":
        return "bg-purple-500/10 text-purple-500";
      case "cognitive-test":
        return "bg-green-500/10 text-green-500";
      case "therapy-session":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Schedule New Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => isBefore(date, new Date())}
                  className="w-full"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4 w-full",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-14 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "h-14 w-14 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center",
                    day_range_end: "day-range-end",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem
                          key={time}
                          value={time}
                          disabled={
                            selectedDate &&
                            !isTimeSlotAvailable(selectedDate, time)
                          }
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Select
                    value={selectedDuration.toString()}
                    onValueChange={(value) => setSelectedDuration(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eeg">EEG Analysis</SelectItem>
                    <SelectItem value="brain-mapping">Brain Mapping</SelectItem>
                    <SelectItem value="cognitive-test">Cognitive Test</SelectItem>
                    <SelectItem value="therapy-session">Therapy Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime}
              >
                <Plus className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {scheduledSessions
                  .filter((session) => session.status !== "cancelled")
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getSessionTypeColor(session.type)}
                          >
                            {session.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(session.date, "MMM d, yyyy")} at {session.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Duration: {session.duration} minutes
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelSession(session.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionScheduler; 