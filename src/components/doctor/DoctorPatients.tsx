import DashboardLayout from '@/components/DashboardLayout';

export default function DoctorPatients() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Patient List</h2>
      <p className="text-sm text-muted-foreground">Assigned patients will appear here. You can view history, vitals, and reports.</p>
    </div>
  );
}
