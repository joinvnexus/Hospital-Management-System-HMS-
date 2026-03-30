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

/**
 * AppointmentBookingForm Component
 * Allows patients to book appointments with doctors
 * Includes doctor selection, date/time selection, and reason input
 */
const AppointmentBookingForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { doctors, loading: doctorsLoading, fetchAllDoctors } = useDoctor();
  const { createAppointment, checkDoctorAvailability, loading: appointmentLoading } = useAppointment();

  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Time slots (matching doctor's schedule)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Fetch doctors on mount
  useEffect(() => {
    fetchAllDoctors();
  }, [fetchAllDoctors]);

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

    // Clear available slots when doctor or date changes
    if (name === 'doctorId' || name === 'date') {
      setAvailableSlots([]);
      setFormData((prev) => ({
        ...prev,
        time: '',
      }));
    }
  };

  // Handle doctor selection and fetch available slots
  const handleDoctorChange = async (e) => {
    const doctorId = e.target.value;
    handleChange(e);

    if (doctorId && formData.date) {
      await fetchAvailableSlots(doctorId, formData.date);
    }
  };

  // Handle date selection and fetch available slots
  const handleDateChange = async (e) => {
    const date = e.target.value;
    handleChange(e);

    if (formData.doctorId && date) {
      await fetchAvailableSlots(formData.doctorId, date);
    }
  };

  // Fetch available time slots for selected doctor and date
  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      const selectedDoctor = doctors.find(doc => doc._id === doctorId);
      if (!selectedDoctor?.schedule) return;

      // Get day of week from date
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.toLocaleLowerCase('en-US', { weekday: 'long' });

      // Check if doctor is available on this day
      const daySchedule = selectedDoctor.schedule[dayOfWeek];
      if (!daySchedule?.available || !daySchedule.slots) {
        setAvailableSlots([]);
        return;
      }

      // Filter out booked slots
      const availableSlotsForDay = [];
      for (const slot of daySchedule.slots) {
        const isAvailable = await checkDoctorAvailability(doctorId, date, slot);
        if (isAvailable) {
          availableSlotsForDay.push(slot);
        }
      }

      setAvailableSlots(availableSlotsForDay);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      setAvailableSlots([]);
    }
  };

  // Validation rules
  const validateForm = () => {
    const errors = {};

    if (!formData.doctorId) {
      errors.doctorId = 'Please select a doctor';
    }

    if (!formData.date) {
      errors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.date = 'Please select a future date';
      }
    }

    if (!formData.time) {
      errors.time = 'Please select a time slot';
    }

    if (!formData.reason.trim()) {
      errors.reason = 'Please provide a reason for the appointment';
    } else if (formData.reason.trim().length < 10) {
      errors.reason = 'Please provide a more detailed reason (at least 10 characters)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      const appointmentData = {
        patientId: user._id,
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
        reason: formData.reason.trim(),
      };

      await createAppointment(appointmentData);
      setShowSuccess(true);

      // Redirect after success
      setTimeout(() => {
        navigate('/patient/dashboard');
      }, 2000);
    } catch (err) {
      setSubmitError(err.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Toast */}
        {showSuccess && (
          <SuccessToast
            message="Appointment booked successfully!"
            duration={2000}
            onDismiss={() => setShowSuccess(false)}
          />
        )}

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

        {/* Form Card */}
        <Card
          title="Book Appointment"
          subtitle="Schedule an appointment with a doctor"
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

            {/* Doctor Selection */}
            <div>
              <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleDoctorChange}
                className={`
                  w-full px-3 py-2 border rounded-md
                  focus:outline-none focus:ring-2 focus:ring-offset-0
                  transition-colors duration-200
                  ${
                    formErrors.doctorId
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }
                `}
                required
              >
                <option value="">Select a doctor</option>
                {doctorsLoading ? (
                  <option disabled>Loading doctors...</option>
                ) : (
                  (Array.isArray(doctors) ? doctors : []).map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.speciality}
                    </option>
                  ))
                )}
              </select>
              {formErrors.doctorId && (
                <p className="mt-1 text-sm text-red-500">{formErrors.doctorId}</p>
              )}
            </div>

            {/* Date Selection */}
            <FormInput
              label="Appointment Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleDateChange}
              error={formErrors.date}
              min={getMinDate()}
              max={getMaxDate()}
              required
              helperText="Select a date within the next 30 days"
            />

            {/* Time Slot Selection */}
            {formData.doctorId && formData.date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                  <span className="text-red-500 ml-1">*</span>
                </label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          formData.time === slot
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">No available slots for this date</p>
                    <p className="text-gray-400 text-xs mt-1">Try selecting a different date</p>
                  </div>
                )}
                {formErrors.time && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.time}</p>
                )}
              </div>
            )}

            {/* Appointment Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Appointment
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className={`
                  w-full px-3 py-2 border rounded-md
                  focus:outline-none focus:ring-2 focus:ring-offset-0
                  transition-colors duration-200
                  ${
                    formErrors.reason
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }
                `}
                placeholder="Please describe your symptoms or reason for the appointment..."
                required
              />
              {formErrors.reason && (
                <p className="mt-1 text-sm text-red-500">{formErrors.reason}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Minimum 10 characters. Be as specific as possible to help your doctor prepare.
              </p>
            </div>

            {/* Form Actions */}
            <div className="border-t border-gray-200 pt-6 flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/patient/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !formData.doctorId || !formData.date || availableSlots.length === 0}
                className={`
                  flex-1 px-6 py-3 rounded-lg font-medium text-white
                  transition-colors
                  ${
                    isSubmitting || !formData.doctorId || !formData.date || availableSlots.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner size="sm" text="" />
                    Booking...
                  </span>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </div>
          </form>
        </Card>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Appointments can be cancelled or rescheduled up to 24 hours before the appointment time.
            Please arrive 15 minutes early for your appointment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingForm;