import DashboardLayout from '@/components/DashboardLayout';

export default function DoctorDashboard() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Doctor Portal</h1>
        <p className="text-sm text-muted-foreground mt-2">Access patient lists, appointments, and review analyses.</p>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="p-4 border rounded">
            <h2 className="font-semibold">Patient List</h2>
            <p className="text-xs text-muted-foreground">This view will show your assigned patients.</p>
          </div>

          <div className="p-4 border rounded">
            <h2 className="font-semibold">Appointments</h2>
            <p className="text-xs text-muted-foreground">Manage and confirm patient appointments.</p>
          </div>

          <div className="p-4 border rounded">
            <h2 className="font-semibold">Analyses</h2>
            <p className="text-xs text-muted-foreground">Review analysis results for your patients.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
