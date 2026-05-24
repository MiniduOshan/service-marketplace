import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';
import RoleSelection from './RoleSelection';

export default function AuthFlow({ initialView = 'login', entryMode = 'signin' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(initialView);
  const [selectedRole, setSelectedRole] = useState('customer');

  const [roleBackStep, setRoleBackStep] = useState(null);
  const [loginBackStep, setLoginBackStep] = useState(null);
  const [signupBackStep, setSignupBackStep] = useState('role-selection');

  useEffect(() => {
    setStep(initialView);

    if (initialView === 'role-selection' || entryMode === 'signup') {
      setRoleBackStep(null);
      setSignupBackStep('role-selection');
      setLoginBackStep(null);
      return;
    }

    if (initialView === 'login' || entryMode === 'signin') {
      setRoleBackStep(null);
      setSignupBackStep('role-selection');
      setLoginBackStep(null);
      return;
    }

    setRoleBackStep(null);
    setSignupBackStep('role-selection');
    setLoginBackStep(null);
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

  const handleLoginBack = () => {
    if (loginBackStep) {
      setLoginBackStep(null);
      goToStep(loginBackStep);
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

  const handleLoginComplete = () => {
    navigate('/customer/dashboard', { replace: true });
  };

  const handleSignupComplete = () => {
    if (selectedRole === 'worker') {
      navigate('/worker/register', { replace: true });
      return;
    }

    navigate('/customer/dashboard', { replace: true });
  };

  switch (step) {
    case 'role-selection':
      return (
        <RoleSelection
          selectedRole={selectedRole}
          onBack={handleRoleBack}
          onContinue={handleContinueRole}
        />
      );

    case 'login':
      return (
        <Login
          onBack={handleLoginBack}
          onCreateAccount={handleCreateAccount}
          onLoginComplete={handleLoginComplete}
        />
      );

    case 'signup':
      return (
        <Signup
          role={selectedRole}
          onBack={handleSignupBack}
          onSignin={handleSignin}
          onSignupComplete={handleSignupComplete}
        />
      );

    default:
      return (
        <Login
          onBack={handleLoginBack}
          onCreateAccount={handleCreateAccount}
          onLoginComplete={handleLoginComplete}
        />
      );
  }
}
