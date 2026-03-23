// Rate limiting middleware
import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

// Stricter limiter for memory capture (AI calls are expensive)
export const captureLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit to 30 captures per minute per IP
  message: 'Too many memory captures, please slow down.',
  skipSuccessfulRequests: false,
});

// Limiter for sync operations
export const syncLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit to 10 syncs per minute per IP
  message: 'Too many sync requests, please slow down.',
});

// Per-user rate limiter (using user_id from request)
export function createUserLimiter(options = {}) {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    keyGenerator: (req) => {
      // Use user_id if available, otherwise use IP
      return req.body?.user_id || req.query?.user_id || req.ip;
    },
    message: 'Too many requests, please try again later.',
    skip: (req) => {
      // Skip if no user_id
      return !req.body?.user_id && !req.query?.user_id;
    },
  });
}
