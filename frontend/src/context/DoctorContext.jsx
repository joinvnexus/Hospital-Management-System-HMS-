import React from 'react';
import apiClient from '../services/api';

export const DoctorContext = React.createContext();

export const DoctorProvider = ({ children }) => {
  const [currentDoctor, setCurrentDoctor] = React.useState(null);
  const [doctors, setDoctors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchCurrentDoctor = async (doctorId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/doctors/${doctorId}`);
      setCurrentDoctor(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch doctor';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorById = async (doctorId) => {
    try {
      const response = await apiClient.get(`/doctors/${doctorId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const fetchAllDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/doctors');
      setDoctors(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch doctors';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDoctor = async (doctorId, data) => {
    setError(null);
    try {
      const response = await apiClient.put(`/doctors/${doctorId}`, data);
      setCurrentDoctor(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update doctor';
      setError(errorMsg);
      throw err;
    }
  };

  const updateDoctorSchedule = async (doctorId, schedule) => {
    setError(null);
    try {
      const response = await apiClient.put(`/doctors/${doctorId}`, { schedule });
      setCurrentDoctor(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update schedule';
      setError(errorMsg);
      throw err;
    }
  };

  const fetchDoctorSchedule = async (doctorId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/doctors/${doctorId}/schedule`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch schedule';
      setError(errorMsg);
      throw err;
    }
  };

  const fetchDoctorAppointments = async (doctorId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/appointments?doctorId=${doctorId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch appointments';
      setError(errorMsg);
      return [];
    }
  };

  const fetchDoctorPatients = async (doctorId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/doctors/${doctorId}/patients`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch patients';
      setError(errorMsg);
      return [];
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    currentDoctor,
    doctors,
    loading,
    error,
    fetchCurrentDoctor,
    fetchDoctorById,
    fetchAllDoctors,
    updateDoctor,
    updateDoctorSchedule,
    fetchDoctorSchedule,
    fetchDoctorAppointments,
    fetchDoctorPatients,
    clearError,
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = React.useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within DoctorProvider');
  }
  return context;
};
