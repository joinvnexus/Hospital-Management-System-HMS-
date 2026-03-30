import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrescription } from '../context/PrescriptionContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const PrescriptionListView = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const {
    prescriptions,
    loading,
    error,
    fetchPrescriptions,
    fetchPrescriptionsByPatient,
    deletePrescription,
  } = usePrescription();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const entityId = getEntityId(user);
    if (!entityId) return;
    if (role === 'doctor') {
      fetchPrescriptions({ doctorId: entityId });
    } else {
      fetchPrescriptionsByPatient(entityId);
    }
  }, [user, role, fetchPrescriptions, fetchPrescriptionsByPatient]);

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const medicineNames = (prescription.medicines || []).map((medicine) => medicine.name).join(' ').toLowerCase();
    return medicineNames.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading prescriptions..." /></div>;
  }

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Prescription Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Prescriptions</h1>
          </div>
          {role === 'doctor' && (
            <button onClick={() => navigate(ROUTES.createPrescription)} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              Create Prescription
            </button>
          )}
        </div>

        {error && <ErrorMessage message={error} dismissible={true} />}

        <Card title="Search">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by medicine name"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </Card>

        {filteredPrescriptions.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredPrescriptions.map((prescription) => (
              <Card key={prescription._id} hoverable={true}>
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {role === 'doctor'
                        ? `${prescription.patientId?.firstName} ${prescription.patientId?.lastName}`
                        : `Dr. ${prescription.doctorId?.firstName} ${prescription.doctorId?.lastName}`}
                    </p>
                    <p className="text-sm text-slate-500">{new Date(prescription.diagnosisDate || prescription.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-2">
                    {(prescription.medicines || []).map((medicine, index) => (
                      <div key={`${prescription._id}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <p className="font-medium text-slate-900">{medicine.name}</p>
                        <p className="text-sm text-slate-600">
                          {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button onClick={() => navigate(`/prescriptions/${prescription._id}`)} className="text-sm font-semibold text-sky-700">
                      View details
                    </button>
                    {role === 'doctor' && (
                      <button onClick={() => deletePrescription(prescription._id)} className="text-sm font-semibold text-rose-700">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card title="No prescriptions found" subtitle="Try a different search or create a new prescription." />
        )}
      </div>
    </div>
  );
};

export default PrescriptionListView;
