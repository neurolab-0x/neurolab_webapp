import DashboardLayout from '@/components/DashboardLayout';

const dummyDevices = [
  { id: 'd1', model: 'NeuroKit v1', owner: 'user1@example.com', status: 'online' },
  { id: 'd2', model: 'NeuroKit v2', owner: 'user2@example.com', status: 'offline' },
];

export default function AdminDevicesPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Device Management</h1>
        <p className="text-sm text-muted-foreground mt-2">View and manage registered devices.</p>

        <div className="mt-6 space-y-4">
          {dummyDevices.map((d) => (
            <div key={d.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{d.model} ({d.id})</div>
                <div className="text-xs text-muted-foreground">Owner: {d.owner} • {d.status}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn">Assign</button>
                <button className="btn">Update</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
