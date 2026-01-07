import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/Navbar/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error is kept for existing logic (backend + client-side validation)
  const [error, setError] = useState(null);

  // UI micro-interaction state
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | loading | success | error
  const [shakeNonce, setShakeNonce] = useState(0);

  const navigate = useNavigate();
  const leftPanelRef = useRef(null);

  useEffect(() => {
    // Trigger mount reveal on next frame for smoother initial paint
    const t = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(t);
  }, []);

  const featureItems = useMemo(
    () => [
      {
        title: 'Capture moments effortlessly',
        desc: 'Create beautiful travel stories with dates, locations, and photos in seconds.',
      },
      {
        title: 'Search & pin favorites',
        desc: 'Find memories fast and keep your best trips at the top with pinning.',
      },
      {
        title: 'Secure by design',
        desc: 'Your session is protected with token-based authentication and safe requests.',
      },
    ],
    []
  );

  const handleLogin = async (e) => {
    e.preventDefault();

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

    setError('');
    setIsLoading(true);
    setSubmitStatus('loading');

    // Login API Call
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        setSubmitStatus('success');
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
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
    // Subtle parallax effect, disabled automatically for touch devices via pointer type
    if (!leftPanelRef.current || e.pointerType === 'touch') return;

    const rect = leftPanelRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width; // 0..1
    const relY = (e.clientY - rect.top) / rect.height; // 0..1
    const px = (relX - 0.5) * 18; // -9..9
    const py = (relY - 0.5) * 18; // -9..9

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
        <div className={`auth-shell ${isMounted ? 'is-mounted' : ''}`} aria-label="Login page">
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
                  <div className="auth-brand-subtitle">Ocean Professional · Private journaling</div>
                </div>
              </div>

              <h1 className="auth-hero-title">Welcome back.</h1>
              <p className="auth-hero-desc">
                Sign in to continue building your travel journal—pin favorites, search memories, and
                relive every trip.
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
          <section className="auth-right" aria-label="Sign in form">
            <div
              className={`auth-card ${submitStatus === 'error' && shakeNonce ? 'is-shaking' : ''}`}
              key={shakeNonce} /* re-mount to re-run shake without extra timers */
              role="region"
              aria-labelledby="login-title"
            >
              <h4 className="auth-title" id="login-title">
                Sign in
              </h4>
              <p className="auth-subtitle">Use your email and password to access your dashboard.</p>

              <form onSubmit={handleLogin} aria-busy={isLoading}>
                <div
                  className={`auth-field ${
                    error && !validateEmail(email) ? 'is-invalid' : email && validateEmail(email) ? 'is-valid' : ''
                  }`}
                >
                  <label className="input-label" htmlFor="login-email">
                    Email Address
                  </label>
                  <input
                    id="login-email"
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

                <div className={`auth-field ${error && !password ? 'is-invalid' : password ? 'is-valid' : ''}`}>
                  <label className="input-label" htmlFor="login-password">
                    Password
                  </label>
                  {/* PasswordInput doesn't accept id prop; provide an accessible label above and keep input focusable */}
                  <span className="visually-hidden" id="login-password">
                    Password
                  </span>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
                    <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                  </span>
                </button>

                <p className="text-sm text-center mt-6" style={{ color: 'var(--text-light)' }}>
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-semibold text-primary underline"
                    style={{ transition: 'color 0.2s' }}
                  >
                    Create Account
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

export default Login;
