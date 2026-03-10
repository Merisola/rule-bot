const errorHandler = (err, req, res, next) => {
  console.error("### SYSTEM ERROR LOG ###");
  console.error(err.stack);

  // Determine status code (default to 500)
  const statusCode = err.status || 500;

  // Custom messages for specific errors
  let message = err.message || "An unexpected neural disruption occurred.";

  if (err.code === "ECONNREFUSED") message = "Database connection lost.";
  if (err.name === "TimeoutError") message = "AI Synthesis timed out.";

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
