import React, { useCallback, useMemo } from 'react';
import { appointmentApi, patientApi, prescriptionApi } from '../services/domainApi';

export const PatientContext = React.createContext();

export const PatientProvider = ({ children }) => {
  const [currentPatient, setCurrentPatient] = React.useState(null);
  const [patients, setPatients] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchCurrentPatient = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const patient = await patientApi.getById(patientId);
      setCurrentPatient(patient);
      return patient;
    } catch (err) {
      setError(err.message || 'Failed to fetch patient');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPatientById = useCallback(async (patientId) => {
    try {
      return await patientApi.getById(patientId);
    } catch (err) {
      setError(err.message || 'Failed to fetch patient');
      throw err;
    }
  }, []);

  const fetchAllPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const patientList = await patientApi.getAll();
      setPatients(patientList);
      return patientList;
    } catch (err) {
      setError(err.message || 'Failed to fetch patients');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePatient = useCallback(async (patientId, data) => {
    setError(null);
    try {
      const patient = await patientApi.update(patientId, data);
      setCurrentPatient(patient);
      return patient;
    } catch (err) {
      setError(err.message || 'Failed to update patient');
      throw err;
    }
  }, []);

  const fetchMedicalHistory = useCallback(async (patientId) => {
    setError(null);
    try {
      return await patientApi.getHistory(patientId);
    } catch (err) {
      setError(err.message || 'Failed to fetch medical history');
      throw err;
    }
  }, []);

  const fetchPatientAppointments = useCallback(async (patientId) => {
    setError(null);
    try {
      return await appointmentApi.getAll({ patientId });
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
      return [];
    }
  }, []);

  const fetchPatientPrescriptions = useCallback(async (patientId) => {
    setError(null);
    try {
      return await prescriptionApi.getAll({ patientId });
    } catch (err) {
      setError(err.message || 'Failed to fetch prescriptions');
      return [];
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      currentPatient,
      patients,
      loading,
      error,
      fetchCurrentPatient,
      fetchPatientById,
      fetchAllPatients,
      fetchPatients: fetchAllPatients,
      updatePatient,
      fetchMedicalHistory,
      fetchPatientAppointments,
      fetchPatientPrescriptions,
      clearError,
    }),
    [
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
    ]
  );

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
};

export const usePatient = () => {
  const context = React.useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within PatientProvider');
  }
  return context;
};
