import React, { useCallback, useMemo } from 'react';
import apiClient from '../services/api';

export const DoctorContext = React.createContext();

export const DoctorProvider = ({ children }) => {
  const [currentDoctor, setCurrentDoctor] = React.useState(null);
  const [doctors, setDoctors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const unwrapResponseData = useCallback(
    (response) => response?.data?.data ?? response?.data ?? null,
    []
  );

  const fetchCurrentDoctor = useCallback(async (doctorId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/doctors/${doctorId}`);
      const doctor = unwrapResponseData(response);
      setCurrentDoctor(doctor);
      return doctor;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch doctor';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [unwrapResponseData]);

  const fetchDoctorById = useCallback(async (doctorId) => {
    try {
      const response = await apiClient.get(`/doctors/${doctorId}`);
      return unwrapResponseData(response);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, [unwrapResponseData]);

  const fetchAllDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/doctors');
      const doctorList = unwrapResponseData(response) ?? [];
      setDoctors(doctorList);
      return doctorList;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch doctors';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [unwrapResponseData]);

  const updateDoctor = useCallback(async (doctorId, data) => {
    setError(null);
    try {
      const response = await apiClient.put(`/doctors/${doctorId}`, data);
      const doctor = unwrapResponseData(response);
      setCurrentDoctor(doctor);
      return doctor;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update doctor';
      setError(errorMsg);
      throw err;
    }
  }, [unwrapResponseData]);

  const updateDoctorSchedule = useCallback(async (doctorId, schedule) => {
    setError(null);
    try {
      const response = await apiClient.put(`/doctors/${doctorId}`, { schedule });
      const doctor = unwrapResponseData(response);
      setCurrentDoctor(doctor);
      return doctor;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update schedule';
      setError(errorMsg);
      throw err;
    }
  }, [unwrapResponseData]);

  const fetchDoctorSchedule = useCallback(async (doctorId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/doctors/${doctorId}/schedule`);
      return unwrapResponseData(response);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch schedule';
      setError(errorMsg);
      throw err;
    }
  }, [unwrapResponseData]);

  const fetchDoctorAppointments = useCallback(async (doctorId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/appointments?doctorId=${doctorId}`);
      return unwrapResponseData(response) ?? [];
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch appointments';
      setError(errorMsg);
      return [];
    }
  }, [unwrapResponseData]);

  const fetchDoctorPatients = useCallback(async (doctorId) => {
    setError(null);
    try {
      const response = await apiClient.get(`/appointments?doctorId=${doctorId}`);
      const appointments = unwrapResponseData(response) ?? [];
      const uniquePatients = [];
      const seenPatientIds = new Set();

      appointments.forEach((appointment) => {
        const patient = appointment?.patientId;
        const patientId = patient?._id;

        if (!patientId || seenPatientIds.has(patientId)) {
          return;
        }

        seenPatientIds.add(patientId);
        uniquePatients.push(patient);
      });

      return uniquePatients;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch patients';
      setError(errorMsg);
      return [];
    }
  }, [unwrapResponseData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
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
  }), [
    clearError,
    currentDoctor,
    doctors,
    error,
    fetchAllDoctors,
    fetchCurrentDoctor,
    fetchDoctorAppointments,
    fetchDoctorById,
    fetchDoctorPatients,
    fetchDoctorSchedule,
    loading,
    updateDoctor,
    updateDoctorSchedule,
  ]);

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
