// Authentication Routes
import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabase } from '../server.js';
import { generateToken, verifyJWT } from '../middleware/auth.js';
import { maskSensitiveData, maskResponseData } from '../middleware/encryption.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Apply response masking to all auth routes
router.use(maskResponseData);

// POST /api/auth/signup - Create new user account
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        error: {
          message: 'email, password, and name are required',
          code: 'MISSING_FIELDS',
        },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: {
          message: 'Invalid email format',
          code: 'INVALID_EMAIL',
        },
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: {
          message: 'Password must be at least 8 characters',
          code: 'WEAK_PASSWORD',
        },
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        error: {
          message: 'User with this email already exists',
          code: 'USER_EXISTS',
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
          name,
          created_at: new Date().toISOString(),
        },
      ])
      .select('id, email, name')
      .single();

    if (createError) {
      logger.error('User creation failed', { error: createError.message });
      return res.status(500).json({
        error: {
          message: 'Failed to create user',
          code: 'USER_CREATION_FAILED',
        },
      });
    }

    // Generate token
    const token = generateToken(newUser.id, newUser.email);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(newUser.email, newUser.name, 'TempPassword123!')
      .catch(err => logger.error('Welcome email failed', { error: err.message }));

    logger.info('User created successfully', { user_id: newUser.id, email: newUser.email });

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      token,
      expiresIn: '24h',
    });
  } catch (error) {
    logger.error('Signup error', { error: error.message });
    next(error);
  }
});

// POST /api/auth/login - Authenticate user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: 'email and password are required',
          code: 'MISSING_FIELDS',
        },
      });
    }

    // Find user
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('id, email, name, password_hash')
      .eq('email', email)
      .single();

    if (queryError || !user) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      logger.warn('Failed login attempt', { email });
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    logger.info('User logged in', { user_id: user.id, email: user.email });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      expiresIn: '24h',
    });
  } catch (error) {
    logger.error('Login error', { error: error.message });
    next(error);
  }
});

// POST /api/auth/refresh - Refresh JWT token
router.post('/refresh', verifyJWT, async (req, res, next) => {
  try {
    const { id, email } = req.user;

    // Generate new token
    const token = generateToken(id, email);

    logger.info('Token refreshed', { user_id: id });

    res.json({
      success: true,
      token,
      expiresIn: '24h',
    });
  } catch (error) {
    logger.error('Token refresh error', { error: error.message });
    next(error);
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', verifyJWT, async (req, res, next) => {
  try {
    const { id } = req.user;

    // Get user details
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        },
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error('Get user error', { error: error.message });
    next(error);
  }
});

// POST /api/auth/logout - Logout user (client-side token deletion)
router.post('/logout', verifyJWT, (req, res) => {
  try {
    logger.info('User logged out', { user_id: req.user.id });
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error', { error: error.message });
    res.status(500).json({
      error: {
        message: 'Logout failed',
        code: 'LOGOUT_FAILED',
      },
    });
  }
});

// POST /api/auth/change-password - Change user password
router.post('/change-password', verifyJWT, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: {
          message: 'currentPassword and newPassword are required',
          code: 'MISSING_FIELDS',
        },
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        error: {
          message: 'New password must be at least 8 characters',
          code: 'WEAK_PASSWORD',
        },
      });
    }

    // Get user
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', id)
      .single();

    if (queryError || !user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        },
      });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        error: {
          message: 'Current password is incorrect',
          code: 'INVALID_PASSWORD',
        },
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', id);

    if (updateError) {
      logger.error('Password update failed', { error: updateError.message });
      return res.status(500).json({
        error: {
          message: 'Failed to update password',
          code: 'UPDATE_FAILED',
        },
      });
    }

    logger.info('Password changed', { user_id: id });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('Change password error', { error: error.message });
    next(error);
  }
});

// POST /api/auth/reset-password-direct - Direct reset (Current Dev Mode)
router.post('/reset-password-direct', async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        error: { message: 'Email and new password are required', code: 'MISSING_FIELDS' }
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: { message: 'Password must be at least 8 characters', code: 'WEAK_PASSWORD' }
      });
    }

    // Find user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        error: { message: 'User not found with this email', code: 'USER_NOT_FOUND' }
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      logger.error('Direct password reset failed', { error: updateError.message });
      return res.status(500).json({
        error: { message: 'Failed to reset password', code: 'UPDATE_FAILED' }
      });
    }

    logger.info('Password reset directly via UI', { email: user.email });

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in.'
    });
  } catch (error) {
    logger.error('Direct reset error', { error: error.message });
    next(error);
  }
});

export default router;
