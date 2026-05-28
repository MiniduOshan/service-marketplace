import React from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredSessionToken, getStoredSessionUser } from '../../lib/api';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = getStoredSessionToken();
  const user = getStoredSessionUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user's actual role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'worker') {
      return <Navigate to="/worker/dashboard" replace />;
    } else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  return children;
}
