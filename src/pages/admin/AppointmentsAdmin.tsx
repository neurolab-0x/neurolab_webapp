import DashboardLayout from '@/components/DashboardLayout';

const dummyAppts = [
  { id: 'a1', patient: 'Alice', time: '2026-01-20 10:00', status: 'pending' },
  { id: 'a2', patient: 'Bob', time: '2026-01-21 14:00', status: 'confirmed' },
];

export default function AdminAppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Appointment Oversight</h1>
        <p className="text-sm text-muted-foreground mt-2">Review and manage appointment requests.</p>

        <div className="mt-6 space-y-4">
          {dummyAppts.map((a) => (
            <div key={a.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{a.patient}</div>
                <div className="text-xs text-muted-foreground">{a.time} • {a.status}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn">Approve</button>
                <button className="btn">Reschedule</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
