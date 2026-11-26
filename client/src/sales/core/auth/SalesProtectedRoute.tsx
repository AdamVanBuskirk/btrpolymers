import React from 'react';
import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import { useSalesAuth } from './SalesAuthProvider';

interface Props {
  adminOnly?: boolean;
}

export default function SalesProtectedRoute({
  adminOnly = false,
}: Props) {
  const {
    profile,
    loading,
    isAdmin,
  } = useSalesAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="sales-loading">
        <div className="sales-spinner" />
        <p>Loading BTR Sales Platform...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <Navigate
        to="/sales/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/sales" replace />;
  }

  return <Outlet />;
}