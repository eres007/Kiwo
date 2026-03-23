import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import memoryRoutes from './routes/memory.js';
import authRoutes from './routes/auth.js';
import complianceRoutes from './routes/compliance.js';
import { initializeFileSync } from './services/fileSync.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { verifyJWT } from './middleware/auth.js';
import { maskResponseData } from './middleware/encryption.js';
import { validateSecrets } from './middleware/secrets.js';
import { enforceHTTPS, securityHeaders, requestTimeout, requestSizeLimit, noCache } from './middleware/security.js';
import { performanceMonitoring, getHealthMetrics, MetricsCollector } from './middleware/monitoring.js';
import { checkBackupHealth, generateBackupReport } from './services/backupService.js';
import { logger, requestLogger } from './utils/logger.js';

dotenv.config({ path: '.env.local' });

// Validate secrets before starting
try {
  validateSecrets();
} catch (error) {
  logger.error('Secret validation failed', { error: error.message });
  process.exit(1);
}

// Initialize metrics collector
const metricsCollector = new MetricsCollector();

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Supabase
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Security middleware
app.use(enforceHTTPS);
app.use(securityHeaders);
app.use(requestTimeout);
app.use(requestSizeLimit);

// Request logging and monitoring
app.use(requestLogger);
app.use(performanceMonitoring);

// Response masking (mask sensitive data in responses)
app.use(maskResponseData);

// Rate limiting
app.use('/api/', apiLimiter);

// Health check (no rate limiting)
app.get('/health', (req, res) => {
  res.json(getHealthMetrics());
});

// Monitoring endpoints
app.get('/api/monitoring/metrics', verifyJWT, (req, res) => {
  res.json(metricsCollector.getMetrics());
});

app.get('/api/monitoring/backup-health', verifyJWT, async (req, res, next) => {
  try {
    const health = await checkBackupHealth();
    res.json(health);
  } catch (error) {
    res.json({
      status: 'not_configured',
      message: 'Backup system not yet configured',
    });
  }
});

app.get('/api/monitoring/backup-report', verifyJWT, async (req, res, next) => {
  try {
    const report = await generateBackupReport();
    res.json(report);
  } catch (error) {
    next(error);
  }
});

// Auth routes (no JWT required for signup/login)
app.use('/api/auth', authRoutes);

// Compliance routes (GDPR, Privacy)
app.use('/api/compliance', complianceRoutes);

// Protected routes (JWT required)
app.use('/api/memory', verifyJWT, memoryRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Initialize file sync service
initializeFileSync();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`MemoryLayer API started`, {
    port: PORT,
    environment: NODE_ENV,
    version: '1.0.0',
  });
});
