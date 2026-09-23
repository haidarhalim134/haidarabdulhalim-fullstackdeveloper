import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../../prisma/db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface AuthenticateOptions {
  fullProfile?: boolean;
}

export const authenticate = (options: AuthenticateOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let token: string | undefined;

      if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        res.status(401).json({
          success: false,
          error: 'Not authorized to access this route',
        });
        return;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        if (!decoded.userId) {
          res.status(401).json({
            success: false,
            error: 'Not authorized to access this route',
          });
          return
        }

        let query = await db.orm.public.User.where({
          id: decoded.userId 
        });
        if (options.fullProfile) {
          query = query.include('companyProfile').include('jobSeekerProfile')
        }
        const user = await query.first()

        if (!user) {
          res.status(401).json({
            success: false,
            error: 'User not found',
          });
          return;
        }
        
        req.user = user as any;
        next();
      } catch (error) {
        res.status(401).json({
          success: false,
          error: 'Not authorized to access this route',
        });
        return;
      }
    } catch (error) {
      next(error);
    }
  };
};
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`,
      });
      return;
    }

    next();
  };
};

// Convenience middleware for admin-only routes
export const requireAdmin = authorize('ADMIN');