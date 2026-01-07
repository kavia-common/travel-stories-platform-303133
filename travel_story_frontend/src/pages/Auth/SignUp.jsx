import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/Navbar/Navbar';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  // UI micro-interaction state
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | loading | success | error
  const [shakeNonce, setShakeNonce] = useState(0);

  const navigate = useNavigate();
  const leftPanelRef = useRef(null);

  useEffect(() => {
    const t = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(t);
  }, []);

  const featureItems = useMemo(
    () => [
      {
        title: 'One place for every trip',
        desc: 'Organize stories by location and date, and keep them accessible anywhere.',
      },
      {
        title: 'Beautiful, modern interface',
        desc: 'Ocean-themed design with smooth interactions and clean typography.',
      },
      {
        title: 'Built for momentum',
        desc: 'Quick creation flows, handy search, and pinning so your best stories shine.',
      },
    ],
    []
  );

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setSubmitStatus('error');
      setError('Please enter your name');
      setShakeNonce((n) => n + 1);
      return;
    }

    if (!validateEmail(email)) {
      setSubmitStatus('error');
      setError('Please enter a valid email address.');
      setShakeNonce((n) => n + 1);
      return;
    }

    if (!password) {
      setSubmitStatus('error');
      setError('Please enter the password.');
      setShakeNonce((n) => n + 1);
      return;
    }

    if (password.length < 6) {
      setSubmitStatus('error');
      setError('Password must be at least 6 characters long.');
      setShakeNonce((n) => n + 1);
      return;
    }

    setError('');
    setIsLoading(true);
    setSubmitStatus('loading');

    // SignUp API Call
    try {
      const response = await axiosInstance.post('/auth/register', {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        setSubmitStatus('success');
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      } else if (response.data && response.data.message) {
        // If registration successful but no token, redirect to login
        setSubmitStatus('success');
        navigate('/login');
      }
    } catch (error) {
      setSubmitStatus('error');
      setShakeNonce((n) => n + 1);

      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleParallax = (e) => {
    if (!leftPanelRef.current || e.pointerType === 'touch') return;

    const rect = leftPanelRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const px = (relX - 0.5) * 18;
    const py = (relY - 0.5) * 18;

    leftPanelRef.current.style.setProperty('--px', `${px}px`);
    leftPanelRef.current.style.setProperty('--py', `${py}px`);
  };

  const resetParallax = () => {
    if (!leftPanelRef.current) return;
    leftPanelRef.current.style.setProperty('--px', `0px`);
    leftPanelRef.current.style.setProperty('--py', `0px`);
  };

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className={`auth-shell ${isMounted ? 'is-mounted' : ''}`} aria-label="Sign up page">
          {/* Left Brand/Info Panel */}
          <aside
            className="auth-left"
            ref={leftPanelRef}
            onPointerMove={handleParallax}
            onPointerLeave={resetParallax}
            aria-label="Product information"
          >
            <div className="auth-blob blob-1" aria-hidden="true" />
            <div className="auth-blob blob-2" aria-hidden="true" />

            <div className="auth-left-content">
              <div className="auth-brand">
                <div className="auth-brand-badge" aria-hidden="true">
                  {/* Simple compass-like glyph */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z"
                      stroke="rgba(255,255,255,0.9)"
                      strokeWidth="2"
                    />
                    <path
                      d="M14.8 9.2 13.2 13.2 9.2 14.8 10.8 10.8 14.8 9.2Z"
                      fill="rgba(245, 158, 11, 0.95)"
                    />
                  </svg>
                </div>
                <div>
                  <div className="auth-brand-title">Travel Story</div>
                  <div className="auth-brand-subtitle">Ocean Professional · Start your journal</div>
                </div>
              </div>

              <h1 className="auth-hero-title">Create your account.</h1>
              <p className="auth-hero-desc">
                Build a private space for your travel memories—add photos, tag locations, and keep
                your favorites pinned.
              </p>

              <ul className="auth-feature-list" aria-label="Key features">
                {featureItems.map((f) => (
                  <li className="auth-feature" key={f.title}>
                    <div className="auth-feature-icon" aria-hidden="true">
                      <span style={{ fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>✓</span>
                    </div>
                    <div>
                      <div className="auth-feature-title">{f.title}</div>
                      <div className="auth-feature-desc">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Form Panel */}
          <section className="auth-right" aria-label="Create account form">
            <div
              className={`auth-card ${submitStatus === 'error' && shakeNonce ? 'is-shaking' : ''}`}
              key={shakeNonce}
              role="region"
              aria-labelledby="signup-title"
            >
              <h4 className="auth-title" id="signup-title">
                Create account
              </h4>
              <p className="auth-subtitle">
                Join in seconds. You can start creating stories right after signup.
              </p>

              <form onSubmit={handleSignUp} aria-busy={isLoading}>
                <div className={`auth-field ${error && !name ? 'is-invalid' : name ? 'is-valid' : ''}`}>
                  <label className="input-label" htmlFor="signup-name">
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className="input-box"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={Boolean(error && !name)}
                  />
                </div>

                <div
                  className={`auth-field ${
                    error && !validateEmail(email) ? 'is-invalid' : email && validateEmail(email) ? 'is-valid' : ''
                  }`}
                >
                  <label className="input-label" htmlFor="signup-email">
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="input-box"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(error && !validateEmail(email))}
                  />
                </div>

                <div
                  className={`auth-field ${
                    error && (!password || password.length < 6) ? 'is-invalid' : password ? 'is-valid' : ''
                  }`}
                >
                  <label className="input-label" htmlFor="signup-password">
                    Password
                  </label>
                  {/* PasswordInput doesn't accept id prop; provide an accessible label above and keep input focusable */}
                  <span className="visually-hidden" id="signup-password">
                    Password
                  </span>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                  />
                </div>

                <div
                  className="auth-feedback"
                  role={error ? 'alert' : 'status'}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {error ? (
                    <span className="auth-feedback--error">{error}</span>
                  ) : submitStatus === 'success' ? (
                    <span className="auth-feedback--success">Success. Redirecting…</span>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full mt-4"
                  disabled={isLoading}
                  aria-disabled={isLoading}
                >
                  <span className="auth-btn-content">
                    {isLoading && <span className="auth-spinner" aria-hidden="true" />}
                    <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                  </span>
                </button>

                <p className="text-sm text-center mt-6" style={{ color: 'var(--text-light)' }}>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-primary underline"
                    style={{ transition: 'color 0.2s' }}
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SignUp;
