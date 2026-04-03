import express from 'express';
import crypto from 'crypto';
import { supabase } from '../server.js';
import { verifyJWT } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// GET /api/api-keys/list - List all API keys for the user
router.get('/list', verifyJWT, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('id, label, last_used, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to list API keys', { error: error.message });
      return res.status(500).json({ error: { message: 'Failed to fetch API keys' } });
    }

    res.json({ success: true, keys });
  } catch (error) {
    next(error);
  }
});

// POST /api/api-keys/generate - Create a new API key
router.post('/generate', verifyJWT, async (req, res, next) => {
  try {
    const { label } = req.body;
    const userId = req.user.id;

    if (!label) {
      return res.status(400).json({ error: { message: 'Label is required' } });
    }

    // Generate a secure random key
    const rawKey = `kiwo_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const { data: keyRecord, error } = await supabase
      .from('api_keys')
      .insert([
        {
          user_id: userId,
          key_hash: keyHash,
          label: label,
          created_at: new Date().toISOString()
        }
      ])
      .select('id')
      .single();

    if (error) {
      logger.error('Failed to generate API key', { error: error.message });
      return res.status(500).json({ error: { message: 'Failed to generate API key' } });
    }

    logger.info('API key generated', { user_id: userId, key_id: keyRecord.id });

    // IMPORTANT: Only return the raw key ONCE
    res.status(201).json({
      success: true,
      key: rawKey,
      id: keyRecord.id,
      message: 'IMPORTANT: Copy this key now. It will not be shown again.'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/api-keys/:id - Revoke an API key
router.delete('/:id', verifyJWT, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      logger.error('Failed to revoke API key', { error: error.message });
      return res.status(500).json({ error: { message: 'Failed to revoke API key' } });
    }

    logger.info('API key revoked', { user_id: userId, key_id: id });
    res.json({ success: true, message: 'API key revoked successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
