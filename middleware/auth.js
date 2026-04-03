// JWT Authentication Middleware
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { supabase } from '../server.js';
import { logger } from '../utils/logger.js';

// Verify JWT token
export function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: {
          message: 'Missing authorization header',
          code: 'MISSING_AUTH_HEADER',
        },
      });
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: {
          message: 'Invalid authorization header format. Use: Bearer <token>',
          code: 'INVALID_AUTH_FORMAT',
        },
      });
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    logger.info('JWT verified', { user_id: req.user.id });
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED',
          expiredAt: error.expiredAt,
        },
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN',
        },
      });
    }

    logger.error('JWT verification failed', { error: error.message });
    res.status(401).json({
      error: {
        message: 'Authentication failed',
        code: 'AUTH_FAILED',
      },
    });
  }
}

// Optional JWT verification (doesn't fail if missing)
export function optionalJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
}

// Generate JWT token
export function generateToken(userId, email, expiresIn = '24h') {
  try {
    const token = jwt.sign(
      {
        sub: userId,
        email: email,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    return token;
  } catch (error) {
    logger.error('Token generation failed', { error: error.message });
    throw error;
  }
}

/**
 * Verify API Key token from X-API-Key header
 */
export async function verifyApiKey(req, res, next) {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({
      error: { message: 'Missing API Key', code: 'MISSING_API_KEY' }
    });
  }

  try {
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const { data: keyData, error } = await supabase
      .from('api_keys')
      .select('user_id, id')
      .eq('key_hash', keyHash)
      .single();

    if (error || !keyData) {
      return res.status(401).json({
        error: { message: 'Invalid API Key', code: 'INVALID_API_KEY' }
      });
    }

    req.user = { id: keyData.user_id };
    req.apiKeyId = keyData.id;

    // Async update last used
    supabase.from('api_keys').update({ last_used: new Date().toISOString() }).eq('id', keyData.id).then(() => {});

    next();
  } catch (err) {
    logger.error('API Key verification failed', { error: err.message });
    res.status(500).json({ error: { message: 'Auth internal error' } });
  }
}

/**
 * Combined Auth Middleware: Supports both JWT (Bearer) and API Key (X-API-Key)
 */
export async function authenticate(req, res, next) {
  console.log('Incoming Headers:', JSON.stringify(req.headers));
  
  // Try API Key first
  const apiKey = req.header('X-API-Key') || req.header('x-api-key');
  if (apiKey) {
    return verifyApiKey(req, res, next);
  }
  
  // Fallback to JWT
  return verifyJWT(req, res, next);
}
