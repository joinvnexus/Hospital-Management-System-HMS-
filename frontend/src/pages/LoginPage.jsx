import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/domainApi';
import { ROUTES } from '../utils/routes';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response =
        role === 'patient'
          ? await authApi.loginPatient({ email, password })
          : await authApi.loginDoctor({ email, password });

      login(response.data[role], response.data.token, role);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="panel hidden p-8 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Welcome back</p>
          <h2 className="mt-4 text-4xl font-semibold text-slate-950">Pick up today’s care workflow right where you left it.</h2>
          <p className="mt-4 text-slate-600">
            Patients can manage visits and prescriptions. Doctors can review schedules, patients, and active treatment plans.
          </p>
        </div>

        <form className="panel space-y-6 p-8" onSubmit={handleSubmit}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Secure Access</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Sign in to HMS</h2>
            <p className="mt-2 text-sm text-slate-500">Choose your portal and continue.</p>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700">
                I am a:
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Email address"
            />

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center text-sm text-slate-600">
            <p className="mb-3">Do not have an account?</p>
            <div className="space-y-2">
              <button type="button" onClick={() => navigate(ROUTES.registerPatient)} className="block w-full font-medium text-sky-700 hover:text-sky-600">
                Register as Patient
              </button>
              <button type="button" onClick={() => navigate(ROUTES.registerDoctor)} className="block w-full font-medium text-emerald-700 hover:text-emerald-600">
                Register as Doctor
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
