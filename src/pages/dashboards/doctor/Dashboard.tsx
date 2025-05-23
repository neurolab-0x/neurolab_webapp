import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useDoctor } from "@/hooks/useDoctor";
import Appointments from "./Appointments";
import Patients from "./Patients";
import Reports from "./Reports";

const DoctorDashboard: React.FC = () => {
  const {
    isLoading,
    error,
    profile,
    appointments,
    patients,
    reports,
    createAppointment,
    updateAppointment,
    createReport,
    updateReport,
    deleteReport,
  } = useDoctor();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patients..." className="pl-8" />
          </div>
          <Button>New Appointment</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt =>
                new Date(apt.date).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(report => report.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Appointments
            appointments={appointments}
            onAddAppointment={createAppointment}
            onUpdateAppointment={updateAppointment}
          />
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Patients
            patients={patients}
            onViewPatient={(id) => {/* Handle view patient */ }}
            onAddPatient={(id) => {/* Handle add patient */ }}
          />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <p className="font-medium">Current Schedule</p>
                    <p className="text-muted-foreground">
                      {profile.availability.days.join(', ')}
                    </p>
                    <p className="text-muted-foreground">
                      {profile.availability.startTime} - {profile.availability.endTime}
                    </p>
                  </div>
                  <Button>Update Availability</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Reports
            reports={reports}
            onAddReport={createReport}
            onUpdateReport={updateReport}
            onDeleteReport={deleteReport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard; 