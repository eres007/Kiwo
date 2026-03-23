// Global error handler middleware

export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', {
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Determine status code
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message;

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error';
  }

  // Handle specific error types
  if (err.message.includes('FOREIGN KEY constraint')) {
    statusCode = 400;
    code = 'INVALID_REFERENCE';
    message = 'Invalid reference to related resource';
  }

  if (err.message.includes('duplicate key')) {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    message = 'Resource already exists';
  }

  if (err.message.includes('not found')) {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    error: {
      message,
      code,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && { details: err.message }),
    },
  });
}

// 404 handler
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      code: 'NOT_FOUND',
      path: req.path,
      method: req.method,
    },
  });
}

// Async error wrapper
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
