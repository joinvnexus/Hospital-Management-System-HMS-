import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoctor } from '../context/DoctorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import SuccessToast from '../components/SuccessToast';
import { getEntityId } from '../utils/auth';
import { ROUTES } from '../utils/routes';

const DoctorScheduleManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentDoctor, loading, error, fetchCurrentDoctor, updateDoctorSchedule } = useDoctor();
  const [schedule, setSchedule] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const defaultTimeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  useEffect(() => {
    const doctorId = getEntityId(user);
    if (doctorId) {
      fetchCurrentDoctor(doctorId);
    }
  }, [user, fetchCurrentDoctor]);

  useEffect(() => {
    if (currentDoctor?.schedule) {
      setSchedule(currentDoctor.schedule);
    }
  }, [currentDoctor]);

  const toggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        available: !prev?.[day]?.available,
        slots: prev?.[day]?.available ? [] : prev?.[day]?.slots?.length ? prev[day].slots : defaultTimeSlots,
      },
    }));
  };

  const toggleSlot = (day, slot) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev?.[day]?.slots?.includes(slot)
          ? prev[day].slots.filter((item) => item !== slot)
          : [...(prev?.[day]?.slots || []), slot],
      },
    }));
  };

  const saveSchedule = async () => {
    await updateDoctorSchedule(getEntityId(user), schedule);
    setShowSuccess(true);
  };

  if (loading) {
    return <div className="page-shell flex items-center justify-center"><LoadingSpinner size="lg" text="Loading schedule..." /></div>;
  }

  if (error) {
    return <div className="page-shell p-6"><div className="section-wrap"><ErrorMessage message={error} dismissible={false} /></div></div>;
  }

  return (
    <div className="page-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="section-wrap space-y-6">
        {showSuccess && <SuccessToast message="Schedule updated successfully!" duration={1500} onDismiss={() => setShowSuccess(false)} />}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Doctor Schedule</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Manage availability</h1>
          </div>
          <button onClick={() => navigate(ROUTES.doctorDashboard)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Back to Dashboard
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {daysOfWeek.map((day) => (
            <Card key={day} title={`${day.charAt(0).toUpperCase()}${day.slice(1)}`}>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={Boolean(schedule?.[day]?.available)} onChange={() => toggleDay(day)} />
                  Available
                </label>

                {schedule?.[day]?.available ? (
                  <div className="grid grid-cols-3 gap-2">
                    {defaultTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleSlot(day, slot)}
                        className={`rounded-2xl px-2 py-2 text-xs font-medium ${
                          schedule?.[day]?.slots?.includes(slot)
                            ? 'bg-slate-950 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">Unavailable on this day.</div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <button onClick={saveSchedule} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorScheduleManager;
