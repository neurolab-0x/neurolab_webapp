import { useEffect } from 'react';
import { useDoctor } from '../hooks/useDoctor';
import { useAuth } from '../../auth/hooks/useAuth';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const {
    appointments,
    patients,
    reports,
    loading,
    error,
    fetchAppointments,
    fetchPatients,
    fetchReports,
  } = useDoctor();

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchReports();
  }, [fetchAppointments, fetchPatients, fetchReports]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, Dr. {user?.firstName} {user?.lastName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments</p>
          ) : (
            <ul className="space-y-4">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="border-b pb-2">
                  <p className="font-medium">
                    {new Date(appointment.date).toLocaleDateString()} at{' '}
                    {appointment.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {appointment.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Patients Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Patients</h2>
          {patients.length === 0 ? (
            <p className="text-gray-500">No patients found</p>
          ) : (
            <ul className="space-y-4">
              {patients.slice(0, 5).map((patient) => (
                <li key={patient.id} className="border-b pb-2">
                  <p className="font-medium">
                    {patient.userId} {/* Replace with actual patient name */}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {patient.phoneNumber}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
          {reports.length === 0 ? (
            <p className="text-gray-500">No reports found</p>
          ) : (
            <ul className="space-y-4">
              {reports.slice(0, 5).map((report) => (
                <li key={report.id} className="border-b pb-2">
                  <p className="font-medium">
                    {new Date(report.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Diagnosis: {report.diagnosis}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}; 