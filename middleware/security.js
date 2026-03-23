// Security headers and HTTPS enforcement middleware
import { logger } from '../utils/logger.js';

// HTTPS enforcement middleware
export function enforceHTTPS(req, res, next) {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    logger.warn('HTTP request in production, redirecting to HTTPS', { 
      url: req.originalUrl,
      ip: req.ip 
    });
    return res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
  }
  next();
}

// Security headers middleware
export function securityHeaders(req, res, next) {
  // Strict-Transport-Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');

  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Content-Security-Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-ancestors 'none';"
  );

  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );

  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');

  next();
}

// Request timeout middleware
export function requestTimeout(req, res, next) {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
}

// Request size limit middleware
export function requestSizeLimit(req, res, next) {
  if (req.get('content-length') > 1048576) { // 1MB
    logger.warn('Request exceeds size limit', {
      size: req.get('content-length'),
      ip: req.ip,
      path: req.path
    });
    return res.status(413).json({
      error: {
        message: 'Payload too large',
        code: 'PAYLOAD_TOO_LARGE'
      }
    });
  }
  next();
}

// Disable caching for sensitive endpoints
export function noCache(req, res, next) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}

// CORS preflight handler
export function corsPreflightHandler(req, res, next) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.sendStatus(200);
  }
  next();
}
