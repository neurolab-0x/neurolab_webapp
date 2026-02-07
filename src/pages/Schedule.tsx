import DashboardLayout from "@/components/DashboardLayout";
import SessionScheduler from "@/components/SessionScheduler";
import DoctorAvailability from '@/components/DoctorAvailability';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from "@/components/ui/button";

const Schedule = () => {
  const { t } = useI18n();
  const { user } = useAuth();

  const isDoctor = (user?.role || '').toString().toLowerCase() === 'doctor';

  return (
    <DashboardLayout>
      <div className="w-full space-y-8 animate-fade-in relative">
        {/* Ambient Background Blur */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter">{t('schedule.title')}</h1>
            <p className="text-muted-foreground font-medium">{isDoctor ? t('schedule.doctorAvailability') : t('schedule.description')}</p>
          </div>
          {!isDoctor && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-10 border-primary/20 hover:bg-primary/10 text-primary font-bold shadow-sm"
                onClick={async () => {
                  try {
                    const { getCalendarAuthUrl } = await import('@/api/calendar');
                    const response = await getCalendarAuthUrl();
                    if (response.url) window.location.href = response.url;
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                Connect Google Calendar
              </Button>
            </div>
          )}
        </div>

        <div className="glass-platter rounded-3xl overflow-hidden border-white/5 shadow-premium">
          {isDoctor ? <DoctorAvailability /> : <SessionScheduler />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;