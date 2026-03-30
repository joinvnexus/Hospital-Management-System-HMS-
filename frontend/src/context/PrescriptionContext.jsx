import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../services/api';

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

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create a new prescription
  const createPrescription = useCallback(async (prescriptionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/prescriptions', prescriptionData);
      setPrescriptions(prev => [response.data.data, ...prev]);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create prescription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch prescriptions with optional filters
  const fetchPrescriptions = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      if (filters.patientId) params.append('patientId', filters.patientId);
      if (filters.doctorId) params.append('doctorId', filters.doctorId);

      const response = await apiClient.get(`/prescriptions?${params}`);
      setPrescriptions(response.data.data);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch prescriptions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch prescription by ID
  const fetchPrescriptionById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/prescriptions/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch prescription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch prescriptions for a specific patient
  const fetchPrescriptionsByPatient = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/prescriptions/patient/${patientId}`);
      setPrescriptions(response.data.data);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch patient prescriptions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update prescription
  const updatePrescription = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put(`/prescriptions/${id}`, updateData);
      setPrescriptions(prev =>
        prev.map(prescription =>
          prescription._id === id ? response.data.data : prescription
        )
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update prescription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete prescription
  const deletePrescription = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/prescriptions/${id}`);
      setPrescriptions(prev => prev.filter(prescription => prescription._id !== id));
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete prescription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get active prescriptions (not expired)
  const getActivePrescriptions = useCallback(() => {
    const now = new Date();
    return prescriptions.filter(prescription => {
      if (!prescription.expiryDate) return true;
      return new Date(prescription.expiryDate) > now;
    });
  }, [prescriptions]);

  // Get expired prescriptions
  const getExpiredPrescriptions = useCallback(() => {
    const now = new Date();
    return prescriptions.filter(prescription => {
      return prescription.expiryDate && new Date(prescription.expiryDate) <= now;
    });
  }, [prescriptions]);

  // Get prescriptions expiring soon (within 7 days)
  const getExpiringSoonPrescriptions = useCallback(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return prescriptions.filter(prescription => {
      if (!prescription.expiryDate) return false;
      const expiryDate = new Date(prescription.expiryDate);
      return expiryDate > now && expiryDate <= sevenDaysFromNow;
    });
  }, [prescriptions]);

  // Get prescriptions by doctor (for doctor's view)
  const getPrescriptionsByDoctor = useCallback(() => {
    if (!user?._id) return [];
    return prescriptions.filter(prescription => prescription.doctorId._id === user._id);
  }, [prescriptions, user]);

  // Get prescriptions by patient (for patient's view)
  const getPrescriptionsByPatient = useCallback(() => {
    if (!user?._id) return [];
    return prescriptions.filter(prescription => prescription.patientId._id === user._id);
  }, [prescriptions, user]);

  const value = {
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
  };

  return (
    <PrescriptionContext.Provider value={value}>
      {children}
    </PrescriptionContext.Provider>
  );
};