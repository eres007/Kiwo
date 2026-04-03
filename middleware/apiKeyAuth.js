import { supabase } from '../server.js';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

/**
 * Middleware to authenticate requests using an API Key
 * Looks for 'X-API-Key' header
 */
export async function verifyApiKey(req, res, next) {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return next(); // Move to next middleware (likely JWT) if no API key is provided
  }

  try {
    // Hash the provided key to compare with stored hash
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Search for the key in the database
    const { data: keyData, error } = await supabase
      .from('api_keys')
      .select('user_id, id')
      .eq('key_hash', keyHash)
      .single();

    if (error || !keyData) {
      logger.warn('Invalid API key attempt', { ip: req.ip });
      return res.status(401).json({
        error: {
          message: 'Invalid API Key',
          code: 'UNAUTHORIZED'
        }
      });
    }

    // Attach user to request (simulating JWT behavior for compatibility)
    req.user = { id: keyData.user_id };
    req.apiKeyId = keyData.id;

    // Update last used timestamp (async, don't block)
    supabase.from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', keyData.id)
      .then(() => {});

    logger.info('API Key authenticated', { user_id: keyData.user_id, key_id: keyData.id });
    next();
  } catch (err) {
    logger.error('API Key verification error', { error: err.message });
    return res.status(500).json({
      error: {
        message: 'Internal server error during authentication',
        code: 'INTERNAL_ERROR'
      }
    });
  }
}

/**
 * Combined middleware that allows EITHER JWT or API Key
 */
export async function authOrApiKey(req, res, next) {
  // 1. Try API Key first
  const apiKey = req.header('X-API-Key');
  if (apiKey) {
    return verifyApiKey(req, res, next);
  }

  // 2. Fallback to JWT (existing middleware logic)
  // We'll import verifyJWT inside server.js to avoid circular dependencies
  // or just use it in the route definition.
  next(); 
}
