import { Role } from "../middlewares/checkAuth.middleware.ts"; 

declare global {
  namespace Express {
    interface Request {
      user?: {
        role: Role;
      };
    }
  }
}
