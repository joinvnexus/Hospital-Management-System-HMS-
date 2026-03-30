import React from 'react';
import apiClient from '../services/api';

export const PatientContext = React.createContext();

export const PatientProvider = ({ children }) => {
  const [currentPatient, setCurrentPatient] = React.useState(null);
  const [patients, setPatients] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchCurrentPatient = async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/patients/${patientId}`);
      setCurrentPatient(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch patient';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientById = async (patientId) => {
    try {
      const response = await apiClient.get(`/patients/${patientId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const fetchAllPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/patients');
      setPatients(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch patients';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (patientId, data) => {
    setError(null);
    try {
      const response = await apiClient.put(`/patients/${patientId}`, data);
      setCurrentPatient(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update patient';
      setError(errorMsg);
      throw err;
    }
  };

  const fetchMedicalHistory = async (patientId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/patients/${patientId}/history`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch medical history';
      setError(errorMsg);
      throw err;
    }
  };

  const fetchPatientAppointments = async (patientId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/appointments?patientId=${patientId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch appointments';
      setError(errorMsg);
      // Return empty array on error for graceful degradation
      return [];
    }
  };

  const fetchPatientPrescriptions = async (patientId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/prescriptions?patientId=${patientId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch prescriptions';
      setError(errorMsg);
      // Return empty array on error for graceful degradation
      return [];
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    currentPatient,
    patients,
    loading,
    error,
    fetchCurrentPatient,
    fetchPatientById,
    fetchAllPatients,
    updatePatient,
    fetchMedicalHistory,
    fetchPatientAppointments,
    fetchPatientPrescriptions,
    clearError,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = React.useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within PatientProvider');
  }
  return context;
};
