// Encryption middleware for data at rest
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  logger.warn('ENCRYPTION_KEY not set or too short. Using JWT_SECRET as fallback.');
}

// Derive a 32-byte key from the encryption key
function getEncryptionKey() {
  const key = ENCRYPTION_KEY || 'default-insecure-key-change-this';
  return crypto.createHash('sha256').update(key).digest();
}

// Encrypt sensitive data
export function encryptData(data) {
  try {
    if (!data) return null;

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', getEncryptionKey(), iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    logger.error('Encryption error', { error: error.message });
    throw error;
  }
}

// Decrypt sensitive data
export function decryptData(encryptedData) {
  try {
    if (!encryptedData) return null;

    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', getEncryptionKey(), iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    logger.error('Decryption error', { error: error.message });
    throw error;
  }
}

// Mask sensitive data in logs
export function maskSensitiveData(data) {
  if (!data) return data;

  const masked = { ...data };
  
  // Mask email
  if (masked.email) {
    const [name, domain] = masked.email.split('@');
    masked.email = `${name.substring(0, 2)}***@${domain}`;
  }

  // Mask password
  if (masked.password) {
    masked.password = '***MASKED***';
  }

  // Mask password_hash
  if (masked.password_hash) {
    masked.password_hash = '***MASKED***';
  }

  // Mask tokens
  if (masked.token) {
    masked.token = masked.token.substring(0, 20) + '...';
  }

  // Mask content (first 50 chars)
  if (masked.content && typeof masked.content === 'string') {
    if (masked.content.length > 50) {
      masked.content = masked.content.substring(0, 50) + '...';
    }
  }

  return masked;
}

// Middleware to mask sensitive data in responses
export function maskResponseData(req, res, next) {
  const originalJson = res.json;

  res.json = function(data) {
    // Don't mask tokens in successful responses (they're needed by clients)
    // Only mask in error responses
    if (data && data.error) {
      data.error = maskSensitiveData(data.error);
    }
    if (data && data.user) {
      data.user = maskSensitiveData(data.user);
    }

    return originalJson.call(this, data);
  };

  next();
}

// Hash sensitive data (one-way)
export function hashData(data) {
  try {
    return crypto.createHash('sha256').update(data).digest('hex');
  } catch (error) {
    logger.error('Hash error', { error: error.message });
    throw error;
  }
}

// Generate random token
export function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Verify data integrity with HMAC
export function createHMAC(data) {
  try {
    return crypto
      .createHmac('sha256', getEncryptionKey())
      .update(JSON.stringify(data))
      .digest('hex');
  } catch (error) {
    logger.error('HMAC creation error', { error: error.message });
    throw error;
  }
}

// Verify HMAC
export function verifyHMAC(data, hmac) {
  try {
    const computed = createHMAC(data);
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hmac));
  } catch (error) {
    logger.error('HMAC verification error', { error: error.message });
    return false;
  }
}
