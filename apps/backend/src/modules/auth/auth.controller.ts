import { Router, Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "./auth.dto";
import { ValidationError } from "../../lib/errors";
import { loginUser, registerUser } from "./auth.service";
import { validateRequest } from "../../middleware/validate";
import { authenticate } from "../../middleware/authGuard";

export const router = Router();

router.post("/register", validateRequest(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = registerSchema.safeParse({ body: req.body});
    if (!result.success) {
      throw new ValidationError(result.error);
    }

    const user = await registerUser(result.data);

    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({
        message: error.message,
        errors: error.error.flatten().fieldErrors,
      });
    }

    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    next(error);
  }
});

router.post("/login", validateRequest(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = loginSchema.safeParse({ body: req.body});
    if (!result.success) {
      throw new ValidationError(result.error);
    }

    const userAndToken = await loginUser(result.data);

    res.status(200).json(userAndToken);
  } catch (error: any) {
    next(error);
  }
});

router.get("/getCurrentUser", authenticate, async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(req.user)
})