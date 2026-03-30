import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointment } from '../context/AppointmentContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const AppointmentListView = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const {
    appointments,
    loading,
    error,
    fetchPatientAppointments,
    fetchDoctorAppointments,
    cancelAppointment,
  } = useAppointment();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const entityId = getEntityId(user);
    if (!entityId) return;
    if (role === 'doctor') {
      fetchDoctorAppointments(entityId);
    } else {
      fetchPatientAppointments(entityId);
    }
  }, [user, role, fetchDoctorAppointments, fetchPatientAppointments]);

  const filteredAppointments = appointments.filter((appointment) =>
    statusFilter === 'all' ? true : appointment.status === statusFilter
  );

  if (loading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading appointments..." /></div>;
  }

  if (error) {
    return <div className="page-shell p-6"><div className="section-wrap"><ErrorMessage message={error} dismissible={false} /></div></div>;
  }

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              {role === 'doctor' ? 'Doctor Appointments' : 'Patient Appointments'}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Appointments</h1>
          </div>
          {role !== 'doctor' && (
            <button onClick={() => navigate(ROUTES.bookAppointment)} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              Book Appointment
            </button>
          )}
        </div>

        <Card title="Filter">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 sm:max-w-xs">
            <option value="all">All appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Card>

        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment._id} hoverable={true}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {role === 'doctor'
                        ? `${appointment.patientId?.firstName} ${appointment.patientId?.lastName}`
                        : `Dr. ${appointment.doctorId?.firstName} ${appointment.doctorId?.lastName}`}
                    </p>
                    {appointment.reason && <p className="mt-2 text-sm text-slate-500">{appointment.reason}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {appointment.status}
                    </span>
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => cancelAppointment(appointment._id, 'Cancelled by user')}
                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700"
                      >
                        Cancel
                      </button>
                    )}
                    <button onClick={() => navigate(`/appointments/${appointment._id}`)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                      View
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card title="No appointments found" subtitle="Adjust the filter or create a new visit to get started." />
        )}
      </div>
    </div>
  );
};

export default AppointmentListView;
