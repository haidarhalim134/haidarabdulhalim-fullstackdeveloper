import { Router, Request, Response, NextFunction } from "express";
import { registerSchema } from "./auth.dto";
import { ValidationError } from "../../lib/errors";
import { registerUser } from "./auth.service";
import { validateRequest } from "../../middleware/validate";

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
