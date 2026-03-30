import React from 'react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Appointments</dt>
              <dd className="mt-1 text-3xl font-extrabold text-gray-900">2</dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Active Prescriptions</dt>
              <dd className="mt-1 text-3xl font-extrabold text-gray-900">3</dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Doctors</dt>
              <dd className="mt-1 text-3xl font-extrabold text-gray-900">15</dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Medical Records</dt>
              <dd className="mt-1 text-3xl font-extrabold text-gray-900">5</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
