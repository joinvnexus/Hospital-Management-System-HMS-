import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoctor } from '../context/DoctorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const DoctorProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentDoctor, loading, error, fetchCurrentDoctor } = useDoctor();

  useEffect(() => {
    const doctorId = getEntityId(user);
    if (doctorId) {
      fetchCurrentDoctor(doctorId);
    }
  }, [user, fetchCurrentDoctor]);

  if (loading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading profile..." /></div>;
  }

  if (error) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-6xl"><ErrorMessage message={error} dismissible={false} /></div></div>;
  }

  if (!currentDoctor) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-6xl"><ErrorMessage message="Doctor profile not found." dismissible={false} /></div></div>;
  }

  const licenseNumber = currentDoctor.medicalLicenseNumber || currentDoctor.license || 'Not provided';
  const yearsOfExperience = currentDoctor.yearsOfExperience || currentDoctor.experience || 0;

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap max-w-6xl space-y-6">
        <button onClick={() => navigate(ROUTES.doctorDashboard)} className="text-sm font-semibold text-emerald-700">
          Back to Dashboard
        </button>

        <section className="panel overflow-hidden bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">Doctor Profile</p>
          <h1 className="mt-3 text-4xl font-semibold">
            Dr. {currentDoctor.firstName} {currentDoctor.lastName}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Review your credentials, contact information, and practice summary.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card title="Professional Snapshot">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700">
                  DR
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    Dr. {currentDoctor.firstName} {currentDoctor.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{currentDoctor.speciality || 'General Practice'}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">License</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{licenseNumber}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Experience</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{yearsOfExperience} years</p>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={() => navigate(ROUTES.doctorProfileEdit)} className="w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
                  Edit Profile
                </button>
                <button onClick={() => navigate(ROUTES.doctorSchedule)} className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                  Manage Schedule
                </button>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Professional Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Speciality</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{currentDoctor.speciality || 'General Practice'}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Status</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Active</p>
                </div>
              </div>
            </Card>

            <Card title="Contact Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Email</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{currentDoctor.email}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Phone</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{currentDoctor.phone || 'Not provided'}</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorProfileView;
