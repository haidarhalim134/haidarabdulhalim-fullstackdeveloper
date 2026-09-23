// src/components/root-redirect.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/authContext' // Adjust import path if necessary
import { RoleEnum } from '../types/auth.dto'

export default function RootRedirect() {
  const { user, loading } = useAuth() 

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === RoleEnum.enum.JOB_SEEKER) {
    return <Navigate to="/job-seeker/find-job" replace />
  }

  if (user.role === RoleEnum.enum.COMPANY) {
    return <Navigate to="/company/jobs" replace />
  }

  return <Navigate to="/login" replace />
}