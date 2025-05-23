import DashboardLayout from "@/components/DashboardLayout";
import SessionScheduler from "@/components/SessionScheduler";

const Schedule = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Schedule Sessions</h1>
            <p className="text-muted-foreground">Schedule and manage your EEG analysis sessions</p>
          </div>
        </div>
        <SessionScheduler />
      </div>
    </DashboardLayout>
  );
};

export default Schedule; 