// Monitoring and alerting middleware
import { logger } from '../utils/logger.js';

// Performance monitoring
export function performanceMonitoring(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;

    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        path: req.path,
        duration: `${duration}ms`,
        status,
      });
    }

    // Log errors
    if (status >= 400) {
      logger.warn('HTTP error', {
        method: req.method,
        path: req.path,
        status,
        duration: `${duration}ms`,
      });
    }

    // Log successful requests
    if (status < 400) {
      logger.info('Request completed', {
        method: req.method,
        path: req.path,
        status,
        duration: `${duration}ms`,
      });
    }
  });

  next();
}

// Error tracking
export function errorTracking(err, req, res, next) {
  const errorData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    status: err.statusCode || 500,
    message: err.message,
    stack: err.stack,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  // Log to file
  logger.error('Error tracked', errorData);

  // In production, send to Sentry
  if (process.env.SENTRY_DSN) {
    // Sentry.captureException(err, { extra: errorData });
  }

  next(err);
}

// Health check endpoint data
export function getHealthMetrics() {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 60)} minutes`,
    memory: {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
    },
    environment: process.env.NODE_ENV,
  };
}

// Request metrics collector
export class MetricsCollector {
  constructor() {
    this.requests = {
      total: 0,
      success: 0,
      errors: 0,
      avgDuration: 0,
    };
    this.errors = [];
  }

  recordRequest(method, path, status, duration) {
    this.requests.total++;

    if (status < 400) {
      this.requests.success++;
    } else {
      this.requests.errors++;
    }

    // Update average duration
    this.requests.avgDuration =
      (this.requests.avgDuration * (this.requests.total - 1) + duration) /
      this.requests.total;
  }

  recordError(error, context) {
    this.errors.push({
      timestamp: new Date().toISOString(),
      error: error.message,
      context,
    });

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors.shift();
    }
  }

  getMetrics() {
    return {
      requests: this.requests,
      errors: {
        total: this.errors.length,
        recent: this.errors.slice(-10),
      },
      timestamp: new Date().toISOString(),
    };
  }

  reset() {
    this.requests = {
      total: 0,
      success: 0,
      errors: 0,
      avgDuration: 0,
    };
    this.errors = [];
  }
}

// Alert thresholds
export const ALERT_THRESHOLDS = {
  errorRate: 0.05, // 5% error rate
  responseTime: 5000, // 5 seconds
  memoryUsage: 0.9, // 90% of heap
  cpuUsage: 0.8, // 80% CPU
};

// Check if alert should be triggered
export function checkAlertThresholds(metrics) {
  const alerts = [];

  const errorRate = metrics.requests.errors / metrics.requests.total;
  if (errorRate > ALERT_THRESHOLDS.errorRate) {
    alerts.push({
      type: 'HIGH_ERROR_RATE',
      value: `${(errorRate * 100).toFixed(2)}%`,
      threshold: `${(ALERT_THRESHOLDS.errorRate * 100).toFixed(2)}%`,
    });
  }

  if (metrics.requests.avgDuration > ALERT_THRESHOLDS.responseTime) {
    alerts.push({
      type: 'SLOW_RESPONSE_TIME',
      value: `${metrics.requests.avgDuration.toFixed(0)}ms`,
      threshold: `${ALERT_THRESHOLDS.responseTime}ms`,
    });
  }

  return alerts;
}
