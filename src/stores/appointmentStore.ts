import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppointmentRequest {
  id: string;
  requester: string;
  requestedDate: Date;
  requestedTime: string;
  reason?: string;
  status: "pending" | "accepted" | "rejected" | "suggested";
  suggestedDate?: Date;
  suggestedTime?: string;
  duration: number;
  calendarEventId?: string;
  createdAt: Date;
  email?: string;
  phone?: string;
  notes?: string;
}

interface AppointmentStore {
  requests: AppointmentRequest[];
  addRequest: (request: Omit<AppointmentRequest, 'id' | 'createdAt'>) => void;
  updateRequest: (id: string, updates: Partial<AppointmentRequest>) => void;
  deleteRequest: (id: string) => void;
  getRequest: (id: string) => AppointmentRequest | undefined;
}

export const useAppointmentStore = create<AppointmentStore>()(
  persist(
    (set, get) => ({
      requests: [],
      addRequest: (request) => set((state) => ({
        requests: [...state.requests, {
          ...request,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        }],
      })),
      updateRequest: (id, updates) => set((state) => ({
        requests: state.requests.map((request) =>
          request.id === id ? { ...request, ...updates } : request
        ),
      })),
      deleteRequest: (id) => set((state) => ({
        requests: state.requests.filter((request) => request.id !== id),
      })),
      getRequest: (id) => get().requests.find((request) => request.id === id),
    }),
    {
      name: 'appointment-storage',
      partialize: (state) => ({ 
        requests: state.requests.map(request => ({
          ...request,
          requestedDate: request.requestedDate.toISOString(),
          suggestedDate: request.suggestedDate ? request.suggestedDate.toISOString() : undefined,
          createdAt: request.createdAt.toISOString(),
        }))
      }),
      onRehydrateStorage: () => (state) => {
        // Convert ISO strings back to Date objects
        if (state && state.requests) {
          state.requests = state.requests.map(request => ({
            ...request,
            requestedDate: new Date(request.requestedDate),
            suggestedDate: request.suggestedDate ? new Date(request.suggestedDate) : undefined,
            createdAt: new Date(request.createdAt),
          }));
        }
      },
    }
  )
);