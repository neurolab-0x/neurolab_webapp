import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getClinics, createClinic, deleteClinic } from '@/api/clinics';
import { useToast } from '@/components/ui/use-toast';

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'HOSPITAL',
    address: '',
    city: 'Kigali',
    hardwareType: 'NIHON_KOHDEN'
  });
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const data = await getClinics();
      setClinics(data || []);
    } catch (e: any) {
      console.error('Failed to load clinics', e);
      toast({ title: 'Failed to load clinics', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        type: form.type,
        location: { address: form.address, city: form.city },
        integration: { hardwareType: form.hardwareType }
      };
      await createClinic(payload);
      toast({ title: 'Clinic created' });
      setForm({ name: '', type: 'HOSPITAL', address: '', city: 'Kigali', hardwareType: 'NIHON_KOHDEN' });
      await load();
    } catch (err: any) {
      console.error('Create clinic failed', err);
      toast({ title: err?.message || 'Failed to create clinic', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this clinic?')) return;
    try {
      await deleteClinic(id);
      toast({ title: 'Clinic removed' });
      await load();
    } catch (err: any) {
      console.error('Delete failed', err);
      toast({ title: 'Failed to remove clinic', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Clinic & Hospital Management</h1>
        <p className="text-sm text-muted-foreground mt-2">Add, verify and manage clinics and hospitals.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Create Clinic / Hospital</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm block mb-1">Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full rounded border px-3 py-2">
                  <option value="HOSPITAL">Hospital</option>
                  <option value="CLINIC">Clinic</option>
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full rounded border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm block mb-1">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full rounded border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm block mb-1">Hardware Integration</label>
                <select name="hardwareType" value={form.hardwareType} onChange={handleChange} className="w-full rounded border px-3 py-2">
                  <option value="NIHON_KOHDEN">NIHON_KOHDEN</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div>
                <button className="rounded bg-blue-600 text-white px-4 py-2">Create</button>
              </div>
            </form>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Existing Clinics</h2>
            <div className="space-y-3">
              {loading ? <div>Loading...</div> : clinics.length === 0 ? <div className="text-sm text-muted-foreground">No clinics found.</div> : clinics.map((c: any) => (
                <div key={c.id || c._id || c.name} className="p-4 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.location?.address || ''} {c.location?.city ? '• ' + c.location.city : ''}</div>
                    <div className="text-xs text-muted-foreground">Integration: {c.integration?.hardwareType || '—'}</div>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => navigator.clipboard?.writeText(JSON.stringify(c))} className="px-2 py-1 rounded border">Copy</button>
                    <button onClick={() => handleDelete(c.id || c._id)} className="px-2 py-1 rounded border text-red-600">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
