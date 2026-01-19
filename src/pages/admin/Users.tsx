import DashboardLayout from '@/components/DashboardLayout';
import UserManagement from '@/components/admin/UserManagement';

export default function AdminUsersPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground mt-2">Manage application users and roles.</p>
        <div className="mt-6">
          <UserManagement />
        </div>
      </div>
    </DashboardLayout>
  );
}
