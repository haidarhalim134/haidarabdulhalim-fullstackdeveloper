// src/lib/jobs.ts

import { api } from "@/src/lib/api";
import type {
  Application,
  ApplicationStatus,
  Job,
  JobType,
} from "@/src/types/job.dto";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface JobFilters {
  title?: string;
  location?: string;
  type?: JobType;
  fromCompany?: string
}

export interface CreateJobInput {
  title: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  type: JobType;
  description: string;
}

export async function getJobs(filters: JobFilters = {}) {
  const params = new URLSearchParams();

  if (filters.title) params.set("title", filters.title);
  if (filters.location) params.set("location", filters.location);
  if (filters.type) params.set("type", filters.type);

  const query = params.toString();

  return api<ApiResponse<Job[]>>(`/job/jobs${query ? `?${query}` : ""}`);
}

export async function getJob(id: string) {
  return api<ApiResponse<Job>>(`/job/jobs/${id}`);
}

export async function applyToJob(jobId: string) {
  return api<ApiResponse<Application>>(`/job/jobs/${jobId}/apply`, {
    method: "POST",
  });
}

export async function getMyApplications() {
  return api<ApiResponse<Application[]>>("/job/applications/me");
}

export async function createJob(input: CreateJobInput) {
  return api<ApiResponse<Job>>("/job/jobs", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getJobApplicants(jobId: string) {
  return api<ApiResponse<Application[]>>(`/job/jobs/${jobId}/applicants`);
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  return api<ApiResponse<Application>>(
    `/job/applications/${applicationId}/status`,
    {
      method: "POST",
      body: JSON.stringify({ status }),
    }
  );
}