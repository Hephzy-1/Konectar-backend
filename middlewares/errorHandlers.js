import { ErrorResponse } from "../utils/errorResponse.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  // Default error message and status code
  error.message = err.message || 'Server Error';
  error.statusCode = err.statusCode || 500;

  // Unique constraint violation (PostgreSQL duplicate key)
  if (err.code === '23505') {
    const message = "Duplicate key value entered";
    error = new ErrorResponse(message, 400);
  }

  // Foreign key violation
  if (err.code === '23503') {
    const message = `Foreign key constraint failed for value: ${err.detail}`;
    error = new ErrorResponse(message, 400);
  }

  // Invalid input syntax (e.g., invalid UUID)
  if (err.code === '22P02') {
    const message = `Invalid input syntax for type: ${err.detail}`;
    error = new ErrorResponse(message, 400);
  }

  // General database error
  if (err.code) {
    const message = `Database error occurred: ${err.message}`;
    error = new ErrorResponse(message, 500);
  }

  // Send the response
  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    details: error.details
  });
};