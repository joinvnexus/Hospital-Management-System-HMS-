import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointment } from '../context/AppointmentContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';

/**
 * AppointmentConfirmationPage Component
 * Displays detailed information about a specific appointment
 * Shows appointment details, status, and available actions
 */
const AppointmentConfirmationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchAppointmentById, cancelAppointment, loading, error } = useAppointment();

  const [appointment, setAppointment] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Fetch appointment details on mount
  useEffect(() => {
    if (id) {
      fetchAppointmentById(id)
        .then(setAppointment)
        .catch(console.error);
    }
  }, [id, fetchAppointmentById]);

  // Handle cancel appointment
  const handleCancelAppointment = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
      return;
    }

    setCancelling(true);
    try {
      await cancelAppointment(appointment._id, 'Cancelled by user');
      // Refresh appointment data
      const updatedAppointment = await fetchAppointmentById(id);
      setAppointment(updatedAppointment);
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    } finally {
      setCancelling(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      rescheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Check if appointment can be cancelled
  const canCancelAppointment = () => {
    if (!appointment || appointment.status !== 'scheduled') return false;

    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Can cancel if more than 24 hours away
    return hoursDiff > 24;
  };

  // Get user role for this appointment
  const getUserRole = () => {
    if (appointment.patientId._id === user._id) return 'patient';
    if (appointment.doctorId._id === user._id) return 'doctor';
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading appointment details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage
            message={error}
            onRetry={() => fetchAppointmentById(id).then(setAppointment)}
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage
            message="Appointment not found"
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  const userRole = getUserRole();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(userRole === 'patient' ? '/patient/dashboard' : '/doctor/dashboard')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Success Banner for New Appointments */}
        {appointment.status === 'scheduled' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-green-900">
                  Appointment {appointment.status === 'scheduled' ? 'Confirmed' : 'Details'}
                </h3>
                <p className="text-green-700 mt-1">
                  Your appointment has been successfully {appointment.status === 'scheduled' ? 'scheduled' : 'processed'}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Details Card */}
        <Card className="bg-white mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadge(appointment.status)}`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
          </div>

          {/* Appointment Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Date & Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
              <div className="text-lg font-semibold text-gray-900">
                {formatDate(appointment.date)}
              </div>
              <div className="text-gray-600">
                {formatTime(appointment.time)}
              </div>
            </div>

            {/* Appointment ID */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Appointment ID</h3>
              <div className="text-lg font-semibold text-gray-900 font-mono">
                {appointment._id.slice(-8).toUpperCase()}
              </div>
            </div>

            {/* Doctor Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Doctor</h3>
              <div className="text-lg font-semibold text-gray-900">
                Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
              </div>
              <div className="text-gray-600">
                {appointment.doctorId.speciality}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                License: {appointment.doctorId.medicalLicenseNumber}
              </div>
            </div>

            {/* Patient Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Patient</h3>
              <div className="text-lg font-semibold text-gray-900">
                {appointment.patientId.firstName} {appointment.patientId.lastName}
              </div>
              <div className="text-gray-600">
                Age: {appointment.patientId.age} • {appointment.patientId.gender}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {appointment.patientId.email}
              </div>
            </div>
          </div>

          {/* Appointment Reason */}
          {appointment.reason && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reason for Visit</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{appointment.reason}</p>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {appointment.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{appointment.notes}</p>
              </div>
            </div>
          )}

          {/* Cancellation Info */}
          {appointment.status === 'cancelled' && appointment.cancelledReason && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cancellation Reason</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{appointment.cancelledReason}</p>
                {appointment.cancelledAt && (
                  <p className="text-sm text-red-600 mt-2">
                    Cancelled on {new Date(appointment.cancelledAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        {appointment.status === 'scheduled' && userRole && (
          <Card className="bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {canCancelAppointment() && (
                <button
                  onClick={handleCancelAppointment}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              )}

              <button
                onClick={() => navigate(`/appointments/${appointment._id}/reschedule`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Reschedule
              </button>

              {userRole === 'doctor' && (
                <button
                  onClick={() => navigate(`/appointments/${appointment._id}/notes`)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Add Notes
                </button>
              )}
            </div>

            {canCancelAppointment() && (
              <p className="text-sm text-gray-600 mt-4">
                <strong>Note:</strong> Appointments can be cancelled up to 24 hours before the scheduled time.
              </p>
            )}
          </Card>
        )}

        {/* Important Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-900 font-medium mb-2">Important Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Please arrive 15 minutes before your appointment time</li>
            <li>• Bring any relevant medical records or test results</li>
            <li>• If you need to reschedule, please do so at least 24 hours in advance</li>
            <li>• For emergencies, please call emergency services directly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmationPage;