import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';

const dummyUsers = [
  { id: 'u1', email: 'alice@example.com' },
  { id: 'u2', email: 'bob@example.com' },
];

export default function AdminImpersonatePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const startImpersonation = () => {
    if (!selected) return setMessage('Select a user to impersonate');
    setMessage(`Impersonation simulated for ${selected}`);
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Impersonate User (Demo)</h1>
        <p className="text-sm text-muted-foreground mt-2">Simulate acting as a user for testing. This is a demo (no backend integration).</p>

        <div className="mt-6 space-y-4">
          <select value={selected ?? ''} onChange={(e) => setSelected(e.target.value)} className="p-2 border rounded">
            <option value="">Select user</option>
            {dummyUsers.map((u) => (
              <option key={u.id} value={u.email}>{u.email}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button className="btn" onClick={startImpersonation}>Start Impersonation (demo)</button>
          </div>
          {message && <div className="text-sm text-muted-foreground">{message}</div>}
        </div>
      </div>
    </DashboardLayout>
  );
}
