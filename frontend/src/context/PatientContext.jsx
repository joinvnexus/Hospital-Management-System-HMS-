import React, { useCallback, useMemo } from 'react';
import apiClient from '../services/api';

export const PatientContext = React.createContext();

export const PatientProvider = ({ children }) => {
  const [currentPatient, setCurrentPatient] = React.useState(null);
  const [patients, setPatients] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const unwrapResponseData = useCallback(
    (response) => response?.data?.data ?? response?.data ?? null,
    []
  );

  const fetchCurrentPatient = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/patients/${patientId}`);
      const patient = unwrapResponseData(response);
      setCurrentPatient(patient);
      return patient;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch patient';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [unwrapResponseData]);

  const fetchPatientById = useCallback(async (patientId) => {
    try {
      const response = await apiClient.get(`/patients/${patientId}`);
      return unwrapResponseData(response);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, [unwrapResponseData]);

  const fetchAllPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/patients');
      const patientList = unwrapResponseData(response) ?? [];
      setPatients(patientList);
      return patientList;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch patients';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [unwrapResponseData]);

  const updatePatient = useCallback(async (patientId, data) => {
    setError(null);
    try {
      const response = await apiClient.put(`/patients/${patientId}`, data);
      const patient = unwrapResponseData(response);
      setCurrentPatient(patient);
      return patient;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update patient';
      setError(errorMsg);
      throw err;
    }
  }, [unwrapResponseData]);

  const fetchMedicalHistory = useCallback(async (patientId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/patients/${patientId}/history`);
      return unwrapResponseData(response);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch medical history';
      setError(errorMsg);
      throw err;
    }
  }, [unwrapResponseData]);

  const fetchPatientAppointments = useCallback(async (patientId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/appointments?patientId=${patientId}`);
      return unwrapResponseData(response) ?? [];
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch appointments';
      setError(errorMsg);
      // Return empty array on error for graceful degradation
      return [];
    }
  }, [unwrapResponseData]);

  const fetchPatientPrescriptions = useCallback(async (patientId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/prescriptions?patientId=${patientId}`);
      return unwrapResponseData(response) ?? [];
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch prescriptions';
      setError(errorMsg);
      // Return empty array on error for graceful degradation
      return [];
    }
  }, [unwrapResponseData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
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
  }), [
    clearError,
    currentPatient,
    error,
    fetchAllPatients,
    fetchCurrentPatient,
    fetchMedicalHistory,
    fetchPatientAppointments,
    fetchPatientById,
    fetchPatientPrescriptions,
    loading,
    patients,
    updatePatient,
  ]);

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
