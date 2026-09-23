export interface JobSeekerProfile {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: "JOB_SEEKER" | "COMPANY" | string;
  createdAt: string;
  updatedAt: string;
  jobSeekerProfile?: JobSeekerProfile | null;
  companyProfile?: CompanyProfile | null;
}