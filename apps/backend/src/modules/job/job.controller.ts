import { Router, Request, Response, NextFunction } from "express";
import { validateRequest } from "../../middleware/validate";
import { authenticate, authorize } from "../../middleware/authGuard";
import {
  createJobSchema,
  getJobsQuerySchema,
  updateApplicationStatusSchema,
} from "./job.dto";
import {
  applyJob,
  createJob,
  getCompanyJobApplicants,
  getJobById,
  getJobs,
  getMyApplications,
  updateApplicationStatus,
} from "./job.service";
import { RoleEnum } from "../auth/auth.dto";

export const router = Router();
router.use(authenticate({ fullProfile: true }))

router.get(
  "/jobs",
  validateRequest(getJobsQuerySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = getJobsQuerySchema.safeParse({ query: req.query });
      const jobs = await getJobs(result.success ? result.data : { query: {} });
      
      res.status(200).json({ data: jobs });
    } catch (error) {
      next(error);
    }
  }
);


router.get(
  "/applications/me",
  authorize(RoleEnum.enum.JOB_SEEKER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const applications = await getMyApplications(req.user);
      res.status(200).json({ data: applications });
    } catch (error) {
      next(error);
    }
  }
);


router.get(
  "/jobs/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const job = await getJobById(req.params.id);
      res.status(200).json({ data: job });
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  "/jobs/:id/apply",
  authorize(RoleEnum.enum.JOB_SEEKER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const application = await applyJob(req.user, req.params.id);
      res.status(201).json({
        message: "Application submitted successfully",
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  "/jobs",
  authorize(RoleEnum.enum.COMPANY),
  validateRequest(createJobSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = createJobSchema.safeParse({ body: req.body });
      if (!result.success) throw result.error;

      const job = await createJob(req.user, result.data);
      res.status(201).json({
        message: "Job created successfully",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }
);


router.get(
  "/jobs/:id/applicants",
  authorize(RoleEnum.enum.COMPANY),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const applicants = await getCompanyJobApplicants(req.user, req.params.id);
      res.status(200).json({ data: applicants });
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  "/applications/:applicationId/status",
  authorize(RoleEnum.enum.COMPANY),
  validateRequest(updateApplicationStatusSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = updateApplicationStatusSchema.safeParse({
        params: req.params,
        body: req.body,
      });
      if (!result.success) throw result.error;

      const updatedApplication = await updateApplicationStatus(
        req.user,
        result.data
      );

      res.status(200).json({
        message: "Application status updated successfully",
        data: updatedApplication,
      });
    } catch (error) {
      next(error);
    }
  }
);