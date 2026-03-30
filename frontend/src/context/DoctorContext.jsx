import React, { useCallback, useMemo } from 'react';
import { appointmentApi, doctorApi } from '../services/domainApi';

export const DoctorContext = React.createContext();

export const DoctorProvider = ({ children }) => {
  const [currentDoctor, setCurrentDoctor] = React.useState(null);
  const [doctors, setDoctors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchCurrentDoctor = useCallback(async (doctorId) => {
    setLoading(true);
    setError(null);
    try {
      const doctor = await doctorApi.getById(doctorId);
      setCurrentDoctor(doctor);
      return doctor;
    } catch (err) {
      setError(err.message || 'Failed to fetch doctor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDoctorById = useCallback(async (doctorId) => {
    try {
      return await doctorApi.getById(doctorId);
    } catch (err) {
      setError(err.message || 'Failed to fetch doctor');
      throw err;
    }
  }, []);

  const fetchAllDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const doctorList = await doctorApi.getAll();
      setDoctors(doctorList);
      return doctorList;
    } catch (err) {
      setError(err.message || 'Failed to fetch doctors');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDoctor = useCallback(async (doctorId, data) => {
    setError(null);
    try {
      const doctor = await doctorApi.update(doctorId, data);
      setCurrentDoctor(doctor);
      return doctor;
    } catch (err) {
      setError(err.message || 'Failed to update doctor');
      throw err;
    }
  }, []);

  const updateDoctorSchedule = useCallback(async (doctorId, schedule) => {
    setError(null);
    try {
      const doctor = await doctorApi.update(doctorId, { schedule });
      setCurrentDoctor(doctor);
      return doctor;
    } catch (err) {
      setError(err.message || 'Failed to update schedule');
      throw err;
    }
  }, []);

  const fetchDoctorSchedule = useCallback(async (doctorId) => {
    setError(null);
    try {
      return await doctorApi.getSchedule(doctorId);
    } catch (err) {
      setError(err.message || 'Failed to fetch schedule');
      throw err;
    }
  }, []);

  const fetchDoctorAppointments = useCallback(async (doctorId) => {
    setError(null);
    try {
      return await appointmentApi.getAll({ doctorId });
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
      return [];
    }
  }, []);

  const fetchDoctorPatients = useCallback(async (doctorId) => {
    setError(null);
    try {
      const appointments = await appointmentApi.getAll({ doctorId });
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
      setError(err.message || 'Failed to fetch patients');
      return [];
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
};

export const useDoctor = () => {
  const context = React.useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within DoctorProvider');
  }
  return context;
};
