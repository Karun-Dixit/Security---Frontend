import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn';
import { api } from '../services/apiClient';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [passwordFeedback, setPasswordFeedback] = useState({ warning: '', suggestions: [] });

  // Check if token is valid on component mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast.error('Invalid reset link');
      return;
    }

    // Optional: Verify token with backend
    const verifyToken = async () => {
      try {
        await api.post('/api/user/verify-reset-token', { token });
      } catch (error) {
        setTokenValid(false);
        toast.error('Reset link has expired or is invalid');
      }
    };

    verifyToken();
  }, [token]);

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setFormData(prev => ({ ...prev, password: pwd }));
    
    // Check password strength
    const result = zxcvbn(pwd);
    setPasswordStrength(result.score);
    setPasswordFeedback(result.feedback);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength < 2) {
      toast.error('Password is too weak. Please choose a stronger password.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/api/user/reset-password', {
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      if (data.success) {
        toast.success(data.message || 'Password reset successful! Please login with your new password.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('same as current')) {
        toast.error('New password cannot be the same as your current password. Please choose a different password.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to reset password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = (score) => {
    const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['text-red-600', 'text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];
    return {
      text: strengthTexts[score],
      color: strengthColors[score]
    };
  };

  const getPasswordStrengthBarColor = (score) => {
    const colors = ['bg-red-500', 'bg-red-400', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500'];
    return colors[score];
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EAF2FF] px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is either invalid or has expired.
            </p>
            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              >
                Request New Reset Link
              </Link>
              <Link
                to="/login"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF2FF] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
          <p className="text-gray-600 mb-6">
            Enter your new password below to reset your account password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="Enter your new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Password Strength:</span>
                  <span className={`text-xs font-medium ${getPasswordStrengthText(passwordStrength).color}`}>
                    {getPasswordStrengthText(passwordStrength).text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBarColor(passwordStrength)}`}
                    style={{ width: `${(passwordStrength + 1) * 20}%` }}
                  ></div>
                </div>
                {passwordFeedback.warning && (
                  <p className="text-xs text-red-500 mt-1">{passwordFeedback.warning}</p>
                )}
                {passwordFeedback.suggestions.length > 0 && (
                  <ul className="text-xs text-gray-600 mt-1">
                    {passwordFeedback.suggestions.map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm your new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || passwordStrength < 2 || formData.password !== formData.confirmPassword}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
