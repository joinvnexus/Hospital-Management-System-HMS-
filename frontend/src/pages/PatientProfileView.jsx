import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const PatientProfileView = () => {
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
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading profile..." /></div>;
  }

  if (error) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-5xl"><ErrorMessage message={error} onRetry={() => fetchCurrentPatient(getEntityId(user))} dismissible={false} /></div></div>;
  }

  if (!currentPatient) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-5xl"><ErrorMessage message="Patient profile not found." dismissible={false} /></div></div>;
  }

  const medicalHistory = currentPatient.medicalHistory || {};
  const stats = [
    { label: 'Allergies', value: medicalHistory.allergies?.length || 0 },
    { label: 'Conditions', value: medicalHistory.conditions?.length || 0 },
    { label: 'Medications', value: medicalHistory.medications?.length || 0 },
  ];

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap max-w-6xl space-y-6">
        <button onClick={() => navigate(ROUTES.patientDashboard)} className="text-sm font-semibold text-sky-700">
          Back to Dashboard
        </button>

        <section className="panel overflow-hidden bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Patient Profile</p>
          <h1 className="mt-3 text-4xl font-semibold">
            {currentPatient.firstName} {currentPatient.lastName}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Review your contact details, medical overview, and account information in one place.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card title="Profile Snapshot" subtitle="Account and quick actions">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-xl font-bold text-sky-700">
                  {(currentPatient.firstName?.[0] || 'P') + (currentPatient.lastName?.[0] || 'T')}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {currentPatient.firstName} {currentPatient.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{currentPatient.email}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                    <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button onClick={() => navigate(ROUTES.patientProfileEdit)} className="w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
                  Edit Profile
                </button>
                <button onClick={() => navigate(ROUTES.patientHistory)} className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                  Open Medical History
                </button>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Personal Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Age</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{currentPatient.age || 'Not set'}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Gender</p>
                  <p className="mt-2 text-lg font-semibold capitalize text-slate-900">{currentPatient.gender || 'Not set'}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Phone</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{currentPatient.phone || 'Not provided'}</p>
                </div>
              </div>
            </Card>

            <Card title="Medical Overview" subtitle="Current recorded information">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Allergies</p>
                  <p className="mt-2 text-sm text-slate-700">
                    {(medicalHistory.allergies || []).join(', ') || 'No allergies recorded'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Conditions</p>
                  <p className="mt-2 text-sm text-slate-700">
                    {(medicalHistory.conditions || []).join(', ') || 'No conditions recorded'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Medications</p>
                  <p className="mt-2 text-sm text-slate-700">
                    {(medicalHistory.medications || []).map((item) => (typeof item === 'string' ? item : item.name)).join(', ') || 'No medications recorded'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientProfileView;
