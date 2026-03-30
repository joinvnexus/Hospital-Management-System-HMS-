import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrescription } from '../context/PrescriptionContext';
import { usePatient } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';
import FormInput from '../components/FormInput';

/**
 * PrescriptionCreationForm Component
 * Form for doctors to create prescriptions for patients
 * Includes medicine selection, dosage, frequency, and duration
 */
const PrescriptionCreationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPrescription, loading, error, clearError } = usePrescription();
  const { patients, fetchPatients, loading: patientsLoading } = usePatient();

  const [formData, setFormData] = useState({
    patientId: '',
    medicines: [
      {
        name: '',
        dosage: '',
        frequency: 'Once daily',
        duration: '',
        instructions: ''
      }
    ],
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Clear error when form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, error, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.map((medicine, i) =>
        i === index ? { ...medicine, [field]: value } : medicine
      )
    }));
  };

  const addMedicine = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        {
          name: '',
          dosage: '',
          frequency: 'Once daily',
          duration: '',
          instructions: ''
        }
      ]
    }));
  };

  const removeMedicine = (index) => {
    if (formData.medicines.length > 1) {
      setFormData(prev => ({
        ...prev,
        medicines: prev.medicines.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.patientId) {
      alert('Please select a patient');
      return;
    }

    if (formData.medicines.some(med => !med.name || !med.dosage || !med.duration)) {
      alert('Please fill in all required fields for each medicine');
      return;
    }

    setSubmitting(true);
    try {
      const prescriptionData = {
        ...formData,
        doctorId: user._id
      };

      await createPrescription(prescriptionData);
      setSuccess(true);

      // Reset form
      setFormData({
        patientId: '',
        medicines: [
          {
            name: '',
            dosage: '',
            frequency: 'Once daily',
            duration: '',
            instructions: ''
          }
        ],
        notes: ''
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/prescriptions');
      }, 2000);

    } catch (error) {
      console.error('Failed to create prescription:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Twice weekly',
    'As needed'
  ];

  if (patientsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading patients..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Prescription</h1>
          <p className="text-gray-600 mt-1">Create a new prescription for a patient</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-green-800 font-medium">Prescription created successfully!</p>
                <p className="text-green-700 text-sm">Redirecting to prescriptions list...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} dismissible={true} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <Card className="bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Patient *
              </label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a patient...</option>
                {patients.map(patient => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName} (Age: {patient.age})
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Medicines Section */}
          <Card className="bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Medicines</h3>
              <button
                type="button"
                onClick={addMedicine}
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Medicine
              </button>
            </div>

            <div className="space-y-6">
              {formData.medicines.map((medicine, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Medicine {index + 1}</h4>
                    {formData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Medicine Name *"
                      value={medicine.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      placeholder="e.g., Amoxicillin"
                      required
                    />

                    <FormInput
                      label="Dosage *"
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      placeholder="e.g., 500mg"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency *
                      </label>
                      <select
                        value={medicine.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        {frequencyOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <FormInput
                      label="Duration *"
                      value={medicine.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      placeholder="e.g., 7 days"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <FormInput
                      label="Special Instructions"
                      value={medicine.instructions}
                      onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      placeholder="e.g., Take with food, avoid alcohol"
                      textarea
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes Section */}
          <Card className="bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
            <FormInput
              label="Prescription Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional instructions or notes for the patient..."
              textarea
              rows={3}
            />
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {submitting ? 'Creating Prescription...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionCreationForm;