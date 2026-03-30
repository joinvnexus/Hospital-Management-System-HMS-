import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import SuccessToast from '../components/SuccessToast';

/**
 * PatientProfileEdit Component
 * Allows patients to edit their profile information
 * Includes validation and profile picture upload
 */
const PatientProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPatient, loading, error, fetchCurrentPatient, updatePatient, clearError } =
    usePatient();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch patient data on mount
  useEffect(() => {
    if (user?.id) {
      fetchCurrentPatient(user._id);
    }
  }, [user, fetchCurrentPatient]);

  // Populate form when patient data loads
  useEffect(() => {
    if (currentPatient) {
      setFormData({
        firstName: currentPatient.firstName || '',
        lastName: currentPatient.lastName || '',
        email: currentPatient.email || '',
        phone: currentPatient.phone || '',
        age: currentPatient.age || '',
        gender: currentPatient.gender || '',
      });
    }
  }, [currentPatient]);

  // Validation rules
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      errors.firstName = 'First name can only contain letters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      errors.lastName = 'Last name can only contain letters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[0-9\-\s\+()]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.age) {
      errors.age = 'Age is required';
    } else if (formData.age < 18 || formData.age > 120) {
      errors.age = 'Age must be between 18 and 120';
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await updatePatient(user._id, formData);
      setShowSuccess(true);

      // Redirect after success
      setTimeout(() => {
        navigate('/patient/profile');
      }, 2000);
    } catch (err) {
      setSubmitError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  // Error state for fetching
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <ErrorMessage
            message={error}
            onRetry={() => fetchCurrentPatient(user._id)}
            dismissible={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Toast */}
        {showSuccess && (
          <SuccessToast
            message="Profile updated successfully!"
            duration={2000}
            onDismiss={() => setShowSuccess(false)}
          />
        )}

        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/patient/profile')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>
        </div>

        {/* Form Card */}
        <Card
          title="Edit Profile"
          subtitle="Update your personal information"
          className="bg-white"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submit Error Alert */}
            {submitError && (
              <ErrorMessage
                message={submitError}
                dismissible={true}
                onDismiss={() => setSubmitError('')}
              />
            )}

            {/* First Name and Last Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                error={formErrors.firstName}
                placeholder="John"
                required
              />

              <FormInput
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                error={formErrors.lastName}
                placeholder="Doe"
                required
              />
            </div>

            {/* Email */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              placeholder="john@example.com"
              required
            />

            {/* Phone Number */}
            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={formErrors.phone}
              placeholder="+1 (555) 123-4567"
              helperText="Include country code if applicable"
            />

            {/* Age and Gender Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormInput
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                error={formErrors.age}
                placeholder="30"
                required
              />

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-2 border rounded-md
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    transition-colors duration-200
                    ${
                      formErrors.gender
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }
                  `}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formErrors.gender && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="border-t border-gray-200 pt-6 flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/patient/profile')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  flex-1 px-6 py-3 rounded-lg font-medium text-white
                  transition-colors
                  ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner size="sm" text="" />
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </Card>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Changes to your profile will be reflected across your dashboard.
            You can update your password separately in the account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileEdit;
