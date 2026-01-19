import DashboardLayout from '@/components/DashboardLayout';

const dummyLogs = [
  { id: 'l1', time: '2026-01-18 09:00', message: 'User login', user: 'user1@example.com' },
  { id: 'l2', time: '2026-01-18 09:30', message: 'Role changed', user: 'admin@example.com' },
];

export default function AdminLogsPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-2">Searchable system activity logs.</p>

        <div className="mt-6 space-y-2">
          {dummyLogs.map((l) => (
            <div key={l.id} className="p-3 border rounded">
              <div className="text-xs text-muted-foreground">{l.time} — {l.user}</div>
              <div className="mt-1">{l.message}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
