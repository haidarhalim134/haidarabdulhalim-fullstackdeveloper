
import { Request } from "express";
import { User } from "../modules/auth/auth.dto";

export type AuthenticatedRequest = Request & {
    user: User
}