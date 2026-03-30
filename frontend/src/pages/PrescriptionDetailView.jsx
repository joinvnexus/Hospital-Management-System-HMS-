import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePrescription } from '../context/PrescriptionContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';

/**
 * PrescriptionDetailView Component
 * Displays detailed information about a specific prescription
 * Includes PDF generation and medication details
 */
const PrescriptionDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchPrescriptionById, deletePrescription, loading, error } = usePrescription();

  const [prescription, setPrescription] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Fetch prescription details on mount
  useEffect(() => {
    if (id) {
      fetchPrescriptionById(id)
        .then(setPrescription)
        .catch(console.error);
    }
  }, [id, fetchPrescriptionById]);

  // Handle delete prescription
  const handleDeletePrescription = async () => {
    if (!window.confirm('Are you sure you want to delete this prescription? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await deletePrescription(prescription._id);
      navigate('/prescriptions');
    } catch (error) {
      console.error('Failed to delete prescription:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Handle PDF generation (placeholder for now)
  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      // TODO: Implement PDF generation
      alert('PDF generation feature coming soon!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status badge styling
  const getStatusBadge = (prescription) => {
    const now = new Date();
    const expiryDate = prescription.expiryDate ? new Date(prescription.expiryDate) : null;

    if (!expiryDate) {
      return { text: 'Active', className: 'bg-green-100 text-green-800 border-green-200' };
    }

    if (expiryDate <= now) {
      return { text: 'Expired', className: 'bg-red-100 text-red-800 border-red-200' };
    }

    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (expiryDate <= sevenDaysFromNow) {
      return { text: 'Expiring Soon', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }

    return { text: 'Active', className: 'bg-green-100 text-green-800 border-green-200' };
  };

  // Check if user can edit/delete this prescription
  const canModifyPrescription = () => {
    return user?.role === 'doctor' && prescription?.doctorId?._id === user._id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading prescription details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage
            message={error}
            onRetry={() => fetchPrescriptionById(id).then(setPrescription)}
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage
            message="Prescription not found"
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(prescription);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/prescriptions')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Prescriptions
          </button>
        </div>

        {/* Prescription Header */}
        <Card className="bg-white mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prescription Details</h1>
              <p className="text-gray-600 mt-1">Prescription ID: {prescription._id.slice(-8).toUpperCase()}</p>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${statusBadge.className}`}>
              {statusBadge.text}
            </span>
          </div>

          {/* Doctor and Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Prescribed By</h3>
              <div className="text-lg font-semibold text-gray-900">
                Dr. {prescription.doctorId.firstName} {prescription.doctorId.lastName}
              </div>
              <div className="text-gray-600">
                {prescription.doctorId.speciality}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                License: {prescription.doctorId.medicalLicenseNumber}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Patient</h3>
              <div className="text-lg font-semibold text-gray-900">
                {prescription.patientId.firstName} {prescription.patientId.lastName}
              </div>
              <div className="text-gray-600">
                Age: {prescription.patientId.age} • {prescription.patientId.gender}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {prescription.patientId.email}
              </div>
            </div>
          </div>

          {/* Prescription Date */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Prescription Date</h3>
            <div className="text-lg font-semibold text-gray-900">
              {formatDate(prescription.diagnosisDate)}
            </div>
          </div>
        </Card>

        {/* Medicines Section */}
        <Card className="bg-white mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Prescribed Medicines</h3>
          <div className="space-y-4">
            {prescription.medicines.map((medicine, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{medicine.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Dosage:</span>
                        <span className="ml-2 text-gray-900">{medicine.dosage}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Frequency:</span>
                        <span className="ml-2 text-gray-900">{medicine.frequency}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Duration:</span>
                        <span className="ml-2 text-gray-900">{medicine.duration}</span>
                      </div>
                    </div>
                    {medicine.instructions && (
                      <div className="mt-3">
                        <span className="font-medium text-gray-500">Instructions:</span>
                        <p className="mt-1 text-gray-700">{medicine.instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notes Section */}
        {prescription.notes && (
          <Card className="bg-white mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{prescription.notes}</p>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="bg-white">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
            </button>

            {canModifyPrescription() && (
              <>
                <button
                  onClick={() => navigate(`/prescriptions/${prescription._id}/edit`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Edit Prescription
                </button>

                <button
                  onClick={handleDeletePrescription}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete Prescription'}
                </button>
              </>
            )}
          </div>
        </Card>

        {/* Important Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-900 font-medium mb-2">Important Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Always follow the prescribed dosage and frequency</li>
            <li>• Complete the full course of medication unless advised otherwise by your doctor</li>
            <li>• Inform your doctor about any allergies or side effects</li>
            <li>• Keep medications out of reach of children</li>
            <li>• Store medications as directed (room temperature, refrigerated, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailView;