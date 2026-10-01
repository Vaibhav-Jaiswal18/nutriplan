import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/register', {
        name,
        email,
        password,
      });

      navigate('/login');
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: '#0b1512',
      }}
    >
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-bold text-green-400"
          >
            NutriPlan
          </Link>

          <h1 className="text-3xl font-bold text-white mt-8">
            Create your account
          </h1>

          <p className="text-white/40 mt-2">
            Start building personalized nutrition plans.
          </p>
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl p-7"
          style={{
            background: 'rgba(15, 28, 23, 0.7)',
            border: '1px solid rgba(34,197,94,0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Name */}
          <label className="block text-sm text-white/60 mb-2">
            Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl px-4 py-3 mb-5 text-white outline-none"
            style={{
              background: 'rgba(11,21,18,.8)',
              border: '1px solid rgba(34,197,94,.1)',
            }}
            placeholder="Your name"
          />

          {/* Email */}
          <label className="block text-sm text-white/60 mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl px-4 py-3 mb-5 text-white outline-none"
            style={{
              background: 'rgba(11,21,18,.8)',
              border: '1px solid rgba(34,197,94,.1)',
            }}
            placeholder="you@example.com"
          />

          {/* Password */}
          <label className="block text-sm text-white/60 mb-2">
            Password
          </label>

          <div className="relative">

            <input
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              minLength={8}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full rounded-xl px-4 py-3 pr-12 text-white outline-none"
              style={{
                background:
                  'rgba(11,21,18,.8)',
                border:
                  '1px solid rgba(34,197,94,.1)',
              }}
              placeholder="Minimum 8 characters"
            />

            {/* Eye Button */}
            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-green-400 transition-colors"
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showPassword ? (
                /* Eye Open */
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                  />
                </svg>
              ) : (
                /* Eye Closed */
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.8 18.8 0 0 1-3.1 4.4" />
                  <path d="M6.1 6.1C3.5 8.1 2 12 2 12s3.5 8 10 8c1.1 0 2.2-.2 3.1-.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 rounded-xl py-3.5 font-semibold disabled:opacity-50 transition hover:scale-[1.01]"
            style={{
              background:
                'linear-gradient(135deg,#22c55e,#16a34a)',
              color: '#0b1512',
            }}
          >
            {loading
              ? 'Creating...'
              : 'Create Account →'}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-green-400 hover:text-green-300"
            >
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}