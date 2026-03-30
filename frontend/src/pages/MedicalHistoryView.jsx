import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const MedicalHistoryView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPatient, loading, error, fetchCurrentPatient } = usePatient();

  useEffect(() => {
    const patientId = getEntityId(user);
    if (patientId) {
      fetchCurrentPatient(patientId);
    }
  }, [user, fetchCurrentPatient]);

  if (loading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading medical history..." /></div>;
  }

  if (error) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-5xl"><ErrorMessage message={error} dismissible={false} /></div></div>;
  }

  if (!currentPatient) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-5xl"><ErrorMessage message="Medical history not found." dismissible={false} /></div></div>;
  }

  const medicalHistory = currentPatient.medicalHistory || {};
  const allergies = medicalHistory.allergies || [];
  const conditions = medicalHistory.conditions || [];
  const medications = medicalHistory.medications || [];

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap max-w-5xl space-y-6">
        <button onClick={() => navigate(ROUTES.patientProfile)} className="text-sm font-semibold text-sky-700">
          Back to Profile
        </button>

        <section className="panel overflow-hidden bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Medical History</p>
          <h1 className="mt-3 text-4xl font-semibold">Health summary for {currentPatient.firstName}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Review recorded allergies, conditions, and active medications with a cleaner summary view.</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Known Allergies" subtitle={`${allergies.length} recorded`}>
            {allergies.length > 0 ? (
              <div className="space-y-3">
                {allergies.map((item, index) => (
                  <div key={`allergy-${index}`} className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-700">
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No allergies recorded.</p>
            )}
          </Card>

          <Card title="Conditions" subtitle={`${conditions.length} recorded`}>
            {conditions.length > 0 ? (
              <div className="space-y-3">
                {conditions.map((item, index) => (
                  <div key={`condition-${index}`} className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-700">
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No conditions recorded.</p>
            )}
          </Card>

          <Card title="Medications" subtitle={`${medications.length} active`}>
            {medications.length > 0 ? (
              <div className="space-y-3">
                {medications.map((item, index) => (
                  <div key={`med-${index}`} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
                    {typeof item === 'string' ? item : `${item.name || 'Medication'}${item.dosage ? ` - ${item.dosage}` : ''}`}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No active medications recorded.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryView;
