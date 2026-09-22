import { DefaultModelRow } from "@prisma/orm-postgres/orm-client";
import * as z from "zod";
import { Contract } from "../../../prisma/contract";

type jobSeekerProfile = DefaultModelRow<Contract, "JobSeekerProfile", "public">
type companyProfile = DefaultModelRow<Contract, "CompanyProfile", "public">
export type User = DefaultModelRow<Contract, "User", "public"> & {
  jobSeekerProfile?: jobSeekerProfile,
  companyProfile?: companyProfile
}

export const RoleEnum = z.enum(['JOB_SEEKER', 'COMPANY']);

export const jobSeekerProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  resumeUrl: z.url().nullable().optional(),
});

export const companyProfileSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  website: z.url().nullable().optional(),
});

const baseBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  body: z.discriminatedUnion('role', [
    baseBodySchema.extend({
      role: z.literal(RoleEnum.enum.JOB_SEEKER),
      jobSeekerProfile: jobSeekerProfileSchema,
    }),
    baseBodySchema.extend({
      role: z.literal(RoleEnum.enum.COMPANY),
      companyProfile: companyProfileSchema,
    }),
  ]),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8)
  })
});
export type LoginDto = z.infer<typeof loginSchema>;

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName?: string | null;
    role: string;
  };
  token: string;
}


