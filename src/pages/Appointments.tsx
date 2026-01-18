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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { X, Check, Calendar as CalendarIcon, Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import { useAppointmentStore, type Appointment } from "@/stores/appointmentStore";
import { acceptAppointment, declineAppointment } from "@/api/appointments";
import { useI18n } from '@/lib/i18n';

export default function Appointments() {
  const { t } = useI18n();
  const { appointments, isLoading, error, setAppointments, updateAppointment } = useAppointmentStore();
  const [actionLoading, setActionLoading] = useState(false);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success' as const;
      case 'DECLINED':
        return 'destructive' as const;
      case 'CANCELLED':
        return 'destructive' as const;
      case 'COMPLETED':
        return 'success' as const;
      case 'PENDING':
      default:
        return 'secondary' as const;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'ACCEPTED':
        return 'Accepted';
      case 'DECLINED':
        return 'Declined';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  const handleAccept = async (appointment: Appointment) => {
    setActionLoading(true);
    try {
      const result = await acceptAppointment(appointment.id);
      updateAppointment(appointment.id, {
        status: result.status as any,
      });
      toast.success("Appointment accepted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to accept appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async (appointment: Appointment) => {
    setActionLoading(true);
    try {
      const result = await declineAppointment(appointment.id);
      updateAppointment(appointment.id, {
        status: result.status as any,
      });
      toast.success("Appointment declined");
    } catch (err: any) {
      toast.error(err?.message || "Failed to decline appointment");
    } finally {
      setActionLoading(false);
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
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : error ? (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive">
                {error}
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No appointments found
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col gap-3 p-4 rounded-lg border hover:border-primary/50 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-lg">{appointment.doctorName}</div>
                          <Badge
                            variant={getStatusBadgeVariant(appointment.status)}
                            className="capitalize"
                          >
                            {getStatusDisplay(appointment.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          {format(new Date(appointment.startTime), "PPP p")} - {format(new Date(appointment.endTime), "p")}
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {appointment.notes && (
                          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            {appointment.notes}
                          </div>
                        )}
                        {appointment.email && (
                          <div className="text-sm flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${appointment.email}`} className="text-primary hover:underline">
                              {appointment.email}
                            </a>
                          </div>
                        )}
                        {appointment.phone && (
                          <div className="text-sm flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${appointment.phone}`} className="text-primary hover:underline">
                              {appointment.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAccept(appointment)}
                        disabled={appointment.status !== "PENDING" || actionLoading}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDecline(appointment)}
                        disabled={appointment.status !== "PENDING" || actionLoading}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
