import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { prescriptionApi } from '../services/domainApi';
import { getEntityId } from '../utils/auth';

const PrescriptionContext = createContext();

export const usePrescription = () => {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error('usePrescription must be used within a PrescriptionProvider');
  }
  return context;
};

export const PrescriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createPrescription = useCallback(async (prescriptionData) => {
    setLoading(true);
    setError(null);
    try {
      const prescription = await prescriptionApi.create(prescriptionData);
      setPrescriptions((prev) => [prescription, ...prev]);
      return prescription;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create prescription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrescriptions = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await prescriptionApi.getAll(filters);
      setPrescriptions(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch prescriptions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrescriptionById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await prescriptionApi.getById(id);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch prescription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrescriptionsByPatient = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await prescriptionApi.getByPatient(patientId);
      setPrescriptions(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch patient prescriptions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePrescription = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const prescription = await prescriptionApi.update(id, updateData);
      setPrescriptions((prev) =>
        prev.map((existingPrescription) =>
          existingPrescription._id === id ? prescription : existingPrescription
        )
      );
      return prescription;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update prescription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePrescription = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await prescriptionApi.delete(id);
      setPrescriptions((prev) => prev.filter((prescription) => prescription._id !== id));
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete prescription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getActivePrescriptions = useCallback(() => {
    const now = new Date();
    return prescriptions.filter((prescription) => {
      if (!prescription.expiryDate) return true;
      return new Date(prescription.expiryDate) > now;
    });
  }, [prescriptions]);

  const getExpiredPrescriptions = useCallback(() => {
    const now = new Date();
    return prescriptions.filter((prescription) => {
      return prescription.expiryDate && new Date(prescription.expiryDate) <= now;
    });
  }, [prescriptions]);

  const getExpiringSoonPrescriptions = useCallback(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return prescriptions.filter((prescription) => {
      if (!prescription.expiryDate) return false;
      const expiryDate = new Date(prescription.expiryDate);
      return expiryDate > now && expiryDate <= sevenDaysFromNow;
    });
  }, [prescriptions]);

  const getPrescriptionsByDoctor = useCallback(() => {
    const userId = getEntityId(user);
    if (!userId) return [];
    return prescriptions.filter((prescription) => prescription.doctorId?._id === userId);
  }, [prescriptions, user]);

  const getPrescriptionsByPatient = useCallback(() => {
    const userId = getEntityId(user);
    if (!userId) return [];
    return prescriptions.filter((prescription) => prescription.patientId?._id === userId);
  }, [prescriptions, user]);

  return (
    <PrescriptionContext.Provider
      value={{
        prescriptions,
        loading,
        error,
        clearError,
        createPrescription,
        fetchPrescriptions,
        fetchPrescriptionById,
        fetchPrescriptionsByPatient,
        updatePrescription,
        deletePrescription,
        getActivePrescriptions,
        getExpiredPrescriptions,
        getExpiringSoonPrescriptions,
        getPrescriptionsByDoctor,
        getPrescriptionsByPatient,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};
