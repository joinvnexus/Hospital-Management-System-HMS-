import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { validateEmail, validatePhone, validatePassword, validatePasswordStrength } from '../utils/validation';

const DoctorRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    speciality: '',
    license: '',
    experience: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  const [showPassword, setShowPassword] = useState(false);

  const specialities = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Neurology',
    'Ophthalmology',
    'Pediatrics',
    'Psychiatry',
    'Surgery',
    'Oncology',
    'Gastroenterology',
    'Pulmonology',
    'Nephrology',
    'Endocrinology',
  ];

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Check password strength
    if (name === 'password') {
      setPasswordStrength(validatePasswordStrength(value));
    }
  };

  // Validate form
  const validateFormData = () => {
    const newErrors = {};

    // First name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Speciality
    if (!formData.speciality) {
      newErrors.speciality = 'Speciality is required';
    }

    // License
    if (!formData.license.trim()) {
      newErrors.license = 'Medical license number is required';
    } else if (formData.license.length < 5) {
      newErrors.license = 'License number must be at least 5 characters';
    }

    // Experience
    if (formData.experience === '') {
      newErrors.experience = 'Years of experience is required';
    } else {
      const exp = parseInt(formData.experience);
      if (exp < 0 || exp > 70) {
        newErrors.experience = 'Please enter a valid years of experience';
      }
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    // Validate form
    const newErrors = validateFormData();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register/doctor', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        speciality: formData.speciality,
        license: formData.license,
        experience: parseInt(formData.experience),
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.doctor));
        localStorage.setItem('role', 'doctor');

        setSuccessMessage('Registration successful! Redirecting to dashboard...');

        setTimeout(() => {
          navigate('/doctor/dashboard');
        }, 2000);
      }
    } catch (error) {
      // Better error handling with debugging
      let errorMessage = 'Registration failed. Please try again.';
      
      if (!error.response) {
        // Network error
        errorMessage = 'Network error. Please check if backend server is running on http://localhost:5000';
        console.error('Network Error:', error.message);
      } else if (error.response?.status === 400) {
        // Validation error
        errorMessage = error.response.data?.message || 'Invalid input. Please check all fields.';
      } else if (error.response?.status === 500) {
        // Server error
        errorMessage = 'Server error. ' + (error.response.data?.message || 'Please try again later.');
        console.error('Server Error:', error.response.data);
      } else {
        // Other errors
        errorMessage = error.response?.data?.message || errorMessage;
      }
      
      setErrors({ form: errorMessage });
      console.error('Registration Error:', { status: error.response?.status, data: error.response?.data });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Register as Doctor</h2>
          <p className="text-center text-gray-600 text-sm">Complete your medical profile on HMS</p>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {errors.form && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{errors.form}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Dr. Jane"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Smith"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="jane@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        passwordStrength.score <= 2
                          ? 'bg-red-500 w-1/3'
                          : passwordStrength.score <= 3
                          ? 'bg-yellow-500 w-2/3'
                          : 'bg-green-500 w-full'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {passwordStrength.score <= 2 ? 'Weak' : passwordStrength.score <= 3 ? 'Fair' : 'Strong'}
                  </span>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {passwordStrength.feedback.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <span>•</span> {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="1234567890"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Speciality */}
          <div>
            <label htmlFor="speciality" className="block text-sm font-medium text-gray-700 mb-1">
              Speciality *
            </label>
            <select
              id="speciality"
              name="speciality"
              value={formData.speciality}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.speciality ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Speciality</option>
              {specialities.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            {errors.speciality && <p className="text-red-600 text-xs mt-1">{errors.speciality}</p>}
          </div>

          {/* License & Experience Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                Medical License *
              </label>
              <input
                id="license"
                name="license"
                type="text"
                value={formData.license}
                onChange={handleInputChange}
                placeholder="LICENSE123"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.license ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.license && <p className="text-red-600 text-xs mt-1">{errors.license}</p>}
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years) *
              </label>
              <input
                id="experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="5"
                min="0"
                max="70"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.experience ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.experience && <p className="text-red-600 text-xs mt-1">{errors.experience}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Creating Account...' : 'Create Doctor Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign In
            </a>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-700">
            <strong>Note:</strong> Your account will be created as a doctor. You can manage your availability, view patient appointments, and create prescriptions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;
