import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoctor } from '../context/DoctorContext';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import SuccessToast from '../components/SuccessToast';

/**
 * DoctorProfileEdit Component
 * Allows doctors to edit their profile information
 * Includes validation for professional credentials
 */
const DoctorProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentDoctor, loading, error, fetchCurrentDoctor, updateDoctor, clearError } =
    useDoctor();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    speciality: '',
    medicalLicenseNumber: '',
    yearsOfExperience: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Speciality options
  const specialityOptions = [
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Endocrinology',
    'Gastroenterology',
    'General Medicine',
    'Neurology',
    'Obstetrics & Gynecology',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Urology',
  ];

  // Fetch doctor data on mount
  useEffect(() => {
    if (user?.id) {
      fetchCurrentDoctor(user._id);
    }
  }, [user, fetchCurrentDoctor]);

  // Populate form when doctor data loads
  useEffect(() => {
    if (currentDoctor) {
      setFormData({
        firstName: currentDoctor.firstName || '',
        lastName: currentDoctor.lastName || '',
        email: currentDoctor.email || '',
        phone: currentDoctor.phone || '',
        speciality: currentDoctor.speciality || '',
        medicalLicenseNumber: currentDoctor.medicalLicenseNumber || '',
        yearsOfExperience: currentDoctor.yearsOfExperience || '',
      });
    }
  }, [currentDoctor]);

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

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9\-\s\+()]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.speciality) {
      errors.speciality = 'Speciality is required';
    }

    if (!formData.medicalLicenseNumber.trim()) {
      errors.medicalLicenseNumber = 'Medical license number is required';
    } else if (formData.medicalLicenseNumber.trim().length < 5) {
      errors.medicalLicenseNumber = 'License number must be at least 5 characters';
    }

    if (!formData.yearsOfExperience) {
      errors.yearsOfExperience = 'Years of experience is required';
    } else if (formData.yearsOfExperience < 0 || formData.yearsOfExperience > 70) {
      errors.yearsOfExperience = 'Please enter a valid number of years (0-70)';
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
      await updateDoctor(user._id, formData);
      setShowSuccess(true);

      // Redirect after success
      setTimeout(() => {
        navigate('/doctor/profile');
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
            onRetry={() => fetchCurrentDoctor(user._id)}
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
            onClick={() => navigate('/doctor/profile')}
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>
        </div>

        {/* Form Card */}
        <Card
          title="Edit Doctor Profile"
          subtitle="Update your professional information"
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
                placeholder="Jane"
                required
              />

              <FormInput
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                error={formErrors.lastName}
                placeholder="Smith"
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
              placeholder="jane.smith@example.com"
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
              required
            />

            {/* Speciality */}
            <div>
              <label htmlFor="speciality" className="block text-sm font-medium text-gray-700 mb-2">
                Medical Speciality
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="speciality"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                className={`
                  w-full px-3 py-2 border rounded-md
                  focus:outline-none focus:ring-2 focus:ring-offset-0
                  transition-colors duration-200
                  ${
                    formErrors.speciality
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-green-500'
                  }
                `}
                required
              >
                <option value="">Select speciality</option>
                {specialityOptions.map((speciality) => (
                  <option key={speciality} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>
              {formErrors.speciality && (
                <p className="mt-1 text-sm text-red-500">{formErrors.speciality}</p>
              )}
            </div>

            {/* Medical License Number */}
            <FormInput
              label="Medical License Number"
              name="medicalLicenseNumber"
              type="text"
              value={formData.medicalLicenseNumber}
              onChange={handleChange}
              error={formErrors.medicalLicenseNumber}
              placeholder="LIC123456789"
              required
              helperText="Enter your official medical license number"
            />

            {/* Years of Experience */}
            <FormInput
              label="Years of Experience"
              name="yearsOfExperience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              error={formErrors.yearsOfExperience}
              placeholder="5"
              min="0"
              max="70"
              required
            />

            {/* Form Actions */}
            <div className="border-t border-gray-200 pt-6 flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/doctor/profile')}
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
                      : 'bg-green-600 hover:bg-green-700'
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
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900">
            <strong>Note:</strong> Professional credentials are verified. Changes to your licence number
            may require re-verification. Contact support if you need to update your speciality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileEdit;