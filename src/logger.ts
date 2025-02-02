import { Request, Response, NextFunction } from "express";

/**
 * Logging Middleware
 * Logs the HTTP method, request URL, and timestamp
 */
const logger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  next(); // Pass control to the next middleware
};

export default logger;
