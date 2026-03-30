import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoctor } from '../context/DoctorContext';
import { usePrescription } from '../context/PrescriptionContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentDoctor,
    loading,
    error,
    fetchCurrentDoctor,
    fetchDoctorAppointments,
    fetchDoctorPatients,
  } = useDoctor();
  const { fetchPrescriptions } = usePrescription();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const doctorId = getEntityId(user);
    if (doctorId) {
      fetchCurrentDoctor(doctorId);
    }
  }, [user, fetchCurrentDoctor]);

  useEffect(() => {
    if (!currentDoctor?._id) return;
    Promise.all([
      fetchDoctorAppointments(currentDoctor._id),
      fetchDoctorPatients(currentDoctor._id),
      fetchPrescriptions({ doctorId: currentDoctor._id }),
    ]).then(([appointmentData, patientData, prescriptionData]) => {
      setAppointments(appointmentData || []);
      setPatients(patientData || []);
      setPrescriptions(prescriptionData || []);
    });
  }, [currentDoctor?._id, fetchDoctorAppointments, fetchDoctorPatients, fetchPrescriptions]);

  if (loading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading your dashboard..." /></div>;
  }

  if (error) {
    return <div className="page-shell p-6"><div className="section-wrap"><ErrorMessage message={error} onRetry={() => fetchCurrentDoctor(getEntityId(user))} dismissible={false} /></div></div>;
  }

  if (!currentDoctor) {
    return <div className="page-shell p-6"><div className="section-wrap"><ErrorMessage message="Doctor data not found. Please sign in again." dismissible={false} /></div></div>;
  }

  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(
    (appointment) => new Date(appointment.date).toDateString() === today
  );

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap space-y-8">
        <section className="panel overflow-hidden bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">Doctor Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold">
            Welcome back, Dr. {currentDoctor.firstName} {currentDoctor.lastName}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Track today’s workload, manage schedule changes, and keep patient follow-ups moving.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card title="Today’s appointments" value={todaysAppointments.length} icon="Today" />
          <Card title="Unique patients" value={patients.length} icon="Patients" />
          <Card title="Active prescriptions" value={prescriptions.length} icon="Meds" />
          <Card title="Speciality" subtitle={currentDoctor.speciality || 'General Practice'} icon="Profile" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card title="Schedule snapshot" subtitle={`${todaysAppointments.length} visits today`}>
            {todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.slice(0, 4).map((appointment) => (
                  <div key={appointment._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">
                      {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{appointment.time} appointment</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">No appointments scheduled for today.</div>
            )}
          </Card>

          <Card title="Quick actions">
            <div className="space-y-3">
              <button onClick={() => navigate(ROUTES.doctorSchedule)} className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white">Manage schedule</button>
              <button onClick={() => navigate(ROUTES.appointments)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700">Review appointments</button>
              <button onClick={() => navigate(ROUTES.createPrescription)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700">Create prescription</button>
              <button onClick={() => navigate(ROUTES.doctorProfile)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700">Open profile</button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
