import { useEffect, useState } from 'react';
import { useDoctor } from '../hooks/useDoctor';
import { Patient } from '../../../types';

export const Patients = () => {
  const {
    patients,
    loading,
    error,
    fetchPatients,
    updatePatient,
  } = useDoctor();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const handleUpdatePatient = async (id: string, data: Partial<Patient>) => {
    try {
      await updatePatient(id, data);
      await fetchPatients();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to update patient:', err);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patients</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.userId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.phoneNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.gender}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(patient)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patient Details Modal */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Patient Details
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>Patient ID:</strong> {selectedPatient.userId}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Date of Birth:</strong>{' '}
                  {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Gender:</strong> {selectedPatient.gender}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Phone:</strong> {selectedPatient.phoneNumber}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Address:</strong> {selectedPatient.address}
                </p>
                {selectedPatient.medicalHistory && (
                  <p className="text-sm text-gray-500">
                    <strong>Medical History:</strong> {selectedPatient.medicalHistory}
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