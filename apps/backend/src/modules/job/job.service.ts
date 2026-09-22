import { db } from "../../../prisma/db";
import { AppError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../lib/errors";
import { RoleEnum } from "../auth/auth.dto";
import { User } from "../user/user.dto";
import {
  ApplicationStatusEnum,
  CreateJobDto,
  getApplicationStatusHistoryDto,
  GetJobsQueryDto,
  UpdateApplicationStatusDto,
} from "./job.dto";

export const getJobs = async (input: GetJobsQueryDto) => {
  const { title, location, type, fromCompany } = input.query;

  const companyFilter: any = {}
  if (fromCompany) companyFilter.id = fromCompany

  let query = await db.orm.public.Job
    .include('company', (company) =>
      company.where(companyFilter)
    ).orderBy([(u) => u.createdAt.desc() ])
    
  if (title) 
    query = query.where(u => u.title.ilike(`%${title}%`))
  if (location)
    query = query.where(u => u.location.ilike(location))
  if (type) 
    query = query.where({ type })

  const jobs = query.all();

  return jobs;
};

export const getJobById = async (jobId: string) => {
  const job = await db.orm.public.Job.where({ id: jobId })
    .include('company')
    .first();

  if (!job) {
    throw new NotFoundError("Job");
  }

  return job;
};

export const applyJob = async (user: User, jobId: string) => {
  const job = await db.orm.public.Job.where({ id: jobId }).first();
  if (!job) {
    throw new NotFoundError("Job");
  }

  if (user.role != RoleEnum.enum.JOB_SEEKER) {
    return
  }

  // handled by composite unique, skip to save network roundtrip
  // const existingApplication = await db.orm.public.Application.where({
  //   jobId,
  //   jobSeekerProfileId: user.jobSeekerProfile!.id,
  // }).first();

  // if (existingApplication) {
  //   throw new AppError("You have already applied for this job", 400);
  // }

  return await db.transaction(async (tx: any) => {
    const application = await tx.orm.public.Application.create({
      jobId,
      jobSeekerProfileId: user.jobSeekerProfile!.id,
      status: ApplicationStatusEnum.enum.APPLIED,
    });

    await tx.orm.public.ApplicationHistory.create({
      applicationId: application.id,
      status: ApplicationStatusEnum.enum.APPLIED,
    });

    return application;
  });
};


export const getMyApplications = async (user: User) => {
  const applications = await db.orm.public.Application.where({
    jobSeekerProfileId: user.jobSeekerProfile!.id,
  })
    .include('statusHistories')
    .include('job')
    .orderBy([(u) => u.createdAt.desc()])
    .all();

  return applications;
};


export const createJob = async (user: User, input: CreateJobDto) => {
  const body = input.body

  const job = await db.orm.public.Job.create({
    companyProfileId: user.companyProfile!.id,

    title: body.title,
    location: body.location,
    salaryMin: body.salaryMin,
    salaryMax: body.salaryMax,
    type: body.type,
    description: body.description,
  });

  return job;
};


export const getCompanyJobApplicants = async (user: User, jobId: string) => {
  const job = await db.orm.public.Job.where({
    id: jobId,
    companyProfileId: user.companyProfile!.id,
  }).first();

  if (!job) {
    throw new NotFoundError("Job");
  }

  const applications = await db.orm.public.Application.where({ jobId })
    .include('jobSeekerProfile')
    .orderBy([(u) => u.createdAt.desc()])
    .all();

  return applications;
};


export const updateApplicationStatus = async (
  user: User,
  input: UpdateApplicationStatusDto
) => {
  const { applicationId } = input.params;
  const { status } = input.body;

  const application = await db.orm.public.Application.where({
    id: applicationId,
  })
    .include('job')
    .first();

  if (!application) {
    throw new NotFoundError("Application");
  }

  if (application.job.companyProfileId !== user.companyProfile!.id) {
    throw new ForbiddenError("You do not have permission to modify this application");
  }

  return await db.transaction(async (tx: any) => {
    const updatedApplication = await db.orm.public.Application
      .where({ id: applicationId })
      .update({
        status
      });

    await tx.orm.public.ApplicationHistory.create({
      applicationId,
      status,
    });

    return updatedApplication;
  });
};

export const getApplicationStatusHistory = async (
  user: User,
  input: getApplicationStatusHistoryDto
) => {
  const { applicationId } = input.params;
  const application = await db.orm.public.Application.where({
    id: applicationId,
  })
    .include('job')
    .include('statusHistories')
    .first();

  if (!application) {
    throw new NotFoundError("Application");
  }

  const ownApplication = user.role == RoleEnum.enum.JOB_SEEKER && application?.jobSeekerProfileId == user.jobSeekerProfile!.id
  const ownJob = user.role == RoleEnum.enum.COMPANY && application?.job.companyProfileId == user.companyProfile!.id
  if (!ownApplication && !ownJob) {
    throw new UnauthorizedError('Unauthorized access');
  }

  return application.statusHistories
}