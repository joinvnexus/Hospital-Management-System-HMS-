import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePrescription } from '../context/PrescriptionContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const PrescriptionDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, role } = useAuth();
  const { fetchPrescriptionById, deletePrescription, loading, error } = usePrescription();
  const [prescription, setPrescription] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPrescriptionById(id).then(setPrescription).catch(console.error);
    }
  }, [id, fetchPrescriptionById]);

  const canModifyPrescription =
    role === 'doctor' && prescription?.doctorId?._id === getEntityId(user);

  const handleDeletePrescription = async () => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) {
      return;
    }

    setDeleting(true);
    try {
      await deletePrescription(prescription._id);
      navigate(ROUTES.prescriptions);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading prescription details..." /></div>;
  }

  if (error) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-4xl"><ErrorMessage message={error} dismissible={false} /></div></div>;
  }

  if (!prescription) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-4xl"><ErrorMessage message="Prescription not found" dismissible={false} /></div></div>;
  }

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap max-w-4xl space-y-6">
        <button onClick={() => navigate(ROUTES.prescriptions)} className="text-sm font-semibold text-sky-700">
          Back to Prescriptions
        </button>

        <Card title="Prescription Details" subtitle={`Prescription ID: ${prescription._id.slice(-8).toUpperCase()}`}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Prescribed By</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                Dr. {prescription.doctorId.firstName} {prescription.doctorId.lastName}
              </p>
              <p className="text-sm text-slate-600">{prescription.doctorId.speciality}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Patient</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {prescription.patientId.firstName} {prescription.patientId.lastName}
              </p>
              <p className="text-sm text-slate-600">
                Age: {prescription.patientId.age} • {prescription.patientId.gender}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Medicines">
          <div className="space-y-3">
            {prescription.medicines.map((medicine, index) => (
              <div key={`medicine-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{medicine.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                </p>
                {medicine.instructions && <p className="mt-2 text-sm text-slate-500">{medicine.instructions}</p>}
              </div>
            ))}
          </div>
        </Card>

        {prescription.notes && (
          <Card title="Additional Notes">
            <p className="text-sm text-slate-600">{prescription.notes}</p>
          </Card>
        )}

        {canModifyPrescription && (
          <Card title="Actions">
            <div className="flex gap-3">
              <button onClick={() => navigate(`/prescriptions/${prescription._id}`)} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                View Record
              </button>
              <button onClick={handleDeletePrescription} disabled={deleting} className="rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Delete Prescription'}
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDetailView;
