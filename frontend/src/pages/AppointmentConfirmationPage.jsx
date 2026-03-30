import React, { useEffect, useMemo, useState } from 'react';
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

  const userRole = useMemo(() => {
    if (!appointment) return null;
    const userId = getEntityId(user);
    if (appointment.patientId?._id === userId) return 'patient';
    if (appointment.doctorId?._id === userId) return 'doctor';
    return null;
  }, [appointment, user]);

  const canCancelAppointment = useMemo(() => {
    if (!appointment || appointment.status !== 'scheduled') return false;
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time || '00:00'}`);
    return (appointmentDateTime - new Date()) / (1000 * 60 * 60) > 24;
  }, [appointment]);

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
    return (
      <div className="page-shell flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading appointment details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell p-6">
        <div className="section-wrap max-w-4xl">
          <ErrorMessage message={error} dismissible={false} />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="page-shell p-6">
        <div className="section-wrap max-w-4xl">
          <ErrorMessage message="Appointment not found" dismissible={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap max-w-4xl space-y-6">
        <button
          onClick={() =>
            navigate(userRole === 'patient' ? ROUTES.patientDashboard : ROUTES.doctorDashboard)
          }
          className="text-sm font-semibold text-sky-700"
        >
          Back to Dashboard
        </button>

        <section className="panel overflow-hidden bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Appointment Summary</p>
          <h1 className="mt-3 text-4xl font-semibold">
            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Review the visit details, participant information, and next actions from one place.
          </p>
        </section>

        <Card title="Visit Details" subtitle={`Status: ${appointment.status}`}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Doctor</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
              </p>
              <p className="text-sm text-slate-600">{appointment.doctorId?.speciality || 'General Practice'}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Patient</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {appointment.patientId?.firstName} {appointment.patientId?.lastName}
              </p>
              <p className="text-sm text-slate-600">
                Age: {appointment.patientId?.age || 'N/A'} • {appointment.patientId?.gender || 'N/A'}
              </p>
            </div>
            {appointment.reason && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Reason for Visit</p>
                <p className="mt-2 text-sm text-slate-700">{appointment.reason}</p>
              </div>
            )}
            {appointment.cancelledReason && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.14em] text-rose-600">Cancellation Reason</p>
                <p className="mt-2 text-sm text-rose-700">{appointment.cancelledReason}</p>
              </div>
            )}
          </div>
        </Card>

        {appointment.status === 'scheduled' && (
          <Card title="Actions">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate(ROUTES.appointments)}
                className="flex-1 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Back to Appointments
              </button>
              {canCancelAppointment && (
                <button
                  onClick={handleCancelAppointment}
                  disabled={cancelling}
                  className="flex-1 rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentConfirmationPage;
