import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye } from 'lucide-react';
import { apiRequest } from '../../lib/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [status, setStatus] = useState('idle'); // idle, submitting, success
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const tokenParam = params.get('token');
    
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
    
    if (!emailParam || !tokenParam) {
      setError('Invalid password reset link. Please request a new one.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !token) {
      setError('Invalid password reset link.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setStatus('submitting');

    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          token, 
          password,
          password_confirmation: confirmPassword 
        }),
      });

      setStatus('success');
    } catch (requestError) {
      setError(requestError.message || 'Unable to process request.');
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7fb] p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Lock size={24} />
          </div>
          <h1 className="text-[22px] font-medium tracking-tight text-slate-900">
            Password Reset Complete
          </h1>
          <p className="mt-2 text-[14px] text-slate-500">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 h-12 w-full rounded-lg bg-[#08785d] text-[15px] font-extrabold text-white transition hover:bg-[#066b53] cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f7fb] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50">
        <h1 className="text-[25px] font-medium tracking-tight text-slate-900">
          Create New Password
        </h1>
        <p className="mt-2 text-[14px] text-slate-500">
          Your new password must be different from previous used passwords and at least 8 characters long.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-slate-700">
              New Password
            </label>
            <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-4 transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100">
              <Lock size={18} className="text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-full w-full bg-transparent text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-slate-700">
              Confirm Password
            </label>
            <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-4 transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100">
              <Lock size={18} className="text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-full w-full bg-transparent text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[14px] font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting' || !email || !token}
            className="mt-2 h-12 w-full cursor-pointer rounded-lg bg-[#08785d] text-[15px] font-extrabold text-white transition hover:bg-[#066b53] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
