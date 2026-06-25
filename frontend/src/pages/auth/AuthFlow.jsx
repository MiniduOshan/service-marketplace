import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';
import RoleSelection from './RoleSelection';
import PhoneInput from './PhoneInput';
import PhoneVerification from './PhoneVerification';
import ForgotPassword from './ForgotPassword';

export default function AuthFlow({ initialView = 'login', entryMode = 'signin' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(initialView);
  const [selectedRole, setSelectedRole] = useState('customer');
  const [phoneFlow, setPhoneFlow] = useState({ name: '', phone: '', role: 'customer' });

  const [roleBackStep, setRoleBackStep] = useState(null);
  const [loginBackStep, setLoginBackStep] = useState(null);
  const [phoneBackStep, setPhoneBackStep] = useState(null);
  const [signupBackStep, setSignupBackStep] = useState('role-selection');

  useEffect(() => {
    setStep(initialView);

    if (initialView === 'role-selection' || entryMode === 'signup') {
      setRoleBackStep(null);
      setSignupBackStep('role-selection');
      setLoginBackStep(null);
      setPhoneBackStep(null);
      return;
    }

    if (initialView === 'login' || entryMode === 'signin') {
      setRoleBackStep(null);
      setSignupBackStep('role-selection');
      setLoginBackStep(null);
      setPhoneBackStep(null);
      return;
    }

    setRoleBackStep(null);
    setSignupBackStep('role-selection');
    setLoginBackStep(null);
    setPhoneBackStep(null);
  }, [initialView, entryMode, location.pathname]);

  const closeFlow = () => {
    navigate('/', { replace: true });
  };

  const goToStep = (nextStep) => {
    setStep(nextStep);
  };

  const handleContinueRole = (role) => {
    setSelectedRole(role);
    setSignupBackStep('role-selection');
    goToStep('signup');
  };

  const handleCreateAccount = () => {
    setRoleBackStep('login');
    goToStep('role-selection');
  };

  const handleSignin = () => {
    setLoginBackStep('signup');
    goToStep('login');
  };

  const handlePhoneLoginFromLogin = () => {
    setPhoneBackStep('login');
    goToStep('phone-login');
  };

  const handlePhoneLoginFromSignup = () => {
    setPhoneBackStep('signup');
    goToStep('phone-login');
  };

  const handleForgotPassword = () => {
    setLoginBackStep('login');
    goToStep('forgot-password');
  };

  const handleLoginBack = () => {
    if (loginBackStep) {
      setLoginBackStep(null);
      goToStep(loginBackStep);
      return;
    }

    closeFlow();
  };

  const handlePhoneBack = () => {
    if (phoneBackStep) {
      setPhoneBackStep(null);
      goToStep(phoneBackStep);
      return;
    }

    closeFlow();
  };

  const handleRoleBack = () => {
    if (roleBackStep) {
      setRoleBackStep(null);
      goToStep(roleBackStep);
      return;
    }

    closeFlow();
  };

  const handleSignupBack = () => {
    goToStep(signupBackStep || 'role-selection');
  };

  const handleLoginComplete = (user) => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    if (user?.role === 'worker') {
      navigate('/worker/dashboard', { replace: true });
      return;
    }

    navigate('/customer/dashboard', { replace: true });
  };

  const handleSignupComplete = (user) => {
    const nextRole = user?.role || selectedRole;

    if (nextRole === 'worker') {
      navigate('/worker/register', { replace: true });
      return;
    }

    navigate('/customer/dashboard', { replace: true });
  };

  const handlePhoneOtpRequested = ({ name, phone, role }) => {
    setPhoneFlow({ name, phone, role });
    goToStep('phone-verify');
  };

  switch (step) {
    case 'role-selection':
      return (
        <RoleSelection
          selectedRole={selectedRole}
          onBack={handleRoleBack}
          onContinue={handleContinueRole}
          onGoogleComplete={handleSignupComplete}
        />
      );

    case 'login':
      return (
        <Login
          onBack={handleLoginBack}
          onCreateAccount={handleCreateAccount}
          onLoginComplete={handleLoginComplete}
          onPhoneLogin={handlePhoneLoginFromLogin}
          onForgotPassword={handleForgotPassword}
        />
      );

    case 'signup':
      return (
        <Signup
          role={selectedRole}
          onBack={handleSignupBack}
          onSignin={handleSignin}
          onSignupComplete={handleSignupComplete}
          onPhoneLogin={handlePhoneLoginFromSignup}
        />
      );

    case 'phone-login':
      return (
        <PhoneInput
          onBack={handlePhoneBack}
          onSendOtp={handlePhoneOtpRequested}
          defaultRole={selectedRole}
          isLogin={phoneBackStep === 'login'}
        />
      );

    case 'phone-verify':
      return (
        <PhoneVerification
          onBack={handlePhoneBack}
          onChangePhone={() => goToStep('phone-login')}
          onVerified={handleSignupComplete}
          phoneNumber={phoneFlow.phone}
        />
      );

    case 'forgot-password':
      return (
        <ForgotPassword
          onBack={() => goToStep('login')}
        />
      );

    default:
      return (
        <Login
          onBack={handleLoginBack}
          onCreateAccount={handleCreateAccount}
          onLoginComplete={handleLoginComplete}
          onPhoneLogin={handlePhoneLoginFromLogin}
          onForgotPassword={handleForgotPassword}
        />
      );
  }
}
