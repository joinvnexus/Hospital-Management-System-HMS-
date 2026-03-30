import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentPatient,
    loading,
    error,
    fetchCurrentPatient,
    fetchPatientAppointments,
    fetchPatientPrescriptions,
  } = usePatient();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const patientId = getEntityId(user);
    if (patientId) {
      fetchCurrentPatient(patientId);
    }
  }, [user, fetchCurrentPatient]);

  useEffect(() => {
    if (!currentPatient?._id) return;
    Promise.all([
      fetchPatientAppointments(currentPatient._id),
      fetchPatientPrescriptions(currentPatient._id),
    ]).then(([appointmentData, prescriptionData]) => {
      setAppointments(appointmentData || []);
      setPrescriptions(prescriptionData || []);
    });
  }, [currentPatient?._id, fetchPatientAppointments, fetchPatientPrescriptions]);

  if (loading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading your dashboard..." /></div>;
  }

  if (error) {
    return <div className="page-shell p-6"><div className="section-wrap"><ErrorMessage message={error} onRetry={() => fetchCurrentPatient(getEntityId(user))} dismissible={false} /></div></div>;
  }

  if (!currentPatient) {
    return <div className="page-shell p-6"><div className="section-wrap"><ErrorMessage message="Patient data not found. Please sign in again." dismissible={false} /></div></div>;
  }

  const upcomingAppointments = appointments
    .filter((appointment) => new Date(`${appointment.date}T${appointment.time || '00:00'}`) >= new Date())
    .sort((first, second) => new Date(first.date) - new Date(second.date))
    .slice(0, 3);

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap space-y-8">
        <section className="panel overflow-hidden bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Patient Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold">Welcome back, {currentPatient.firstName}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Track visits, prescriptions, and your health profile from one calm workspace.</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card title="Upcoming appointments" value={appointments.length} icon="Visits" />
          <Card title="Active prescriptions" value={prescriptions.length} icon="Meds" />
          <Card title="Medical history entries" value={Array.isArray(currentPatient.medicalHistory) ? currentPatient.medicalHistory.length : Object.keys(currentPatient.medicalHistory || {}).length} icon="Records" />
          <Card title="Quick access" subtitle="Book care or manage your profile" icon="Action" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Next appointments" subtitle={`${upcomingAppointments.length} scheduled`}>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">
                      Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">No upcoming appointments yet.</div>
            )}
          </Card>

          <Card title="Quick actions">
            <div className="space-y-3">
              <button onClick={() => navigate(ROUTES.bookAppointment)} className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white">Book appointment</button>
              <button onClick={() => navigate(ROUTES.appointments)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700">View appointments</button>
              <button onClick={() => navigate(ROUTES.prescriptions)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700">View prescriptions</button>
              <button onClick={() => navigate(ROUTES.patientProfile)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700">Open profile</button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default PatientDashboard;
