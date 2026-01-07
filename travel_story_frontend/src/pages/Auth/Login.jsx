import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/Navbar/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter the password.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Login API Call
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className="auth-card">
          <h4 className="auth-title">Welcome Back</h4>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="input-label">Email Address</label>
              <input
                type="text"
                placeholder="you@example.com"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="input-label">Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs pb-1 animate-fadeIn" style={{ marginTop: '0.5rem' }}>
                {error}
              </p>
            )}

            <button 
              type="submit" 
              className="btn-primary w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <p className="text-sm text-center mt-6" style={{ color: 'var(--text-light)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary underline" style={{ transition: 'color 0.2s' }}>
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
