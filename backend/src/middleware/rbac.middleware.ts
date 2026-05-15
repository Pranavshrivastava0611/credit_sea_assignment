import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { ApiError } from "../utils/ApiError";
import { UserRole } from "../models/User.model";

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!roles.includes(req.user.role as UserRole)) {
      throw new ApiError(
        403,
        `Access denied. Role '${req.user.role}' is not authorized for this resource.`
      );
    }
    next();
  };
};
