import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '../services/domainApi';
import { ROUTES } from '../utils/routes';

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setDoctors(await doctorApi.getAll());
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specialities = [...new Set(doctors.map((doctor) => doctor.speciality).filter(Boolean))];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpeciality = selectedSpeciality ? doctor.speciality === selectedSpeciality : true;
    const haystack = `${doctor.firstName} ${doctor.lastName} ${doctor.speciality}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    return matchesSpeciality && matchesSearch;
  });

  return (
    <div className="page-shell py-12 px-4 sm:px-6 lg:px-8">
      <div className="section-wrap">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Doctor Directory</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Find the right specialist quickly.</h1>
        </div>

        <div className="panel mb-8 p-6">
          <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or specialty"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
            <select
              value={selectedSpeciality}
              onChange={(e) => setSelectedSpeciality(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            >
              <option value="">All Specialities</option>
              {specialities.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-600">Loading doctors...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="panel p-6">
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                <p className="mb-2 font-medium text-sky-700">{doctor.speciality}</p>
                <p className="mb-4 text-sm text-slate-600">
                  Experience: {doctor.experience || doctor.yearsOfExperience || 0} years
                </p>
                <button
                  onClick={() => navigate(ROUTES.bookAppointment)}
                  className="w-full rounded-full bg-slate-950 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
