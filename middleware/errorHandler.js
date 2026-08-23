// Global error handler -- catches anything passed to next(err)
function globalErrorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || "ServerError",
    message: err.message || "Something went wrong on the server.",
  });
}

// Catches requests to routes that don't exist
function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: "NotFound",
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

module.exports = { globalErrorHandler, notFoundHandler };
