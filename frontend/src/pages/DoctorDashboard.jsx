import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoctor } from '../context/DoctorContext';
import { usePrescription } from '../context/PrescriptionContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import SuccessToast from '../components/SuccessToast';

/**
 * DoctorDashboard Component
 * Main dashboard for authenticated doctors
 * Displays welcome banner, stats, appointments, and schedule
 */
const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentDoctor,
    loading,
    error,
    clearError,
    fetchCurrentDoctor,
    fetchDoctorAppointments,
    fetchDoctorPatients,
  } = useDoctor();

  const { fetchPrescriptions, getActivePrescriptions } = usePrescription();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch doctor data on mount
  useEffect(() => {
    if (user?.id) {
      fetchCurrentDoctor(user._id);
    }
  }, [user, fetchCurrentDoctor]);

  // Fetch appointments and patients after doctor data is loaded
  useEffect(() => {
    if (currentDoctor?._id) {
      setAppointmentsLoading(true);
      setAppointmentsError('');

      Promise.all([
        fetchDoctorAppointments(currentDoctor._id).catch((err) => {
          console.error('Failed to fetch appointments:', err);
          return [];
        }),
        fetchDoctorPatients(currentDoctor._id).catch((err) => {
          console.error('Failed to fetch patients:', err);
          return [];
        }),
        fetchPrescriptions({ doctorId: currentDoctor._id }).catch((err) => {
          console.error('Failed to fetch prescriptions:', err);
          return [];
        }),
      ])
        .then(([appts, pats, presc]) => {
          setAppointments(appts || []);
          setPatients(pats || []);
          setPrescriptions(presc || []);
        })
        .catch((err) => {
          setAppointmentsError(err.message || 'Failed to load data');
        })
        .finally(() => {
          setAppointmentsLoading(false);
        });
    }
  }, [currentDoctor, fetchDoctorAppointments, fetchDoctorPatients]);

  // Loading state for initial doctor data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  // Error state for doctor data
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage
            message={error}
            onRetry={() => fetchCurrentDoctor(user._id)}
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  // No doctor data
  if (!currentDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage
            message="Doctor data not found. Please try logging in again."
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  // Calculate stats
  const todayAppointments = appointments.filter(appt => {
    const today = new Date().toDateString();
    return new Date(appt.date).toDateString() === today;
  });

  const upcomingAppointments = appointments.filter(appt => {
    return new Date(appt.date) > new Date();
  });

  const prescriptionsCount = prescriptions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, Dr. {currentDoctor.firstName} {currentDoctor.lastName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's an overview of your practice today
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Speciality</p>
                <p className="font-medium text-gray-900">{currentDoctor.speciality}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">License</p>
                <p className="font-medium text-gray-900">{currentDoctor.medicalLicenseNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            title="Today's Appointments"
            value={todayAppointments.length}
            icon="📅"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/doctor/schedule')}
          />
          <Card
            title="Total Patients"
            value={patients.length}
            icon="👥"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/doctor/patients')}
          />
          <Card
            title="Upcoming Appointments"
            value={upcomingAppointments.length}
            icon="⏰"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/appointments')}
          />
          <Card
            title="Active Prescriptions"
            value={prescriptionsCount}
            icon="💊"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/prescriptions')}
          />
          <Card
            title="Years of Experience"
            value={currentDoctor.yearsOfExperience}
            icon="🏥"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/doctor/profile')}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
              <button
                onClick={() => navigate('/doctor/schedule')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>

            {appointmentsLoading ? (
              <LoadingSpinner size="sm" text="Loading appointments..." />
            ) : appointmentsError ? (
              <ErrorMessage message={appointmentsError} />
            ) : todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.patientName || 'Patient'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status || 'scheduled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No appointments scheduled for today</p>
              </div>
            )}
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Patients</h2>
              <button
                onClick={() => navigate('/doctor/patients')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>

            {patients.length > 0 ? (
              <div className="space-y-3">
                {patients.slice(0, 3).map((patient) => (
                  <div key={patient._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Age: {patient.age} • {patient.gender}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No patients yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/doctor/profile')}
              className="flex items-center justify-center px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
            >
              👤 View Profile
            </button>
            <button
              onClick={() => navigate('/prescriptions/create')}
              className="flex items-center justify-center px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
            >
              💊 Create Prescription
            </button>
            <button
              onClick={() => navigate('/doctor/schedule')}
              className="flex items-center justify-center px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
            >
              📅 Manage Schedule
            </button>
            <button
              onClick={() => navigate('/appointments')}
              className="flex items-center justify-center px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
            >
              📋 View Appointments
            </button>
            <button
              onClick={() => navigate('/doctor/patients')}
              className="flex items-center justify-center px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
            >
              👥 Patient Records
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <SuccessToast
          message="Dashboard updated successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;