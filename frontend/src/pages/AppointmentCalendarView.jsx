import React, { useState, useEffect } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';

/**
 * AppointmentCalendarView Component
 * Displays appointments in a calendar format
 * Shows monthly view with appointment indicators
 */
const AppointmentCalendarView = () => {
  const { user } = useAuth();
  const { fetchAppointments, loading, error } = useAppointment();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayAppointments, setDayAppointments] = useState([]);

  // Fetch appointments for current month
  useEffect(() => {
    const fetchMonthAppointments = async () => {
      try {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const params = {
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0],
          status: 'scheduled'
        };

        const data = await fetchAppointments(params);
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    fetchMonthAppointments();
  }, [currentDate, fetchAppointments]);

  // Get appointments for selected date
  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const dayAppts = appointments.filter(appt =>
        appt.date === dateStr &&
        (appt.patientId._id === user._id || appt.doctorId._id === user._id)
      );
      setDayAppointments(dayAppts);
    } else {
      setDayAppointments([]);
    }
  }, [selectedDate, appointments, user._id]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Check if a date has appointments
  const hasAppointments = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return appointments.some(appt =>
      appt.date === dateStr &&
      (appt.patientId._id === user._id || appt.doctorId._id === user._id)
    );
  };

  // Get appointment count for a date
  const getAppointmentCount = (date) => {
    if (!date) return 0;
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(appt =>
      appt.date === dateStr &&
      (appt.patientId._id === user._id || appt.doctorId._id === user._id)
    ).length;
  };

  // Check if date is today
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading calendar..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage message={error} dismissible={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Calendar</h1>
          <p className="text-gray-600">View your appointments in a calendar format</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToToday}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  const appointmentCount = getAppointmentCount(date);
                  const hasAppts = hasAppointments(date);
                  const today = isToday(date);
                  const selected = isSelected(date);

                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[80px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                        ${date ? 'bg-white' : 'bg-gray-50'}
                        ${today ? 'bg-blue-50 border-blue-300' : ''}
                        ${selected ? 'bg-blue-100 border-blue-400' : ''}
                      `}
                      onClick={() => date && setSelectedDate(date)}
                    >
                      {date && (
                        <>
                          <div className={`
                            text-sm font-medium mb-1
                            ${today ? 'text-blue-600' : 'text-gray-900'}
                            ${selected ? 'text-blue-700' : ''}
                          `}>
                            {date.getDate()}
                          </div>
                          {hasAppts && (
                            <div className="flex items-center justify-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              {appointmentCount > 1 && (
                                <span className="text-xs text-blue-600 ml-1">
                                  {appointmentCount}
                                </span>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Selected Date Details */}
          <div className="lg:col-span-1">
            <Card className="bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Select a date'
                }
              </h3>

              {selectedDate && dayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {dayAppointments.map(appointment => (
                    <div key={appointment._id} className="border border-gray-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {formatTime(appointment.time)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {user.role === 'patient'
                          ? `Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`
                          : `${appointment.patientId.firstName} ${appointment.patientId.lastName}`
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {appointment.doctorId.speciality}
                      </div>
                      {appointment.reason && (
                        <div className="text-xs text-gray-600 mt-1 truncate">
                          {appointment.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <p className="text-gray-500 text-sm">No appointments on this date</p>
              ) : (
                <p className="text-gray-500 text-sm">Click on a date to view appointments</p>
              )}
            </Card>

            {/* Legend */}
            <Card className="bg-white mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Has appointments</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-50 border border-blue-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendarView;