import DashboardLayout from '@/components/DashboardLayout';

export default function AdminStatsPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">System Statistics</h1>
        <p className="text-sm text-muted-foreground mt-2">Overview of platform metrics and dashboards.</p>
        <div className="mt-6">
          <div className="p-4 border rounded">Add charts and system KPIs here.</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
