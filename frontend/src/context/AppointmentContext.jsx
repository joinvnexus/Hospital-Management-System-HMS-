import React from 'react';
import apiClient from '../services/api';

export const AppointmentContext = React.createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchAppointments = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/appointments?${queryParams}`);
      setAppointments(response.data.data || []);
      return response.data.data || [];
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch appointments';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentById = async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/appointments/${appointmentId}`);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch appointment';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/appointments', appointmentData);
      // Refresh appointments list
      await fetchAppointments();
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create appointment';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (appointmentId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put(`/appointments/${appointmentId}`, updateData);
      // Refresh appointments list
      await fetchAppointments();
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update appointment';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.patch(`/appointments/${appointmentId}/cancel`, { reason });
      // Refresh appointments list
      await fetchAppointments();
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to cancel appointment';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/appointments/${appointmentId}`);
      // Refresh appointments list
      await fetchAppointments();
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete appointment';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientAppointments = async (patientId) => {
    return fetchAppointments({ patientId });
  };

  const fetchDoctorAppointments = async (doctorId) => {
    return fetchAppointments({ doctorId });
  };

  const checkDoctorAvailability = async (doctorId, date, time) => {
    try {
      // This would typically be a separate endpoint, but for now we'll check existing appointments
      const doctorAppointments = await fetchDoctorAppointments(doctorId);
      const conflictingAppointment = doctorAppointments.find(apt =>
        apt.date === date && apt.time === time && apt.status !== 'cancelled'
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

  const value = {
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
  };

  return (
    <AppointmentContext.Provider value={value}>
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