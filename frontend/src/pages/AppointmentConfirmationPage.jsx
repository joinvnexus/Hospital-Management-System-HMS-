import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointment } from '../context/AppointmentContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const AppointmentConfirmationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchAppointmentById, cancelAppointment, loading, error } = useAppointment();
  const [appointment, setAppointment] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAppointmentById(id).then(setAppointment).catch(console.error);
    }
  }, [id, fetchAppointmentById]);

  const handleCancelAppointment = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancelling(true);
    try {
      await cancelAppointment(appointment._id, 'Cancelled by user');
      const updatedAppointment = await fetchAppointmentById(id);
      setAppointment(updatedAppointment);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading appointment details..." /></div>;
  }

  if (error) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-4xl"><ErrorMessage message={error} dismissible={false} /></div></div>;
  }

  if (!appointment) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-4xl"><ErrorMessage message="Appointment not found" dismissible={false} /></div></div>;
  }

  const userRole =
    appointment.patientId._id === getEntityId(user)
      ? 'patient'
      : appointment.doctorId._id === getEntityId(user)
      ? 'doctor'
      : null;

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap max-w-4xl space-y-6">
        <button
          onClick={() => navigate(userRole === 'patient' ? ROUTES.patientDashboard : ROUTES.doctorDashboard)}
          className="text-sm font-semibold text-sky-700"
        >
          Back to Dashboard
        </button>

        <Card title="Appointment Details" subtitle={`Status: ${appointment.status}`}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Date and Time</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Doctor</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Patient</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {appointment.patientId.firstName} {appointment.patientId.lastName}
              </p>
              <p className="text-sm text-slate-600">
                Age: {appointment.patientId.age} • {appointment.patientId.gender}
              </p>
            </div>
            {appointment.reason && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Reason</p>
                <p className="mt-1 text-sm text-slate-700">{appointment.reason}</p>
              </div>
            )}
          </div>
        </Card>

        {appointment.status === 'scheduled' && (
          <Card title="Actions">
            <div className="flex gap-3">
              <button onClick={() => navigate(ROUTES.appointments)} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Back to Appointments
              </button>
              <button onClick={handleCancelAppointment} disabled={cancelling} className="rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 disabled:opacity-50">
                {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentConfirmationPage;
