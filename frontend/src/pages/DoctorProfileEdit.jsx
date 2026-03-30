import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoctor } from '../context/DoctorContext';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import SuccessToast from '../components/SuccessToast';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const DoctorProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentDoctor, loading, error, fetchCurrentDoctor, updateDoctor } = useDoctor();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    speciality: '',
    medicalLicenseNumber: '',
    yearsOfExperience: '',
  });
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialityOptions = [
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'General Medicine',
    'Neurology',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Surgery',
  ];

  useEffect(() => {
    const doctorId = getEntityId(user);
    if (doctorId) {
      fetchCurrentDoctor(doctorId);
    }
  }, [user, fetchCurrentDoctor]);

  useEffect(() => {
    if (currentDoctor) {
      setFormData({
        firstName: currentDoctor.firstName || '',
        lastName: currentDoctor.lastName || '',
        email: currentDoctor.email || '',
        phone: currentDoctor.phone || '',
        speciality: currentDoctor.speciality || '',
        medicalLicenseNumber: currentDoctor.medicalLicenseNumber || currentDoctor.license || '',
        yearsOfExperience: currentDoctor.yearsOfExperience || currentDoctor.experience || '',
      });
    }
  }, [currentDoctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await updateDoctor(getEntityId(user), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        speciality: formData.speciality,
        license: formData.medicalLicenseNumber,
        medicalLicenseNumber: formData.medicalLicenseNumber,
        yearsOfExperience: Number(formData.yearsOfExperience),
        experience: Number(formData.yearsOfExperience),
      });
      setShowSuccess(true);
      setTimeout(() => navigate(ROUTES.doctorProfile), 1200);
    } catch (err) {
      setSubmitError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading profile..." /></div>;
  }

  if (error) {
    return <div className="page-shell p-6"><div className="section-wrap max-w-3xl"><ErrorMessage message={error} dismissible={false} /></div></div>;
  }

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap max-w-3xl space-y-6">
        {showSuccess && <SuccessToast message="Profile updated successfully!" duration={1200} onDismiss={() => setShowSuccess(false)} />}
        <button onClick={() => navigate(ROUTES.doctorProfile)} className="text-sm font-semibold text-emerald-700">
          Back to Profile
        </button>

        <Card title="Edit Doctor Profile" subtitle="Update your professional information">
          <form onSubmit={handleSubmit} className="space-y-5">
            {submitError && <ErrorMessage message={submitError} dismissible={true} onDismiss={() => setSubmitError('')} />}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />

            <div>
              <label htmlFor="speciality" className="mb-2 block text-sm font-medium text-slate-700">Speciality</label>
              <select id="speciality" name="speciality" value={formData.speciality} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select speciality</option>
                {specialityOptions.map((speciality) => (
                  <option key={speciality} value={speciality}>{speciality}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Medical License Number" name="medicalLicenseNumber" value={formData.medicalLicenseNumber} onChange={handleChange} required />
              <FormInput label="Years of Experience" name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleChange} required min="0" max="70" />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate(ROUTES.doctorProfile)} className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfileEdit;
