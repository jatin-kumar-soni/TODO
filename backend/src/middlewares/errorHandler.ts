import { NextFunction, Request, Response } from "express";
import { logError } from "../services/logger";

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = async (err: Error, req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Unexpected error";
  await logError(err.message, err.stack, { path: req.path, method: req.method, body: req.body, query: req.query });
  res.status(status).json({ message, details: err instanceof ApiError ? err.details : undefined });
};

