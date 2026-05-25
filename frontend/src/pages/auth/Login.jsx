import React, { useState } from 'react';
import { Eye, Lock, Mail } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import GoogleSignInButton from './GoogleSignInButton';
import { apiRequest, storeSession } from '../../lib/api';

export default function Login({ onBack, onCreateAccount, onLoginComplete, onPhoneLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      storeSession(response.data.token, response.data.user);

      if (onLoginComplete) {
        onLoginComplete(response.data.user);
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout onBack={onBack}>
      <div>
        <h1 className="text-[25px] font-medium tracking-tight text-slate-900 2xl:text-[30px] min-[1920px]:text-[34px]">
          Welcome Back
        </h1>

        <p className="mt-1.5 text-[13px] text-slate-500 2xl:mt-2 2xl:text-[15px] min-[1920px]:text-base">
          Sign in to continue to your account
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3 2xl:mt-7 2xl:space-y-4 min-[1920px]:mt-8 min-[1920px]:space-y-5">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700 2xl:mb-2 2xl:text-[15px] min-[1920px]:text-base">
              Email Address
            </label>

            <div className="flex h-10.5 items-center gap-3 rounded-lg border border-slate-200 px-4 transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100 2xl:h-12 2xl:px-5 min-[1920px]:h-14 min-[1920px]:px-6">
              <Mail size={17} className="text-slate-400 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-full w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400 2xl:text-[15px] min-[1920px]:text-base"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700 2xl:mb-2 2xl:text-[15px] min-[1920px]:text-base">
              Password
            </label>

            <div className="flex h-10.5 items-center gap-3 rounded-lg border border-slate-200 px-4 transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100 2xl:h-12 2xl:px-5 min-[1920px]:h-14 min-[1920px]:px-6">
              <Lock size={17} className="text-slate-400 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6" />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-full w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400 2xl:text-[15px] min-[1920px]:text-base"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer text-slate-400 transition hover:text-slate-700 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6"
                aria-label="Toggle password visibility"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="cursor-pointer text-[13px] font-medium text-[#08785d] hover:underline 2xl:text-[15px] min-[1920px]:text-base"
            >
              Forgot password?
            </button>
          </div>

          {error ? (
            <p className="text-[13px] font-medium text-red-600 2xl:text-[15px] min-[1920px]:text-base">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full cursor-pointer rounded-lg bg-[#08785d] text-[14px] font-extrabold text-white transition hover:bg-[#066b53] 2xl:h-12 2xl:text-[15px] min-[1920px]:h-14 min-[1920px]:text-base"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-4 2xl:my-6 2xl:gap-5 min-[1920px]:my-7 min-[1920px]:gap-6">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] text-slate-400 2xl:text-[12px] min-[1920px]:text-[13px]">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleSignInButton
          flow="signin"
          onSuccess={onLoginComplete}
          className="mt-1"
        />

        <button
          type="button"
          onClick={onPhoneLogin}
          className="mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 text-[14px] font-extrabold text-[#08785d] transition hover:bg-emerald-100 2xl:mt-4 2xl:h-12 2xl:text-[15px] min-[1920px]:h-14 min-[1920px]:text-base"
        >
          Continue with phone number
        </button>

        <p className="mt-5 text-center text-[13px] text-slate-500 2xl:mt-7 2xl:text-[15px] min-[1920px]:mt-8 min-[1920px]:text-base">
          New to SkilledLK?{' '}
          <button
            type="button"
            onClick={onCreateAccount}
            className="cursor-pointer font-extrabold text-[#08785d] hover:underline"
          >
            Create an account
          </button>
        </p>

        <p className="mt-5 text-center text-[9px] uppercase tracking-[0.2em] text-slate-400 2xl:mt-7 2xl:text-[10px] min-[1920px]:mt-8 min-[1920px]:text-[11px]">
          © 2026 SkilledLK Professional Marketplace
        </p>
      </div>
    </OnboardingLayout>
  );
}
