import { addMinutes, format } from 'date-fns';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  attendees?: string[];
}

class CalendarService {
  private storageKey = 'neurolab_calendar_events';

  constructor() {
    // Initialize storage if empty
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  private async getStoredEvents(): Promise<CalendarEvent[]> {
    const events = localStorage.getItem(this.storageKey);
    return events ? JSON.parse(events).map((e: any) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end)
    })) : [];
  }

  private async saveEvents(events: CalendarEvent[]): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }

  async addEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const events = await this.getStoredEvents();
    const newEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    events.push(newEvent);
    await this.saveEvents(events);
    
    // Mock API response delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return newEvent;
  }

  async getEvents(): Promise<CalendarEvent[]> {
    // Mock API response delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.getStoredEvents();
  }

  async suggestAvailableSlots(date: Date, duration: number = 30): Promise<Date[]> {
    const events = await this.getStoredEvents();
    // Mock logic to find available time slots
    const workingHourStart = 9; // 9 AM
    const workingHourEnd = 17; // 5 PM
    const slots: Date[] = [];
    
    const startDate = new Date(date);
    startDate.setHours(workingHourStart, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(workingHourEnd, 0, 0, 0);

    // Generate slots every 30 minutes
    let currentSlot = startDate;
    while (currentSlot < endDate) {
      // Check if slot is available (not conflicting with existing events)
      const slotEnd = addMinutes(currentSlot, duration);
      const isAvailable = !events.some(event => 
        (currentSlot >= event.start && currentSlot < event.end) ||
        (slotEnd > event.start && slotEnd <= event.end) ||
        (currentSlot <= event.start && slotEnd >= event.end)
      );

      if (isAvailable) {
        slots.push(new Date(currentSlot));
      }
      
      currentSlot = addMinutes(currentSlot, 30);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    return slots;
  }

  async updateEventStatus(eventId: string, status: 'accepted' | 'declined'): Promise<void> {
    // Mock updating event status in Google Calendar
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const calendarService = new CalendarService();