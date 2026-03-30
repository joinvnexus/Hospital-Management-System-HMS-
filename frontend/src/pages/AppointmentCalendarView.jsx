import React, { useEffect, useMemo, useState } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';
import { getEntityId } from '../utils/auth';

const AppointmentCalendarView = () => {
  const { user, role } = useAuth();
  const { fetchAppointments, loading, error } = useAppointment();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchAppointments().then(setAppointments).catch(console.error);
  }, [fetchAppointments]);

  const userId = getEntityId(user);

  const visibleAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.patientId?._id === userId || appointment.doctorId?._id === userId
      ),
    [appointments, userId]
  );

  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const items = [];

    for (let i = 0; i < firstDay.getDay(); i += 1) {
      items.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      items.push(new Date(year, month, day));
    }

    return items;
  }, [currentDate]);

  const selectedDayAppointments = useMemo(() => {
    if (!selectedDate) return [];
    const target = selectedDate.toISOString().split('T')[0];
    return visibleAppointments.filter((appointment) => appointment.date === target);
  }, [selectedDate, visibleAppointments]);

  const getAppointmentCount = (date) => {
    if (!date) return 0;
    const target = date.toISOString().split('T')[0];
    return visibleAppointments.filter((appointment) => appointment.date === target).length;
  };

  if (loading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading calendar..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell p-6">
        <div className="section-wrap max-w-6xl">
          <ErrorMessage message={error} dismissible={false} />
        </div>
      </div>
    );
  }

  const monthLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap max-w-6xl space-y-6">
        <section className="panel overflow-hidden bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Appointment Calendar</p>
          <h1 className="mt-3 text-4xl font-semibold">{monthLabel}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Review scheduled visits by day and inspect the selected day’s agenda quickly.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card title="Monthly View">
            <div className="mb-5 flex items-center justify-between">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDate(null);
                }}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Next
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                const count = getAppointmentCount(date);
                const isSelected = Boolean(
                  date && selectedDate && date.toDateString() === selectedDate.toDateString()
                );

                return (
                  <button
                    key={`${date?.toISOString?.() || 'empty'}-${index}`}
                    type="button"
                    disabled={!date}
                    onClick={() => date && setSelectedDate(date)}
                    className={`min-h-[84px] rounded-2xl border p-3 text-left transition ${
                      !date
                        ? 'cursor-default border-transparent bg-transparent'
                        : isSelected
                        ? 'border-sky-300 bg-sky-50'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    {date && (
                      <>
                        <div className="text-sm font-semibold text-slate-900">{date.getDate()}</div>
                        {count > 0 && (
                          <div className="mt-3 inline-flex rounded-full bg-slate-950 px-2 py-1 text-xs font-semibold text-white">
                            {count} visit{count > 1 ? 's' : ''}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card
            title={
              selectedDate
                ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Select a Date'
            }
            subtitle={selectedDate ? `${selectedDayAppointments.length} appointment(s)` : 'Choose a date from the calendar'}
          >
            {selectedDate && selectedDayAppointments.length > 0 ? (
              <div className="space-y-3">
                {selectedDayAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="font-semibold text-slate-900">{appointment.time}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {role === 'patient'
                        ? `Dr. ${appointment.doctorId?.firstName} ${appointment.doctorId?.lastName}`
                        : `${appointment.patientId?.firstName} ${appointment.patientId?.lastName}`}
                    </p>
                    {appointment.reason && (
                      <p className="mt-2 text-sm text-slate-500">{appointment.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                {selectedDate ? 'No appointments scheduled for this day.' : 'Click a date to inspect appointments.'}
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendarView;
