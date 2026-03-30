import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About HMS</h3>
            <p className="text-gray-400">Hospital Management System for efficient patient and appointment management.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="text-gray-400 space-y-2">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/doctors" className="hover:text-white">Find Doctors</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-400">Email: info@hms.com</p>
            <p className="text-gray-400">Phone: +1-800-HMS-0000</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Hospital Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
