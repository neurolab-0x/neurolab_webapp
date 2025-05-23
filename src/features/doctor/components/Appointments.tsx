import { useEffect, useState } from 'react';
import { useDoctor } from '../hooks/useDoctor';
import { Appointment } from '../../../types';

export const Appointments = () => {
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    updateAppointment,
  } = useDoctor();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    try {
      await updateAppointment(id, { status });
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">{appointment.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.patientId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'scheduled'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(appointment)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    View
                  </button>
                  <select
                    value={appointment.status}
                    onChange={(e) =>
                      handleStatusChange(
                        appointment.id,
                        e.target.value as Appointment['status']
                      )
                    }
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Appointment Details
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>Date:</strong>{' '}
                  {new Date(selectedAppointment.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Time:</strong> {selectedAppointment.time}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {selectedAppointment.status}
                </p>
                {selectedAppointment.notes && (
                  <p className="text-sm text-gray-500">
                    <strong>Notes:</strong> {selectedAppointment.notes}
                  </p>
                )}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 