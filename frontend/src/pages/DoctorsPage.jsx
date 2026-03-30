import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiClient.get('/doctors');
        setDoctors(response.data.data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = selectedSpeciality
    ? doctors.filter(doc => doc.speciality === selectedSpeciality)
    : doctors;

  const specialities = [...new Set(doctors.map(doc => doc.speciality))];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Doctors</h1>

        {/* Filter */}
        <div className="mb-8">
          <select
            value={selectedSpeciality}
            onChange={(e) => setSelectedSpeciality(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          >
            <option value="">All Specialities</option>
            {specialities.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div classic="text-center py-12">
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">{doctor.speciality}</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Experience: {doctor.experience} years
                  </p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
