import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoctor } from '../context/DoctorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import SuccessToast from '../components/SuccessToast';

/**
 * DoctorScheduleManager Component
 * Allows doctors to manage their availability and schedule
 * Shows current schedule and allows editing availability slots
 */
const DoctorScheduleManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentDoctor, loading, error, fetchCurrentDoctor, updateDoctorSchedule } = useDoctor();

  const [schedule, setSchedule] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Days of the week
  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  // Default time slots
  const defaultTimeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Fetch doctor data on mount
  useEffect(() => {
    if (user?.id) {
      fetchCurrentDoctor(user._id);
    }
  }, [user, fetchCurrentDoctor]);

  // Initialize schedule when doctor data loads
  useEffect(() => {
    if (currentDoctor?.schedule) {
      setSchedule(currentDoctor.schedule);
    } else {
      // Initialize with default empty schedule
      const defaultSchedule = {};
      daysOfWeek.forEach(day => {
        defaultSchedule[day] = {
          available: false,
          slots: []
        };
      });
      setSchedule(defaultSchedule);
    }
  }, [currentDoctor]);

  // Handle day availability toggle
  const handleDayToggle = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day]?.available,
        slots: prev[day]?.available ? [] : [...defaultTimeSlots]
      }
    }));
  };

  // Handle time slot toggle
  const handleSlotToggle = (day, slot) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day]?.slots?.includes(slot)
          ? prev[day].slots.filter(s => s !== slot)
          : [...(prev[day]?.slots || []), slot]
      }
    }));
  };

  // Handle save schedule
  const handleSaveSchedule = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await updateDoctorSchedule(user._id, schedule);
      setShowSuccess(true);
      setIsEditing(false);

      // Refresh doctor data
      setTimeout(() => {
        fetchCurrentDoctor(user._id);
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      setSubmitError(err.message || 'Failed to update schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    if (currentDoctor?.schedule) {
      setSchedule(currentDoctor.schedule);
    }
    setIsEditing(false);
    setSubmitError('');
  };

  // Format day name for display
  const formatDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading schedule..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
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
      <div className="max-w-6xl mx-auto">
        {/* Success Toast */}
        {showSuccess && (
          <SuccessToast
            message="Schedule updated successfully!"
            duration={2000}
            onDismiss={() => setShowSuccess(false)}
          />
        )}

        {/* Header with Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Edit Schedule
            </button>
          )}
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your availability and appointment slots
          </p>
        </div>

        {/* Submit Error Alert */}
        {submitError && (
          <div className="mb-6">
            <ErrorMessage
              message={submitError}
              dismissible={true}
              onDismiss={() => setSubmitError('')}
            />
          </div>
        )}

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {daysOfWeek.map((day) => (
            <Card
              key={day}
              title={formatDayName(day)}
              className={`transition-all duration-200 ${
                schedule[day]?.available
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Day Availability Toggle */}
              <div className="mb-4">
                {isEditing ? (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schedule[day]?.available || false}
                      onChange={() => handleDayToggle(day)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Available
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      schedule[day]?.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule[day]?.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                )}
              </div>

              {/* Time Slots */}
              {schedule[day]?.available && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Available Slots:</h4>
                  <div className="grid grid-cols-3 gap-1">
                    {defaultTimeSlots.map((slot) => {
                      const isSelected = schedule[day]?.slots?.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={!isEditing}
                          onClick={() => handleSlotToggle(day, slot)}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            isSelected
                              ? 'bg-green-600 text-white'
                              : isEditing
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {schedule[day]?.slots?.length || 0} slots selected
                  </div>
                </div>
              )}

              {/* No availability message */}
              {!schedule[day]?.available && (
                <div className="text-sm text-gray-500 italic">
                  Not available on {formatDayName(day).toLowerCase()}s
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Save Changes</h3>
                <p className="text-sm text-gray-600">
                  Review your schedule changes before saving
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveSchedule}
                  disabled={isSubmitting}
                  className={`
                    px-6 py-3 rounded-lg font-medium text-white
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
                    'Save Schedule'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {daysOfWeek.filter(day => schedule[day]?.available).length}
              </div>
              <div className="text-sm text-gray-600">Available Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {daysOfWeek.reduce((total, day) =>
                  total + (schedule[day]?.slots?.length || 0), 0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Slots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(daysOfWeek.reduce((total, day) =>
                  total + (schedule[day]?.slots?.length || 0), 0
                ) / daysOfWeek.filter(day => schedule[day]?.available).length || 0)}
              </div>
              <div className="text-sm text-gray-600">Avg Slots/Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {daysOfWeek.filter(day => !schedule[day]?.available).length}
              </div>
              <div className="text-sm text-gray-600">Off Days</div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Your schedule determines when patients can book appointments with you.
            Changes take effect immediately. Patients will only see available time slots.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorScheduleManager;