import React from 'react';
import { appointmentApi } from '../services/domainApi';

export const AppointmentContext = React.createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchAppointments = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentApi.getAll(filters);
      setAppointments(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentById = async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      return await appointmentApi.getById(appointmentId);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const appointment = await appointmentApi.create(appointmentData);
      await fetchAppointments();
      return appointment;
    } catch (err) {
      setError(err.message || 'Failed to create appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (appointmentId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const appointment = await appointmentApi.update(appointmentId, updateData);
      await fetchAppointments();
      return appointment;
    } catch (err) {
      setError(err.message || 'Failed to update appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const appointment = await appointmentApi.cancel(appointmentId, reason);
      await fetchAppointments();
      return appointment;
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      await appointmentApi.delete(appointmentId);
      await fetchAppointments();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientAppointments = async (patientId) => fetchAppointments({ patientId });

  const fetchDoctorAppointments = async (doctorId) => fetchAppointments({ doctorId });

  const checkDoctorAvailability = async (doctorId, date, time) => {
    try {
      const doctorAppointments = await fetchDoctorAppointments(doctorId);
      const conflictingAppointment = doctorAppointments.find(
        (appointment) =>
          appointment.date === date &&
          appointment.time === time &&
          appointment.status !== 'cancelled'
      );

      return !conflictingAppointment;
    } catch (err) {
      console.error('Failed to check availability:', err);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        fetchAppointments,
        fetchAppointmentById,
        createAppointment,
        updateAppointment,
        cancelAppointment,
        deleteAppointment,
        fetchPatientAppointments,
        fetchDoctorAppointments,
        checkDoctorAvailability,
        clearError,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = React.useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within AppointmentProvider');
  }
  return context;
};
