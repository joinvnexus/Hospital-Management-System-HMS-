import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointment } from '../context/AppointmentContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';

/**
 * AppointmentListView Component
 * Displays a list of appointments for patients or doctors
 * Includes filtering, sorting, and action buttons
 */
const AppointmentListView = ({ userRole = 'patient' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    appointments,
    loading,
    error,
    fetchPatientAppointments,
    fetchDoctorAppointments,
    cancelAppointment,
  } = useAppointment();

  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch appointments on mount
  useEffect(() => {
    if (user?.id) {
      if (userRole === 'patient') {
        fetchPatientAppointments(user._id);
      } else if (userRole === 'doctor') {
        fetchDoctorAppointments(user._id);
      }
    }
  }, [user, userRole, fetchPatientAppointments, fetchDoctorAppointments]);

  // Filter and sort appointments
  useEffect(() => {
    let filtered = [...appointments];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Sort appointments
    filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortBy === 'date') {
        aValue = new Date(`${a.date} ${a.time}`);
        bValue = new Date(`${b.date} ${b.time}`);
      } else if (sortBy === 'status') {
        aValue = a.status;
        bValue = b.status;
      } else if (sortBy === 'doctor' && userRole === 'patient') {
        aValue = a.doctorId?.firstName + ' ' + a.doctorId?.lastName;
        bValue = b.doctorId?.firstName + ' ' + b.doctorId?.lastName;
      } else if (sortBy === 'patient' && userRole === 'doctor') {
        aValue = a.patientId?.firstName + ' ' + a.patientId?.lastName;
        bValue = b.patientId?.firstName + ' ' + b.patientId?.lastName;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredAppointments(filtered);
  }, [appointments, statusFilter, sortBy, sortOrder, userRole]);

  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancellingId(appointmentId);
    try {
      await cancelAppointment(appointmentId, 'Cancelled by user');
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    } finally {
      setCancellingId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if appointment can be cancelled
  const canCancelAppointment = (appointment) => {
    if (appointment.status !== 'scheduled') return false;

    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Can cancel if more than 24 hours away
    return hoursDiff > 24;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading appointments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage
            message={error}
            onRetry={() => {
              if (userRole === 'patient') {
                fetchPatientAppointments(user._id);
              } else {
                fetchDoctorAppointments(user._id);
              }
            }}
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userRole === 'patient' ? 'My Appointments' : 'Patient Appointments'}
            </h1>
            <p className="text-gray-600 mt-2">
              {userRole === 'patient'
                ? 'View and manage your scheduled appointments'
                : 'View and manage patient appointments'
              }
            </p>
          </div>

          {userRole === 'patient' && (
            <button
              onClick={() => navigate('/appointments/book')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Book New Appointment
            </button>
          )}
        </div>

        {/* Filters and Sorting */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Appointments</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1">
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date & Time</option>
                <option value="status">Status</option>
                {userRole === 'patient' && <option value="doctor">Doctor</option>}
                {userRole === 'doctor' && <option value="patient">Patient</option>}
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex-1">
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment._id} className="bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatDate(appointment.date)} at {formatTime(appointment.time)}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      {userRole === 'patient' ? (
                        <>
                          <div>
                            <span className="font-medium">Doctor:</span>{' '}
                            Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                            {appointment.doctorId?.speciality && (
                              <span className="text-gray-500"> ({appointment.doctorId.speciality})</span>
                            )}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span>{' '}
                            {appointment.reason ? 'Consultation' : 'General Checkup'}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="font-medium">Patient:</span>{' '}
                            {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                          </div>
                          <div>
                            <span className="font-medium">Contact:</span>{' '}
                            {appointment.patientId?.email}
                          </div>
                        </>
                      )}
                    </div>

                    {appointment.reason && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {appointment.reason}
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    {appointment.status === 'scheduled' && canCancelAppointment(appointment) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        disabled={cancellingId === appointment._id}
                        className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {cancellingId === appointment._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}

                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => navigate(`/appointments/${appointment._id}/reschedule`)}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Reschedule
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/appointments/${appointment._id}`)}
                      className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">
              {statusFilter === 'all'
                ? `You don't have any appointments yet.`
                : `No appointments with status "${statusFilter}".`
              }
            </p>
            {userRole === 'patient' && (
              <button
                onClick={() => navigate('/appointments/book')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Book Your First Appointment
              </button>
            )}
          </div>
        )}

        {/* Summary Stats */}
        {appointments.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {appointments.filter(apt => apt.status === 'scheduled').length}
                </div>
                <div className="text-sm text-gray-600">Scheduled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {appointments.filter(apt => apt.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {appointments.filter(apt => apt.status === 'cancelled').length}
                </div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {appointments.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentListView;