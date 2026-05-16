'use client';

import { useState, useRef, useEffect } from 'react';
import axiosInstance from '../../lib/axios';
import { useRouter } from 'next/navigation';
import { FiPhone, FiLock, FiArrowLeft } from 'react-icons/fi';

export default function LoginPage() {
  const [step, setStep] = useState('login'); // 'login', 'forgot-mobile', 'forgot-otp', 'reset-password'
  const [role, setRole] = useState('admin');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const otpRefs = useRef([]);
  const router = useRouter();

  useEffect(() => {
    if (step === 'forgot-otp') {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = '/api/corporate/auth/login';
      const response = await axiosInstance.post(endpoint, { mobile_number: mobileNumber, password: password });

      if (response.status === 200) {
        if (role === 'consultant' && response.data.data.role !== 'consultant') {
            setError("Access denied. Consultant role required.");
            setLoading(false);
            return;
        }
        localStorage.setItem("user", JSON.stringify(response.data.data));
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid mobile number or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/api/corporate/auth/send_otp', { mobile_number: mobileNumber });
      if (response.status === 200) {
        setStep('forgot-otp');
        setSuccess('OTP sent successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/api/corporate/auth/verify_otp', { mobile_number: mobileNumber, otp: otpValue });
      if (response.status === 200) {
        setStep('reset-password');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/api/corporate/auth/change_password', { 
        mobile_number: mobileNumber, 
        new_password: newPassword 
      });
      if (response.status === 200) {
        setStep('login');
        setSuccess('Password reset successfully! Please login.');
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="card animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
          {step === 'login' ? 'Corporate Login' : step === 'forgot-mobile' ? 'Reset Password' : step === 'forgot-otp' ? 'Verify OTP' : 'New Password'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          {step === 'login' ? 'Welcome back, please login' : step === 'forgot-mobile' ? 'Enter your mobile to receive an OTP' : step === 'forgot-otp' ? `We sent a code to ${mobileNumber}` : 'Set your new secure password'}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {step === 'login' && (
        <>
          <div className="tabs">
            <div className={`tab ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>Admin</div>
            <div className={`tab ${role === 'consultant' ? 'active' : ''}`} onClick={() => setRole('consultant')}>Consultant</div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <FiPhone size={16} />
                </span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <FiLock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Signing in...' : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="btn-ghost" onClick={() => setStep('forgot-mobile')}>Forgot Password?</button>
          </div>
        </>
      )}

      {step === 'forgot-mobile' && (
        <form onSubmit={handleSendOTP}>
          <div className="input-group">
            <label>Registered Mobile</label>
            <input
              type="tel"
              placeholder="Enter 10-digit number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Sending...' : 'Send Verification OTP'}
          </button>
          <div className="back-link" onClick={() => setStep('login')}>
            <FiArrowLeft size={14} /> Back to Login
          </div>
        </form>
      )}

      {step === 'forgot-otp' && (
        <form onSubmit={handleVerifyOTP}>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="otp-input"
              />
            ))}
          </div>
          <button type="submit" disabled={loading || otp.join('').length < 6} className="btn-primary">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button type="button" className="btn-ghost" onClick={handleSendOTP}>Resend OTP</button>
          </div>
          <div className="back-link" onClick={() => setStep('forgot-mobile')}>
            <FiArrowLeft size={14} /> Change Number
          </div>
        </form>
      )}

      {step === 'reset-password' && (
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Resetting...' : 'Set New Password'}
          </button>
        </form>
      )}
    </div>
  );
}
