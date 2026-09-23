import * as React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Role, RoleEnum } from '../types/auth.dto';

export default function ProtectedRoute({ role }: { role?: Role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role != role) {
    if (user.role == RoleEnum.enum.COMPANY) {
      return <Navigate to="/company/jobs" replace />;
    } else {
      return <Navigate to="/job-seeker/find-job" replace />;
    }
  } 

  return <Outlet />;
}