import DashboardLayout from "@/components/DashboardLayout";
import SessionScheduler from "@/components/SessionScheduler";
import { useI18n } from '@/lib/i18n';

const Schedule = () => {
  const { t } = useI18n();
  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{t('schedule.title')}</h1>
            <p className="text-muted-foreground">{t('schedule.description')}</p>
          </div>
        </div>
        <SessionScheduler />
      </div>
    </DashboardLayout>
  );
};

export default Schedule; 