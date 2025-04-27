import { AppError } from "../utils/index";


export const checkAuth = (role) => {
  return (req, res, next) => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        throw new AppError(401, "Access token not found.");
      }

      const userRole = req.body?.role;

      if (!userRole || userRole !== role) {
        throw new AppError(403, "Access denied: Invalid role.");
      }

      // Optional: Attach user role and token to req if needed
      req.user = { role: userRole };

      next();
    } catch (error) {
      const status = error instanceof AppError ? error.statusCode : 401;
      res.status(status).json({
        success: false,
        message:
          error instanceof AppError
            ? error.message
            : "Unauthorized: missing or invalid token.",
      });
    }
  };
};
