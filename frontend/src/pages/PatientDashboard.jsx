import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import SuccessToast from '../components/SuccessToast';

/**
 * PatientDashboard Component
 * Main dashboard for authenticated patients
 * Displays welcome banner, stats, appointments, and prescriptions
 */
const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentPatient,
    loading,
    error,
    clearError,
    fetchCurrentPatient,
    fetchPatientAppointments,
    fetchPatientPrescriptions,
  } = usePatient();

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch patient data on mount
  useEffect(() => {
    if (user?.id) {
      fetchCurrentPatient(user._id);
    }
  }, [user, fetchCurrentPatient]);

  // Fetch appointments and prescriptions after patient data is loaded
  useEffect(() => {
    if (currentPatient?._id) {
      setAppointmentsLoading(true);
      setAppointmentsError('');

      Promise.all([
        fetchPatientAppointments(currentPatient._id).catch((err) => {
          console.error('Failed to fetch appointments:', err);
          return [];
        }),
        fetchPatientPrescriptions(currentPatient._id).catch((err) => {
          console.error('Failed to fetch prescriptions:', err);
          return [];
        }),
      ])
        .then(([appts, presc]) => {
          setAppointments(appts || []);
          setPrescriptions(presc || []);
        })
        .catch((err) => {
          setAppointmentsError(err.message || 'Failed to load data');
        })
        .finally(() => {
          setAppointmentsLoading(false);
        });
    }
  }, [currentPatient, fetchPatientAppointments, fetchPatientPrescriptions]);

  // Loading state for initial patient data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  // Error state for patient data
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage
            message={error}
            onRetry={() => fetchCurrentPatient(user._id)}
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  // No patient data
  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage
            message="Patient data not found. Please try logging in again."
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalAppointments = appointments.length;
  const totalPrescriptions = prescriptions.length;
  const totalDoctors = 15; // Placeholder - would come from API
  const totalRecords = currentPatient?.medicalHistory
    ? Object.keys(currentPatient.medicalHistory).length
    : 0;

  // Get unique upcoming appointments (next 5)
  const upcomingAppointments = (appointments || [])
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Get recent prescriptions (last 5)
  const recentPrescriptions = (prescriptions || [])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleRetry = () => {
    setAppointmentsError('');
    if (currentPatient?._id) {
      setAppointmentsLoading(true);
      Promise.all([
        fetchPatientAppointments(currentPatient._id),
        fetchPatientPrescriptions(currentPatient._id),
      ])
        .then(([appts, presc]) => {
          setAppointments(appts || []);
          setPrescriptions(presc || []);
        })
        .catch((err) => {
          setAppointmentsError(err.message || 'Failed to load data');
        })
        .finally(() => {
          setAppointmentsLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Success Toast */}
        {showSuccess && (
          <SuccessToast
            message="Profile updated successfully!"
            duration={3000}
            onDismiss={() => setShowSuccess(false)}
          />
        )}

        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Welcome back, {currentPatient.firstName}! 👋
            </h1>
            <p className="text-blue-100">
              Here's your health dashboard - stay informed about your appointments and medications
            </p>
          </div>
        </div>

        {/* Error Alert for Appointments/Prescriptions */}
        {appointmentsError && (
          <div className="mb-6">
            <ErrorMessage
              message={appointmentsError}
              onRetry={handleRetry}
              dismissible={true}
            />
          </div>
        )}

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Upcoming Appointments Card */}
          <Card
            title="Upcoming Appointments"
            hoverable
            className="bg-white"
          >
            <div className="text-center">
              {appointmentsLoading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
                </div>
              ) : (
                <>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {totalAppointments}
                  </div>
                  <p className="text-sm text-gray-600">Scheduled</p>
                  <button
                    onClick={() => navigate('/appointments')}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                  >
                    View All →
                  </button>
                </>
              )}
            </div>
          </Card>

          {/* Active Prescriptions Card */}
          <Card
            title="Active Prescriptions"
            hoverable
            className="bg-white"
          >
            <div className="text-center">
              {appointmentsLoading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
                </div>
              ) : (
                <>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {totalPrescriptions}
                  </div>
                  <p className="text-sm text-gray-600">Medications</p>
                  <button
                    onClick={() => navigate('/prescriptions')}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm underline"
                  >
                    View All →
                  </button>
                </>
              )}
            </div>
          </Card>

          {/* Total Doctors Card */}
          <Card
            title="Available Doctors"
            hoverable
            className="bg-white"
          >
            <div className="text-center">
              {appointmentsLoading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
                </div>
              ) : (
                <>
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {totalDoctors}
                  </div>
                  <p className="text-sm text-gray-600">In Network</p>
                  <button
                    onClick={() => navigate('/doctors')}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm underline"
                  >
                    View All →
                  </button>
                </>
              )}
            </div>
          </Card>

          {/* Medical Records Card */}
          <Card
            title="Medical Records"
            hoverable
            className="bg-white"
          >
            <div className="text-center">
              {appointmentsLoading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
                </div>
              ) : (
                <>
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {totalRecords}
                  </div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <button
                    onClick={() => navigate('/patient/medical-history')}
                    className="mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm underline"
                  >
                    View All →
                  </button>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Appointments Section */}
          <Card
            title="Upcoming Appointments"
            subtitle={`${upcomingAppointments.length} scheduled`}
            className="bg-white"
            hoverable
          >
            {appointmentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded mb-2"></div>
                  </div>
                ))}
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt._id}
                    className="border-l-4 border-blue-600 pl-4 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                  >
                    <p className="font-semibold text-gray-900">
                      Dr. {apt.doctorName || 'Dr. Smith'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(apt.date).toLocaleDateString()} at{' '}
                      {new Date(apt.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{apt.type || 'Consultation'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No upcoming appointments</p>
                <button
                  onClick={() => navigate('/appointments/book')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Schedule an appointment
                </button>
              </div>
            )}
          </Card>

          {/* Recent Prescriptions Section */}
          <Card
            title="Active Medications"
            subtitle={`${recentPrescriptions.length} current`}
            className="bg-white"
            hoverable
          >
            {appointmentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded mb-2"></div>
                  </div>
                ))}
              </div>
            ) : recentPrescriptions.length > 0 ? (
              <div className="space-y-4">
                {recentPrescriptions.map((presc) => (
                  <div
                    key={presc._id}
                    className="border-l-4 border-green-600 pl-4 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                  >
                    <p className="font-semibold text-gray-900">
                      {presc.medicineName || 'Medicine'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {presc.dosage} {presc.dosageUnit || 'mg'} •{' '}
                      {presc.frequency || '2x daily'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      By Dr. {presc.doctorName || 'Doctor'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No active medications</p>
                <button
                  onClick={() => navigate('/prescriptions')}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium underline"
                >
                  View all prescriptions
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/patient/profile')}
            className="bg-white hover:shadow-lg transition-shadow p-4 rounded-lg text-left"
          >
            <p className="font-semibold text-gray-900">View Profile</p>
            <p className="text-sm text-gray-600">Personal information</p>
          </button>

          <button
            onClick={() => navigate('/patient/book-appointment')}
            className="bg-white hover:shadow-lg transition-shadow p-4 rounded-lg text-left"
          >
            <p className="font-semibold text-gray-900">Book Appointment</p>
            <p className="text-sm text-gray-600">Schedule with a doctor</p>
          </button>

          <button
            onClick={() => navigate('/patient/medical-history')}
            className="bg-white hover:shadow-lg transition-shadow p-4 rounded-lg text-left"
          >
            <p className="font-semibold text-gray-900">Medical History</p>
            <p className="text-sm text-gray-600">View your records</p>
          </button>

          <button
            onClick={() => navigate('/doctors')}
            className="bg-white hover:shadow-lg transition-shadow p-4 rounded-lg text-left"
          >
            <p className="font-semibold text-gray-900">Find Doctors</p>
            <p className="text-sm text-gray-600">Browse specialists</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
