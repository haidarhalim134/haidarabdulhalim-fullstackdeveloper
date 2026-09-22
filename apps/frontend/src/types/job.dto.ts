// src/types/job.ts

export type Role = "JOB_SEEKER" | "COMPANY";

export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE"
  | "REMOTE";

export type ApplicationStatus =
  | "APPLIED"
  | "REVIEWING"
  | "SHORTLISTED"
  | "REJECTED"
  | "ACCEPTED";

export interface CompanyProfile {
  id: string;
  companyName: string;
  website?: string | null;
}

export interface Job {
  id: string;
  companyProfileId: string;
  title: string;
  location: string;
  salaryMin?: string | number | null;
  salaryMax?: string | number | null;
  type: JobType;
  description: string;
  createdAt: string;
  updatedAt: string;
  company?: CompanyProfile;
  applications?: Application[];
}

export interface JobSeekerProfile {
  id: string;
  fullName: string;
  phone?: string | null;
  resumeUrl?: string | null;
}

export interface Application {
  id: string;
  jobId: string;
  jobSeekerProfileId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  jobSeekerProfile?: JobSeekerProfile;
}

export type ApplicationHistory = {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  createdAt: string;
};