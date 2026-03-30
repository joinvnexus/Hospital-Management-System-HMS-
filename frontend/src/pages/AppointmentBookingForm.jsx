import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoctor } from '../context/DoctorContext';
import { useAppointment } from '../context/AppointmentContext';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import SuccessToast from '../components/SuccessToast';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const AppointmentBookingForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { doctors, loading: doctorsLoading, fetchAllDoctors } = useDoctor();
  const { createAppointment, checkDoctorAvailability } = useAppointment();
  const [formData, setFormData] = useState({ doctorId: '', date: '', time: '', reason: '' });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  useEffect(() => {
    fetchAllDoctors();
  }, [fetchAllDoctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      const selectedDoctor = doctors.find((doctor) => doctor._id === doctorId);
      if (!selectedDoctor?.schedule) {
        setAvailableSlots(timeSlots);
        return;
      }

      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const daySchedule = selectedDoctor.schedule[dayOfWeek];
      if (!daySchedule?.available || !Array.isArray(daySchedule.slots) || daySchedule.slots.length === 0) {
        setAvailableSlots([]);
        return;
      }

      const available = [];
      for (const slot of daySchedule.slots) {
        if (await checkDoctorAvailability(doctorId, date, slot)) {
          available.push(slot);
        }
      }
      setAvailableSlots(available);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      fetchAvailableSlots(formData.doctorId, formData.date);
    }
  }, [formData.doctorId, formData.date]);

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.doctorId) nextErrors.doctorId = 'Please select a doctor';
    if (!formData.date) nextErrors.date = 'Please select a date';
    if (!formData.time) nextErrors.time = 'Please select a time slot';
    if (!formData.reason.trim() || formData.reason.trim().length < 10) nextErrors.reason = 'Please provide a more detailed reason';
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await createAppointment({
        patientId: getEntityId(user),
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
        reason: formData.reason.trim(),
      });
      setShowSuccess(true);
      setTimeout(() => navigate(ROUTES.patientDashboard), 1500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap max-w-3xl">
        {showSuccess && <SuccessToast message="Appointment booked successfully!" duration={1500} onDismiss={() => setShowSuccess(false)} />}
        <Card title="Book appointment" subtitle="Choose doctor, date, time, and visit reason">
          <form onSubmit={handleSubmit} className="space-y-5">
            {submitError && <ErrorMessage message={submitError} dismissible={true} onDismiss={() => setSubmitError('')} />}

            <div>
              <label htmlFor="doctorId" className="mb-2 block text-sm font-medium text-slate-700">Select doctor *</label>
              <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select a doctor</option>
                {doctorsLoading ? (
                  <option disabled>Loading doctors...</option>
                ) : (
                  doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.speciality}
                    </option>
                  ))
                )}
              </select>
              {formErrors.doctorId && <p className="mt-1 text-sm text-rose-600">{formErrors.doctorId}</p>}
            </div>

            <FormInput
              label="Appointment Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={formErrors.date}
              min={today}
              required
            />

            {formData.doctorId && formData.date && (
              <div>
                <p className="mb-2 block text-sm font-medium text-slate-700">Available time slots *</p>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, time: slot }))}
                        className={`rounded-2xl px-3 py-3 text-sm font-medium ${
                          formData.time === slot ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No available slots for this date.
                  </div>
                )}
                {formErrors.time && <p className="mt-1 text-sm text-rose-600">{formErrors.time}</p>}
              </div>
            )}

            <FormInput
              label="Reason for Appointment"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              error={formErrors.reason}
              placeholder="Describe your symptoms or reason for the appointment"
              textarea={true}
              required
            />

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row">
              <button type="button" onClick={() => navigate(ROUTES.patientDashboard)} className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting || availableSlots.length === 0} className="flex-1 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentBookingForm;
