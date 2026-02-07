import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Analysis from '@/pages/Analysis';
import DoctorPatients from '@/components/doctor/DoctorPatients';
import DoctorTeleconsults from '@/components/doctor/DoctorTeleconsults';
import DoctorPlans from '@/components/doctor/DoctorPlans';
import DoctorMonitoring from '@/components/doctor/DoctorMonitoring';
import DoctorIntegrations from '@/components/doctor/DoctorIntegrations';
import { useI18n } from '@/lib/i18n';

export default function DoctorDashboard() {
  const [tab, setTab] = useState<'overview'|'analysis'|'patients'|'teleconsults'|'plans'|'monitoring'|'integrations'>('overview');
  const { t } = useI18n();

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doctor Portal</h1>
            <p className="text-sm text-muted-foreground mt-2">{t('doctor.description') || 'EEG diagnostics, patient management, and teleconsults.'}</p>
          </div>
        </div>

        <div className="mt-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="teleconsults">Teleconsults</TabsTrigger>
              <TabsTrigger value="plans">Treatment Plans</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border rounded">
                  <h2 className="font-semibold">Welcome</h2>
                  <p className="text-xs text-muted-foreground">Quick access to analyses, patients and teleconsults.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <Analysis />
            </TabsContent>

            <TabsContent value="patients">
              <DoctorPatients />
            </TabsContent>

            <TabsContent value="teleconsults">
              <DoctorTeleconsults />
            </TabsContent>

            <TabsContent value="plans">
              <DoctorPlans />
            </TabsContent>

            <TabsContent value="monitoring">
              <DoctorMonitoring />
            </TabsContent>

            <TabsContent value="integrations">
              <DoctorIntegrations />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
