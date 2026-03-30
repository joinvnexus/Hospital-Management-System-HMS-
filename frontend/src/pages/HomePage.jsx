import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes';

const HomePage = () => {
  const highlights = [
    {
      title: 'Appointment coordination',
      description: 'Browse doctors, review availability, and book care without back-and-forth calls.',
    },
    {
      title: 'Doctor workflow visibility',
      description: 'See today’s schedule, manage slots, and move from consult to prescription quickly.',
    },
    {
      title: 'Patient history access',
      description: 'Keep prescriptions, visit history, and profile information in one clean experience.',
    },
  ];

  return (
    <div className="page-shell">
      <section className="section-wrap px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Patient and Doctor Experience
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-slate-950 sm:text-6xl">
              Better hospital workflows start with a calmer frontend.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              HMS brings appointments, doctor discovery, schedules, prescriptions, and patient records into one user-friendly web experience for both sides of care.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={ROUTES.registerPatient} className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Start as Patient
              </Link>
              <Link to={ROUTES.registerDoctor} className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                Join as Doctor
              </Link>
              <Link to={ROUTES.doctors} className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white">
                Explore Doctors
              </Link>
            </div>
          </div>

          <div className="panel overflow-hidden p-8">
            <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Appointments today</p>
                  <p className="mt-3 text-4xl font-semibold">48</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Doctors available</p>
                  <p className="mt-3 text-4xl font-semibold">16</p>
                </div>
              </div>
              <div className="mt-5 rounded-3xl bg-gradient-to-r from-sky-400/20 to-emerald-400/20 p-5">
                <p className="text-sm text-slate-200">Patient journey</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-white px-3 py-1 text-slate-950">Find Doctor</span>
                  <span className="text-slate-400">to</span>
                  <span className="rounded-full bg-white px-3 py-1 text-slate-950">Book Visit</span>
                  <span className="text-slate-400">to</span>
                  <span className="rounded-full bg-white px-3 py-1 text-slate-950">Track Prescription</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="panel p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Core Flow</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
