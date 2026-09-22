import * as React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import ProtectedRoute from './components/protected-route'
import { AuthProvider } from './context/authContext'


import { JobListPage } from "@/src/pages/job-seeker/job-list-page";
import { JobDetailPage } from "@/src/pages/job-seeker/job-detail-page";
import { MyApplicationsPage } from "@/src/pages/job-seeker/my-applications-page";

import { CompanyJobsPage } from "@/src/pages/company/company-jobs-page";
import { CreateJobPage } from "@/src/pages/company/create-job-page";
import { ApplicantsPage } from "@/src/pages/company/applicants-page";
import { RoleEnum } from './types/auth.dto'
import Navbar from './components/navbar'
import ApplicationStatusHistoryPage from './pages/application-history'

export default function App() {

  return (
    <AuthProvider>
      <Navbar />
      <div className="p-6">
        {/* <nav className="flex gap-4 mb-6">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link>
          <Link to="/about" className="text-blue-500 hover:underline">About</Link>
        </nav> */}

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute/>}>
            <Route path="/application/:applicationId" element={<ApplicationStatusHistoryPage />} />
          </Route>

          <Route element={<ProtectedRoute role={RoleEnum.enum.JOB_SEEKER}/>}>
            <Route path="/job-seeker/find-job" element={<JobListPage />} />
            <Route path="/job-seeker/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/job-seeker/applications" element={<MyApplicationsPage />} />
          </Route>

          <Route element={<ProtectedRoute role={RoleEnum.enum.COMPANY}/>}>
            <Route path="/company/jobs" element={<CompanyJobsPage />} />
            <Route path="/company/jobs/new" element={<CreateJobPage />} />
            <Route path="/company/jobs/:jobId/applicants" element={<ApplicantsPage />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}