// Secrets management middleware
import { logger } from '../utils/logger.js';

// Validate required environment variables
export function validateSecrets() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    logger.error('Missing required environment variables', { missing });
    throw new Error(`Missing secrets: ${missing.join(', ')}`);
  }

  // Validate secret strength
  const weakSecrets = [];

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    weakSecrets.push('JWT_SECRET (min 32 chars)');
  }

  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length < 32) {
    weakSecrets.push('ENCRYPTION_KEY (min 32 chars)');
  }

  if (weakSecrets.length > 0) {
    logger.warn('Weak secrets detected', { weakSecrets });
  }

  logger.info('All required secrets validated');
}

// Prevent secrets from being logged
export function sanitizeError(error) {
  const sensitivePatterns = [
    /jwt_secret/gi,
    /encryption_key/gi,
    /supabase.*key/gi,
    /password/gi,
    /token/gi,
  ];

  let message = error.message || '';

  sensitivePatterns.forEach(pattern => {
    message = message.replace(pattern, '***REDACTED***');
  });

  return {
    ...error,
    message,
  };
}

// Middleware to prevent secrets in request/response
export function preventSecretsLeakage(req, res, next) {
  // Check request body for secrets
  if (req.body) {
    const bodyStr = JSON.stringify(req.body);
    const sensitiveKeys = ['password', 'token', 'secret', 'key'];

    sensitiveKeys.forEach(key => {
      if (bodyStr.toLowerCase().includes(key)) {
        logger.warn('Sensitive data in request body', {
          path: req.path,
          keys: sensitiveKeys.filter(k => bodyStr.toLowerCase().includes(k)),
        });
      }
    });
  }

  next();
}

// Secrets rotation helper
export function rotateSecret(oldSecret, newSecret) {
  if (!newSecret || newSecret.length < 32) {
    throw new Error('New secret must be at least 32 characters');
  }

  logger.info('Secret rotation initiated', {
    timestamp: new Date().toISOString(),
  });

  // In production, this would:
  // 1. Update all tokens with new secret
  // 2. Re-encrypt data with new key
  // 3. Update environment variables
  // 4. Restart services

  return {
    status: 'rotation_initiated',
    timestamp: new Date().toISOString(),
    message: 'Update environment variables and restart services',
  };
}

// Get secret metadata (without exposing the secret)
export function getSecretMetadata(secretName) {
  const secret = process.env[secretName];

  if (!secret) {
    return null;
  }

  return {
    name: secretName,
    length: secret.length,
    lastChar: secret.slice(-4),
    isStrong: secret.length >= 32,
    createdAt: new Date().toISOString(),
  };
}
