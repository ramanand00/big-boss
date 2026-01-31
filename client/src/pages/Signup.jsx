import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const { signup, verifyOtp } = useAuth();
  const navigate = useNavigate();

  // Timer effect for OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    if (!formData.contact.trim()) {
      toast.error('Contact number is required');
      return false;
    }
    
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(formData.contact.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit contact number');
      return false;
    }
    
    return true;
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    
    if (!validateStep1()) return;
    
    setLoading(true);
    const result = await signup(formData);
    setLoading(false);
    
    if (result.success) {
      setStep(2);
      setTimer(300); // 5 minutes
      toast.success('OTP sent to your email!');
    } else {
      toast.error(result.error || 'Failed to send OTP');
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    
    setLoading(true);
    const result = await signup(formData);
    setLoading(false);
    
    if (result.success) {
      setTimer(300);
      toast.success('New OTP sent to your email!');
    } else {
      toast.error(result.error || 'Failed to resend OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error('Please enter OTP');
      return;
    }
    
    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }
    
    setLoading(true);
    const result = await verifyOtp(formData.email, otp);
    setLoading(false);
    
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.error || 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 
              ? 'Sign up for a new account' 
              : `Enter the 6-digit OTP sent to ${formData.email}`}
          </p>
        </div>
        
        <div className="card">
          {step === 1 ? (
            <form className="space-y-4" onSubmit={handleSubmitStep1}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="1234567890"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Sign Up'}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter the 6-digit OTP sent to <br />
                  <span className="font-semibold">{formData.email}</span>
                </label>
                
                <div className="flex justify-center space-x-3">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition duration-200"
                      value={otp[index] || ''}
                      onChange={(e) => {
                        const newOtp = otp.split('');
                        newOtp[index] = e.target.value.replace(/\D/g, '');
                        setOtp(newOtp.join(''));
                        
                        // Auto-focus next input
                        if (e.target.value && index < 5) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }}
                      id={`otp-${index}`}
                    />
                  ))}
                </div>
                
                {timer > 0 && (
                  <p className="mt-4 text-center text-sm text-gray-600">
                    Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </p>
                )}
                
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || timer > 0}
                  className={`mt-4 w-full ${timer > 0 ? 'btn-secondary' : 'btn-primary'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {step === 1 ? 'Already have an account?' : 'Back to signup'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              {step === 1 ? (
                <Link
                  to="/login"
                  className="w-full btn-secondary text-center block"
                >
                  Sign in instead
                </Link>
              ) : (
                <button
                  onClick={() => setStep(1)}
                  className="w-full btn-secondary"
                >
                  Back to Signup
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;