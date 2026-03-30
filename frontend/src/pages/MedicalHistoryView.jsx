import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';

/**
 * MedicalHistoryView Component
 * Displays comprehensive medical history including allergies, conditions, and medications
 */
const MedicalHistoryView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPatient, loading, error, fetchCurrentPatient } = usePatient();

  // Fetch patient data on mount
  useEffect(() => {
    if (user?.id) {
      fetchCurrentPatient(user._id);
    }
  }, [user, fetchCurrentPatient]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading medical history..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage
            message={error}
            onRetry={() => fetchCurrentPatient(user._id)}
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  // No patient data
  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage
            message="Medical history not found. Please try again."
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  const medicalHistory = currentPatient.medicalHistory || {};
  const allergies = medicalHistory.allergies || [];
  const conditions = medicalHistory.conditions || [];
  const medications = medicalHistory.medications || [];

  // Color mapping for severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'moderate':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'mild':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/patient/profile')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Medical History</h1>
          <p className="text-gray-600 mt-2">Comprehensive overview of your health information</p>
        </div>

        {/* Allergies Section */}
        <Card
          title="Known Allergies"
          subtitle={`${allergies.length} allergy record${allergies.length !== 1 ? 's' : ''}`}
          className="bg-white mb-8"
        >
          {allergies.length > 0 ? (
            <div className="space-y-3">
              {allergies.map((allergy, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-semibold text-red-900">{allergy}</h3>
                    <p className="text-sm text-red-700 mt-1">Avoid contact and exposure</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-gray-600 font-medium">No known allergies recorded</p>
              <p className="text-sm text-gray-500 mt-1">Great! Keep your doctor updated if you develop any new allergies.</p>
            </div>
          )}
        </Card>

        {/* Medical Conditions Section */}
        <Card
          title="Medical Conditions"
          subtitle={`${conditions.length} condition${conditions.length !== 1 ? 's' : ''}`}
          className="bg-white mb-8"
        >
          {conditions.length > 0 ? (
            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-semibold text-orange-900">{condition}</h3>
                    <p className="text-sm text-orange-700 mt-1">Ongoing management required</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-gray-600 font-medium">No medical conditions recorded</p>
              <p className="text-sm text-gray-500 mt-1">Excellent health status! Keep up your healthy lifestyle.</p>
            </div>
          )}
        </Card>

        {/* Current Medications Section */}
        <Card
          title="Current Medications"
          subtitle={`${medications.length} medication${medications.length !== 1 ? 's' : ''}`}
          className="bg-white mb-8"
        >
          {medications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Medication
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Dosage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {typeof med === 'string' ? med : med.name || 'Medication'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {typeof med === 'object' && med.dosage ? med.dosage : 'As prescribed'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {typeof med === 'object' && med.frequency
                          ? med.frequency
                          : 'Daily'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-gray-600 font-medium">No current medications</p>
              <p className="text-sm text-gray-500 mt-1">No medications are currently prescribed.</p>
            </div>
          )}
        </Card>

        {/* Medical Summary Card */}
        <Card
          title="Health Summary"
          subtitle="Quick overview of your medical status"
          className="bg-white"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Allergies Count */}
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="text-2xl font-bold text-red-600">{allergies.length}</div>
              <p className="text-sm text-red-700 mt-1">Known Allergies</p>
            </div>

            {/* Conditions Count */}
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="text-2xl font-bold text-orange-600">{conditions.length}</div>
              <p className="text-sm text-orange-700 mt-1">Conditions</p>
            </div>

            {/* Medications Count */}
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="text-2xl font-bold text-green-600">{medications.length}</div>
              <p className="text-sm text-green-700 mt-1">Active Medications</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/patient/profile')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Back to Profile
            </button>
          </div>
        </Card>

        {/* Important Note */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Important Information
          </h4>
          <p className="text-sm text-yellow-800 mt-2">
            This medical history is for informational purposes only. Always consult with your doctor
            for medical advice, diagnosis, or treatment. If you notice any errors in your medical
            history, please contact your healthcare provider immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryView;
