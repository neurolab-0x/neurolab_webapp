import DashboardLayout from '@/components/DashboardLayout';

const dummyClinics = [
  { id: 'c1', name: 'Ndera Hospital', lat: -1.944, lng: 30.055, verified: true },
  { id: 'c2', name: 'King Faisal Hospital', lat: -1.943, lng: 30.059, verified: true },
];

export default function AdminClinicsPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Clinic & Hospital Management</h1>
        <p className="text-sm text-muted-foreground mt-2">Add, verify and manage clinics and hospitals.</p>
        <div className="mt-6 space-y-4">
          {dummyClinics.map((c) => (
            <div key={c.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.lat}, {c.lng} • {c.verified ? 'Verified' : 'Unverified'}</div>
              </div>
              <div className="space-x-2">
                <button className="btn">Edit</button>
                <button className="btn">Verify</button>
                <button className="btn btn-destructive">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
