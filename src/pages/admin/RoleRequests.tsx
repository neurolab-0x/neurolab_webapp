import DashboardLayout from '@/components/DashboardLayout';
import RoleRequests from '@/components/admin/RoleRequests';

export default function AdminRoleRequestsPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Role Change Requests</h1>
        <p className="text-sm text-muted-foreground mt-2">Approve or reject requests to become a doctor.</p>
        <div className="mt-6">
          <RoleRequests />
        </div>
      </div>
    </DashboardLayout>
  );
}
