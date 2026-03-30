import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoctor } from '../context/DoctorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';

/**
 * DoctorProfileView Component
 * Displays doctor profile information in a detailed view
 * Shows basic info, professional details, and contact information
 */
const DoctorProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentDoctor, loading, error, fetchCurrentDoctor } = useDoctor();

  // Fetch doctor data on mount
  useEffect(() => {
    if (user?.id) {
      fetchCurrentDoctor(user._id);
    }
  }, [user, fetchCurrentDoctor]);

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
        <div className="max-w-4xl mx-auto">
          <ErrorMessage
            message="Doctor profile not found. Please try again."
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

  // Get doctor initials for avatar
  const getInitials = () => {
    if (currentDoctor.firstName && currentDoctor.lastName) {
      return `Dr. ${currentDoctor.firstName[0]}${currentDoctor.lastName[0]}`.toUpperCase();
    }
    return 'DR';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/doctor/dashboard')}
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
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {getInitials()}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Dr. {currentDoctor.firstName} {currentDoctor.lastName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{currentDoctor.speciality}</p>
              </div>

              {/* Profile Status */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center text-green-600 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                  <span className="text-sm font-medium">Active</span>
                </div>
                <p className="text-xs text-gray-500">
                  Member since {formatDate(currentDoctor.createdAt)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <button
                  onClick={() => navigate('/doctor/profile/edit')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate('/doctor/schedule')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Manage Schedule
                </button>
              </div>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Professional Information Card */}
            <Card
              title="Professional Information"
              subtitle="Your medical credentials and specialization"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speciality
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {currentDoctor.speciality}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical License Number
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg font-mono">
                    {currentDoctor.medicalLicenseNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {currentDoctor.yearsOfExperience} years
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Status
                  </label>
                  <span className="inline-flex px-3 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </Card>

            {/* Personal Information Card */}
            <Card
              title="Personal Information"
              subtitle="Your basic contact details"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {currentDoctor.firstName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {currentDoctor.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    <a
                      href={`mailto:${currentDoctor.email}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {currentDoctor.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    <a
                      href={`tel:${currentDoctor.phone}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {currentDoctor.phone}
                    </a>
                  </p>
                </div>
              </div>
            </Card>

            {/* Account Information Card */}
            <Card
              title="Account Information"
              subtitle="Your account details and status"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <span className="inline-flex px-3 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {formatDate(currentDoctor.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {formatDate(currentDoctor.updatedAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Completion
                  </label>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full w-full"></div>
                    </div>
                    <span className="text-sm text-gray-600">100%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Practice Statistics Card */}
            <Card
              title="Practice Overview"
              subtitle="Summary of your medical practice"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">--</div>
                  <div className="text-sm text-gray-600">Total Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">--</div>
                  <div className="text-sm text-gray-600">Appointments This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">--</div>
                  <div className="text-sm text-gray-600">Years in Practice</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileView;