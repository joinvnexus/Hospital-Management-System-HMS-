import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrescription } from '../context/PrescriptionContext';
import { usePatient } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const PrescriptionCreationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPrescription, loading, error, clearError } = usePrescription();
  const { patients, fetchPatients, loading: patientsLoading } = usePatient();
  const [formData, setFormData] = useState({
    patientId: '',
    medicines: [{ name: '', dosage: '', frequency: 'Once daily', duration: '', instructions: '' }],
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, error, clearError]);

  const updateMedicine = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((medicine, medicineIndex) =>
        medicineIndex === index ? { ...medicine, [field]: value } : medicine
      ),
    }));
  };

  const addMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: 'Once daily', duration: '', instructions: '' }],
    }));
  };

  const removeMedicine = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, medicineIndex) => medicineIndex !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPrescription({
        ...formData,
        doctorId: getEntityId(user),
      });
      navigate(ROUTES.prescriptions);
    } catch (submitError) {
      console.error('Failed to create prescription:', submitError);
    } finally {
      setSubmitting(false);
    }
  };

  if (patientsLoading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading patients..." /></div>;
  }

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap max-w-4xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Prescription Workflow</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Create prescription</h1>
        </div>

        {error && <ErrorMessage message={error} dismissible={true} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card title="Patient">
            <select
              value={formData.patientId}
              onChange={(e) => setFormData((prev) => ({ ...prev, patientId: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              <option value="">Choose a patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </Card>

          <Card title="Medicines" actions={<button type="button" onClick={addMedicine} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Add Medicine</button>}>
            <div className="space-y-5">
              {formData.medicines.map((medicine, index) => (
                <div key={`medicine-${index}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormInput label="Medicine Name" value={medicine.name} onChange={(e) => updateMedicine(index, 'name', e.target.value)} />
                    <FormInput label="Dosage" value={medicine.dosage} onChange={(e) => updateMedicine(index, 'dosage', e.target.value)} />
                    <FormInput label="Frequency" value={medicine.frequency} onChange={(e) => updateMedicine(index, 'frequency', e.target.value)} />
                    <FormInput label="Duration" value={medicine.duration} onChange={(e) => updateMedicine(index, 'duration', e.target.value)} />
                  </div>
                  <FormInput label="Instructions" value={medicine.instructions} onChange={(e) => updateMedicine(index, 'instructions', e.target.value)} textarea={true} />
                  {formData.medicines.length > 1 && (
                    <button type="button" onClick={() => removeMedicine(index)} className="text-sm font-semibold text-rose-700">
                      Remove medicine
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Notes">
            <FormInput label="Additional Notes" name="notes" value={formData.notes} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} textarea={true} />
          </Card>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate(ROUTES.doctorDashboard)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700">
              Cancel
            </button>
            <button type="submit" disabled={submitting || loading} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionCreationForm;
