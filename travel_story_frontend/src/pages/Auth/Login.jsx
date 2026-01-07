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
        title: 'Pin stories that matter',
        desc: 'Keep your best trips at the top—your highlights stay one click away.',
      },
      {
        title: 'Curated maps & locations',
        desc: 'Tag places as you go and build a clean, searchable list of where you’ve been.',
      },
      {
        title: 'Smart search, fast recall',
        desc: 'Find any memory instantly by title, location tags, or a phrase from your story.',
      },
      {
        title: 'Secure uploads',
        desc: 'Add photos with confidence—modern, token-based sessions and safe requests.',
      },
    ],
    []
  );

  const communityStat = useMemo(
    () => ({
      headline: 'Trusted by travelers who like it organized',
      body: '“I can finally find the story I’m looking for—pins + tags make my journal feel effortless.”',
      meta: '— Community member',
      statLeft: '4.9/5',
      statRight: 'avg. session rating',
    }),
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

              <h1 className="auth-hero-title">Your journeys, beautifully remembered.</h1>
              <p className="auth-hero-desc">
                Travel Story is a private, ocean‑calm space to capture moments, organize places, and
                return to your favorite trips in seconds.
              </p>

              {/* Subtle illustration (SVG-only; lightweight) */}
              <div className="auth-illustration" aria-hidden="true">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 520 140"
                  preserveAspectRatio="none"
                  role="presentation"
                >
                  <defs>
                    <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.30)" />
                      <stop offset="50%" stopColor="rgba(245,158,11,0.26)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.22)" />
                    </linearGradient>
                    <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(59,130,246,0.25)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
                    </linearGradient>
                  </defs>

                  {/* soft horizon */}
                  <path
                    d="M0 78 C 70 64, 130 92, 210 78 C 290 64, 340 92, 420 78 C 470 70, 495 72, 520 76 L520 140 L0 140 Z"
                    fill="url(#waveGrad2)"
                    opacity="0.85"
                  />
                  <path
                    d="M0 92 C 80 74, 150 110, 235 92 C 320 74, 380 110, 520 90 L520 140 L0 140 Z"
                    fill="url(#waveGrad)"
                    opacity="0.9"
                  />

                  {/* tiny compass marker */}
                  <g transform="translate(410,28)" opacity="0.9">
                    <circle cx="26" cy="26" r="22" fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.18)" />
                    <path d="M26 14 L31 31 L21 26 Z" fill="rgba(245,158,11,0.95)" />
                    <path d="M26 38 L21 21 L31 26 Z" fill="rgba(255,255,255,0.85)" opacity="0.9" />
                  </g>
                </svg>

                <div className="auth-illustration-badges">
                  <div className="auth-mini-badge">
                    <span className="auth-mini-badge-dot" aria-hidden="true" />
                    Private by default
                  </div>
                  <div className="auth-mini-badge">
                    <span className="auth-mini-badge-dot auth-mini-badge-dot--amber" aria-hidden="true" />
                    Organized with tags
                  </div>
                </div>
              </div>

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

              {/* Optional social proof / trust block */}
              <div className="auth-trust" aria-label="Community feedback">
                <div className="auth-trust-quote">
                  <div className="auth-trust-quote-title">{communityStat.headline}</div>
                  <p className="auth-trust-quote-body">{communityStat.body}</p>
                  <div className="auth-trust-quote-meta">{communityStat.meta}</div>
                </div>

                <div className="auth-trust-stats" aria-hidden="true">
                  <div className="auth-trust-stat">
                    <div className="auth-trust-stat-value">{communityStat.statLeft}</div>
                    <div className="auth-trust-stat-label">{communityStat.statRight}</div>
                  </div>
                  <div className="auth-trust-stat auth-trust-stat--soft">
                    <div className="auth-trust-stat-value">3×</div>
                    <div className="auth-trust-stat-label">faster recall with pins</div>
                  </div>
                </div>
              </div>
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
