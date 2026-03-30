import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import SuccessToast from '../components/SuccessToast';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const PatientProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPatient, loading, error, fetchCurrentPatient, updatePatient } = usePatient();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
  });
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const patientId = getEntityId(user);
    if (patientId) {
      fetchCurrentPatient(patientId);
    }
  }, [user, fetchCurrentPatient]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await updatePatient(getEntityId(user), {
        ...formData,
        age: Number(formData.age),
      });
      setShowSuccess(true);
      setTimeout(() => navigate(ROUTES.patientProfile), 1200);
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
        <button onClick={() => navigate(ROUTES.patientProfile)} className="text-sm font-semibold text-sky-700">
          Back to Profile
        </button>

        <Card title="Edit Patient Profile" subtitle="Update your personal details">
          <form onSubmit={handleSubmit} className="space-y-5">
            {submitError && <ErrorMessage message={submitError} dismissible={true} onDismiss={() => setSubmitError('')} />}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required min="0" max="120" />
              <div>
                <label htmlFor="gender" className="mb-2 block text-sm font-medium text-slate-700">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate(ROUTES.patientProfile)} className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
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

export default PatientProfileEdit;
