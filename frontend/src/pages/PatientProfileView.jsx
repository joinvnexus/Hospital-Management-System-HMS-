import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';

/**
 * PatientProfileView Component
 * Displays patient profile information in a detailed view
 * Shows basic info, medical history, and contact details
 */
const PatientProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPatient, loading, error, fetchCurrentPatient } = usePatient();

  // Fetch patient data on mount
  useEffect(() => {
    if (user?.id) {
      fetchCurrentPatient(user._id);
    }
  }, [user, fetchCurrentPatient]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
          <ErrorMessage
            message="Patient profile not found. Please try again."
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get patient initials for avatar
  const getInitials = () => {
    if (currentPatient.firstName && currentPatient.lastName) {
      return `${currentPatient.firstName[0]}${currentPatient.lastName[0]}`.toUpperCase();
    }
    return 'P';
  };

  const medicalHistory = currentPatient.medicalHistory || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-20">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {getInitials()}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {currentPatient.firstName} {currentPatient.lastName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Patient</p>
              </div>

              {/* Profile Status */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center text-green-600 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                  <span className="text-sm font-medium">Active</span>
                </div>
                <p className="text-xs text-gray-500">
                  Member since {formatDate(currentPatient.createdAt)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <button
                  onClick={() => navigate('/patient/profile/edit')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate('/patient/medical-history')}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 rounded-lg transition-colors"
                >
                  Medical History
                </button>
              </div>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Information Card */}
            <Card
              title="Personal Information"
              subtitle="Your basic contact details"
              className="bg-white"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    First Name
                  </label>
                  <p className="text-lg text-gray-900">{currentPatient.firstName}</p>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Last Name
                  </label>
                  <p className="text-lg text-gray-900">{currentPatient.lastName}</p>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Age
                  </label>
                  <p className="text-lg text-gray-900">{currentPatient.age} years</p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Gender
                  </label>
                  <p className="text-lg text-gray-900 capitalize">{currentPatient.gender || 'Not specified'}</p>
                </div>
              </div>
            </Card>

            {/* Contact Information Card */}
            <Card
              title="Contact Information"
              subtitle="How we can reach you"
              className="bg-white"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Email Address
                  </label>
                  <p className="text-lg text-gray-900 break-all">{currentPatient.email}</p>
                  <a
                    href={`mailto:${currentPatient.email}`}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block"
                  >
                    Send Email →
                  </a>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Phone Number
                  </label>
                  <p className="text-lg text-gray-900">{currentPatient.phone || 'Not provided'}</p>
                  {currentPatient.phone && (
                    <a
                      href={`tel:${currentPatient.phone}`}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block"
                    >
                      Call →
                    </a>
                  )}
                </div>
              </div>
            </Card>

            {/* Medical History Card */}
            <Card
              title="Medical Overview"
              subtitle="Your health history at a glance"
              className="bg-white"
            >
              {/* Allergies */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  Allergies
                </h4>
                {medicalHistory.allergies && medicalHistory.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {medicalHistory.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No known allergies recorded</p>
                )}
              </div>

              {/* Conditions */}
              <div className="mb-6 border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                  Medical Conditions
                </h4>
                {medicalHistory.conditions && medicalHistory.conditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {medicalHistory.conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No conditions recorded</p>
                )}
              </div>

              {/* Current Medications */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Current Medications
                </h4>
                {medicalHistory.medications && medicalHistory.medications.length > 0 ? (
                  <div className="space-y-2">
                    {medicalHistory.medications.map((med, index) => (
                      <div
                        key={index}
                        className="bg-green-50 border border-green-200 rounded-lg p-3"
                      >
                        <p className="font-medium text-green-900">{med}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No medications recorded</p>
                )}
              </div>
            </Card>

            {/* Account Details Card */}
            <Card
              title="Account Details"
              subtitle="Account information and settings"
              className="bg-white"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Account Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Member Since</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(currentPatient.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700">Last Updated</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(currentPatient.updatedAt)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/patient/profile/edit')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors text-center"
              >
                ✏️ Edit Profile
              </button>

              <button
                onClick={() => navigate('/patient/medical-history')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-lg transition-colors text-center"
              >
                📋 View Full History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileView;
