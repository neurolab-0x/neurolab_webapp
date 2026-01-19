import DashboardLayout from '@/components/DashboardLayout';

const dummyRates = [
  { code: 'A01', diagnosis: 'General consultation', fee: 20 },
  { code: 'B02', diagnosis: 'EEG analysis (basic)', fee: 45 },
  { code: 'C03', diagnosis: 'EEG analysis (detailed)', fee: 120 },
];

export default function AdminBillingPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Billing & RSSB Adjustments</h1>
        <p className="text-sm text-muted-foreground mt-2">Adjust rates and preview billing impact.</p>

        <div className="mt-6 space-y-4">
          {dummyRates.map((r) => (
            <div key={r.code} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{r.diagnosis} ({r.code})</div>
                <div className="text-xs text-muted-foreground">Current fee: ${r.fee}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn">Edit Fee</button>
                <button className="btn">Preview Impact</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
