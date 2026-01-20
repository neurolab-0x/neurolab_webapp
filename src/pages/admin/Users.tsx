import DashboardLayout from '@/components/DashboardLayout';
import UserManagement from '@/components/admin/UserManagement';
import ClinicManagement from '@/components/admin/ClinicManagement';
import BillingManagement from '@/components/admin/BillingManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building2, DollarSign } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage users, clinics, and billing for NeuroLab Rwanda MVP.</p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="clinics" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clinics</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="clinics" className="mt-6">
            <ClinicManagement />
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <BillingManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
