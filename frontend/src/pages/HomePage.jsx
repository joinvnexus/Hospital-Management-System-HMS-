import React from 'react';

const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Hospital Management System</h1>
          <p className="text-xl mb-8">Efficient healthcare management at your fingertips</p>
          <div className="space-x-4 flex flex-wrap gap-4">
            <a href="/register/patient" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100">
              Register as Patient
            </a>
            <a href="/register/doctor" className="inline-block bg-green-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-600">
              Register as Doctor
            </a>
            <a href="/login" className="inline-block border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700">
              Sign In
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Easy Appointments',
                description: 'Book and manage appointments with doctors in seconds',
                icon: '📅',
              },
              {
                title: 'Medical Records',
                description: 'Keep your medical history organized and accessible',
                icon: '📋',
              },
              {
                title: 'Prescriptions',
                description: 'Manage your prescriptions and medications digitally',
                icon: '💊',
              },
              {
                title: 'Doctor Directory',
                description: 'Find the right doctor for your healthcare needs',
                icon: '👨‍⚕️',
              },
              {
                title: 'Secure System',
                description: 'Your data is protected with advanced security',
                icon: '🔒',
              },
              {
                title: '24/7 Support',
                description: 'Customer support available round the clock',
                icon: '🤝',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
