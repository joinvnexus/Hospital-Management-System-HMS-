import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/domainApi';
import { validateEmail, validatePhone, validatePassword, validatePasswordStrength } from '../utils/validation';
import { ROUTES } from '../utils/routes';
import { useAuth } from '../context/AuthContext';

const DoctorRegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
  const [passwordStrength, setPasswordStrength] = useState({ score: 0 });
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
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'password') {
      setPasswordStrength(validatePasswordStrength(value));
    }
  };

  const validateFormData = () => {
    const nextErrors = {};
    if (!formData.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) nextErrors.lastName = 'Last name is required';
    if (!validateEmail(formData.email)) nextErrors.email = 'Please enter a valid email address';
    if (!validatePassword(formData.password)) nextErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    if (!validatePhone(formData.phone)) nextErrors.phone = 'Please enter a valid phone number';
    if (!formData.speciality) nextErrors.speciality = 'Speciality is required';
    if (!formData.license.trim()) nextErrors.license = 'License is required';
    if (formData.experience === '' || Number.parseInt(formData.experience, 10) < 0) nextErrors.experience = 'Valid experience is required';
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateFormData();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.registerDoctor({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        speciality: formData.speciality,
        license: formData.license,
        experience: Number.parseInt(formData.experience, 10),
      });

      login(response.data.doctor, response.data.token, 'doctor');
      setSuccessMessage('Registration successful! Redirecting to dashboard...');
      setTimeout(() => navigate(ROUTES.doctorDashboard), 1500);
    } catch (error) {
      setErrors({ form: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell px-4 py-12 sm:px-6 lg:px-8">
      <div className="panel mx-auto max-w-2xl p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Doctor Portal</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Create your doctor account</h2>
          <p className="mt-2 text-sm text-slate-500">Manage schedule, patients, appointments, and prescriptions in one workspace.</p>
        </div>

        {successMessage && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div>}
        {errors.form && <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{errors.form}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-slate-700">First Name *</label>
              <input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
              {errors.firstName && <p className="mt-1 text-xs text-rose-600">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-slate-700">Last Name *</label>
              <input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
              {errors.lastName && <p className="mt-1 text-xs text-rose-600">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">Phone *</label>
              <input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password *</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-16" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-sm text-slate-500">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 text-xs text-slate-500">
                  Strength: {passwordStrength.score <= 2 ? 'Weak' : passwordStrength.score <= 3 ? 'Fair' : 'Strong'}
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">Confirm Password *</label>
              <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
              {errors.confirmPassword && <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="speciality" className="mb-1 block text-sm font-medium text-slate-700">Speciality *</label>
              <select id="speciality" name="speciality" value={formData.speciality} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select Speciality</option>
                {specialities.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              {errors.speciality && <p className="mt-1 text-xs text-rose-600">{errors.speciality}</p>}
            </div>
            <div>
              <label htmlFor="experience" className="mb-1 block text-sm font-medium text-slate-700">Experience *</label>
              <input id="experience" name="experience" type="number" value={formData.experience} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
              {errors.experience && <p className="mt-1 text-xs text-rose-600">{errors.experience}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="license" className="mb-1 block text-sm font-medium text-slate-700">Medical License *</label>
            <input id="license" name="license" value={formData.license} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            {errors.license && <p className="mt-1 text-xs text-rose-600">{errors.license}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Doctor Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <button type="button" onClick={() => navigate(ROUTES.login)} className="font-medium text-emerald-700 hover:text-emerald-600">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;
