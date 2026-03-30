import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-white">
      <div className="section-wrap px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">HMS Platform</p>
            <h3 className="mt-3 text-2xl font-semibold">Care coordination with less friction.</h3>
            <p className="mt-3 max-w-sm text-slate-300">
              A single place for patients to manage care and for doctors to run daily workflows without the usual admin clutter.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-slate-300">
              <li><Link to={ROUTES.home} className="hover:text-white">Home</Link></li>
              <li><Link to={ROUTES.doctors} className="hover:text-white">Find Doctors</Link></li>
              <li><Link to={ROUTES.login} className="hover:text-white">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Contact</h3>
            <p className="text-slate-300">Email: care@hms.local</p>
            <p className="text-slate-300">Phone: +1-800-HMS-CARE</p>
            <p className="mt-3 text-sm text-slate-400">Operational Monday to Sunday, 24/7 support desk.</p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          <p>&copy; 2026 Hospital Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
