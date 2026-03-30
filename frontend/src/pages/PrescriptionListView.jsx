import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrescription } from '../context/PrescriptionContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';

/**
 * PrescriptionListView Component
 * Displays list of prescriptions with filtering and search
 * Different views for patients and doctors
 */
const PrescriptionListView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    prescriptions,
    loading,
    error,
    fetchPrescriptions,
    fetchPrescriptionsByPatient,
    getActivePrescriptions,
    getExpiredPrescriptions,
    getExpiringSoonPrescriptions,
    deletePrescription
  } = usePrescription();

  const [filter, setFilter] = useState('all'); // all, active, expired, expiring-soon
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [deletingId, setDeletingId] = useState(null);

  // Fetch prescriptions on mount
  useEffect(() => {
    if (user?.role === 'patient') {
      fetchPrescriptionsByPatient(user._id);
    } else if (user?.role === 'doctor') {
      fetchPrescriptions({ doctorId: user._id });
    }
  }, [user, fetchPrescriptions, fetchPrescriptionsByPatient]);

  // Filter and sort prescriptions
  const getFilteredPrescriptions = () => {
    let filtered = prescriptions;

    // Apply status filter
    switch (filter) {
      case 'active':
        filtered = getActivePrescriptions();
        break;
      case 'expired':
        filtered = getExpiredPrescriptions();
        break;
      case 'expiring-soon':
        filtered = getExpiringSoonPrescriptions();
        break;
      default:
        filtered = prescriptions;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(prescription => {
        const searchLower = searchTerm.toLowerCase();
        const medicineNames = prescription.medicines.map(m => m.name.toLowerCase()).join(' ');
        const doctorName = prescription.doctorId ?
          `${prescription.doctorId.firstName} ${prescription.doctorId.lastName}`.toLowerCase() : '';
        const patientName = prescription.patientId ?
          `${prescription.patientId.firstName} ${prescription.patientId.lastName}`.toLowerCase() : '';

        return medicineNames.includes(searchLower) ||
               doctorName.includes(searchLower) ||
               patientName.includes(searchLower);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.diagnosisDate);
      const dateB = new Date(b.diagnosisDate);

      if (sortBy === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return filtered;
  };

  const handleDeletePrescription = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      await deletePrescription(id);
    } catch (error) {
      console.error('Failed to delete prescription:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (prescription) => {
    const now = new Date();
    const expiryDate = prescription.expiryDate ? new Date(prescription.expiryDate) : null;

    if (!expiryDate) {
      return { text: 'Active', className: 'bg-green-100 text-green-800 border-green-200' };
    }

    if (expiryDate <= now) {
      return { text: 'Expired', className: 'bg-red-100 text-red-800 border-red-200' };
    }

    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (expiryDate <= sevenDaysFromNow) {
      return { text: 'Expiring Soon', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }

    return { text: 'Active', className: 'bg-green-100 text-green-800 border-green-200' };
  };

  const filteredPrescriptions = getFilteredPrescriptions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading prescriptions..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'patient' ? 'Your medication prescriptions' : 'Patient prescriptions'}
              </p>
            </div>
            {user?.role === 'doctor' && (
              <button
                onClick={() => navigate('/prescriptions/create')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Create Prescription
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} dismissible={true} />
          </div>
        )}

        {/* Filters and Search */}
        <Card className="bg-white mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by medicine name or doctor/patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Prescriptions</option>
                <option value="active">Active</option>
                <option value="expiring-soon">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Prescriptions List */}
        {filteredPrescriptions.length === 0 ? (
          <Card className="bg-white">
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : user?.role === 'patient'
                    ? 'You don\'t have any prescriptions yet.'
                    : 'No prescriptions have been created yet.'
                }
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrescriptions.map(prescription => {
              const statusBadge = getStatusBadge(prescription);
              return (
                <Card key={prescription._id} className="bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user?.role === 'patient'
                          ? `Dr. ${prescription.doctorId?.firstName} ${prescription.doctorId?.lastName}`
                          : `${prescription.patientId?.firstName} ${prescription.patientId?.lastName}`
                        }
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(prescription.diagnosisDate)}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusBadge.className}`}>
                      {statusBadge.text}
                    </span>
                  </div>

                  {/* Medicines */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Medicines:</h4>
                    <div className="space-y-2">
                      {prescription.medicines.map((medicine, index) => (
                        <div key={index} className="bg-gray-50 rounded p-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{medicine.name}</p>
                              <p className="text-sm text-gray-600">
                                {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                              </p>
                              {medicine.instructions && (
                                <p className="text-xs text-gray-500 mt-1">{medicine.instructions}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {prescription.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
                      <p className="text-sm text-gray-600">{prescription.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/prescriptions/${prescription._id}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View Details
                    </button>

                    {user?.role === 'doctor' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/prescriptions/${prescription._id}/edit`)}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePrescription(prescription._id)}
                          disabled={deletingId === prescription._id}
                          className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                        >
                          {deletingId === prescription._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionListView;