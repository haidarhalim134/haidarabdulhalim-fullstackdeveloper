import * as z from "zod";

export const JobTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
  "REMOTE",
]);

export const ApplicationStatusEnum = z.enum([
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
]);

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Job title is required"),
    location: z.string().min(1, "Location is required"),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    type: JobTypeEnum,
    description: z.string().min(1, "Description is required"),
  }),
});
export type CreateJobDto = z.infer<typeof createJobSchema>;

export const getJobsQuerySchema = z.object({
  query: z.object({
    title: z.string().optional(),
    location: z.string().optional(),
    type: JobTypeEnum.optional(),
    fromCompany: z.string().optional()
  }),
});
export type GetJobsQueryDto = z.infer<typeof getJobsQuerySchema>;

export const updateApplicationStatusSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid(),
  }),
  body: z.object({
    status: ApplicationStatusEnum,
  }),
});
export type UpdateApplicationStatusDto = z.infer<typeof updateApplicationStatusSchema>;

export const getApplicationStatusHistorySchema = z.object({
  params: z.object({
    applicationId: z.string().uuid(),
  }),
});
export type getApplicationStatusHistoryDto = z.infer<typeof getApplicationStatusHistorySchema>;