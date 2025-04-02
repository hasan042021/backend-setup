import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError, NotFoundError } from "@utils/errors";
import logger from "@logger";
import { env } from "@config/env";

interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: any;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Log the error
  logger.error(`${err.message} - ${err.stack}`);

  // Default error
  let statusCode = 500;
  const response: ErrorResponse = {
    success: false,
    message: "Internal Server Error",
  };

  // Handle operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.message = err.message;
    if (err.errors) {
      response.errors = err.errors;
    }
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    switch (err.code) {
      case "P2002":
        response.message = "Duplicate field value entered";
        break;
      case "P2014":
        response.message = "Invalid ID";
        break;
      case "P2003":
        response.message = "Foreign key constraint failed";
        break;
      default:
        response.message = "Database error occurred";
    }
  }

  // Handle validation errors (e.g., from express-validator)
  if (err instanceof Array && err.length > 0 && "msg" in err[0]) {
    statusCode = 400;
    response.message = "Validation Error";
    response.errors = err.map((e) => ({
      field: e.param,
      message: e.msg,
    }));
  }

  // Add stack trace in development
  if (env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};
