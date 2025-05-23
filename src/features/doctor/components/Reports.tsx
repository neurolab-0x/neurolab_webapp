import { useEffect, useState } from 'react';
import { useDoctor } from '../hooks/useDoctor';
import { MedicalReport } from '../../../types';

export const Reports = () => {
  const {
    reports,
    loading,
    error,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
  } = useDoctor();

  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleViewDetails = (report: MedicalReport) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const handleCreateReport = async (data: Omit<MedicalReport, 'id'>) => {
    try {
      await createReport(data);
      await fetchReports();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create report:', err);
    }
  };

  const handleUpdateReport = async (id: string, data: Partial<MedicalReport>) => {
    try {
      await updateReport(id, data);
      await fetchReports();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to update report:', err);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(id);
        await fetchReports();
      } catch (err) {
        console.error('Failed to delete report:', err);
      }
    }
  };

  const filteredReports = reports.filter((report) =>
    report.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Reports</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create New Report
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search reports..."
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
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diagnosis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(report.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{report.patientId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{report.diagnosis}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(report)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Details Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Report Details
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>Date:</strong>{' '}
                  {new Date(selectedReport.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Patient ID:</strong> {selectedReport.patientId}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Diagnosis:</strong> {selectedReport.diagnosis}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Treatment:</strong> {selectedReport.treatment}
                </p>
                {selectedReport.notes && (
                  <p className="text-sm text-gray-500">
                    <strong>Notes:</strong> {selectedReport.notes}
                  </p>
                )}
                {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                  <div className="mt-2">
                    <strong className="text-sm text-gray-500">Attachments:</strong>
                    <ul className="mt-1">
                      {selectedReport.attachments.map((attachment, index) => (
                        <li key={index} className="text-sm text-blue-600">
                          <a href={attachment} target="_blank" rel="noopener noreferrer">
                            Attachment {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
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

      {/* Create Report Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create New Report
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleCreateReport({
                    patientId: formData.get('patientId') as string,
                    doctorId: '', // Will be set by the backend
                    date: new Date().toISOString(),
                    diagnosis: formData.get('diagnosis') as string,
                    treatment: formData.get('treatment') as string,
                    notes: formData.get('notes') as string,
                  });
                }}
              >
                <div className="mt-2 px-7 py-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Patient ID
                    </label>
                    <input
                      type="text"
                      name="patientId"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Diagnosis
                    </label>
                    <textarea
                      name="diagnosis"
                      required
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Treatment
                    </label>
                    <textarea
                      name="treatment"
                      required
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Create Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="mt-2 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 