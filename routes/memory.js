// Memory Routes
// Handles memory capture, retrieval, search, and management

import express from 'express';
import { supabase } from '../server.js';
import { verifyJWT } from '../middleware/auth.js';
import { refineMemory } from '../services/aiRefinement.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// POST /api/memory/capture - Capture new memory
router.post('/capture', verifyJWT, async (req, res, next) => {
  try {
    const { content, category, tags = [], source = 'web' } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!content || !category) {
      return res.status(400).json({
        error: {
          message: 'content and category are required',
          code: 'MISSING_FIELDS'
        }
      });
    }

    // Validate category
    const validCategories = ['architecture', 'preferences', 'stack', 'tasks', 'decisions', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: {
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
          code: 'INVALID_CATEGORY'
        }
      });
    }

    // Refine memory with AI
    let refinedMemory = {
      content,
      category,
      tags,
      importance_score: 0.5
    };

    try {
      refinedMemory = await refineMemory(content, category);
    } catch (error) {
      logger.warn('AI refinement failed, using raw memory', { error: error.message });
    }

    // Generate vector embedding (placeholder - would use actual embedding service)
    const vector = generateVector(content);

    // Store in database
    const { data: memory, error: insertError } = await supabase
      .from('memories')
      .insert([
        {
          user_id: userId,
          content: refinedMemory.content || content,
          category,
          tags: tags || [],
          importance_score: refinedMemory.importance_score || 0.5,
          vector,
          source,
          created_at: new Date().toISOString(),
          last_used: new Date().toISOString(),
          use_count: 0
        }
      ])
      .select()
      .single();

    if (insertError) {
      logger.error('Memory insertion failed', { error: insertError.message });
      return res.status(500).json({
        error: {
          message: 'Failed to save memory',
          code: 'MEMORY_SAVE_FAILED'
        }
      });
    }

    logger.info('Memory captured', { user_id: userId, memory_id: memory.id, category });

    res.status(201).json({
      success: true,
      memory: {
        id: memory.id,
        content: memory.content,
        category: memory.category,
        importance_score: memory.importance_score,
        created_at: memory.created_at
      }
    });
  } catch (error) {
    logger.error('Capture memory error', { error: error.message });
    next(error);
  }
});

// GET /api/memory/retrieve - Get relevant memories
router.get('/retrieve', verifyJWT, async (req, res, next) => {
  try {
    const { query, category, limit = 5 } = req.query;
    const userId = req.user.id;

    if (!query) {
      return res.status(400).json({
        error: {
          message: 'query parameter is required',
          code: 'MISSING_QUERY'
        }
      });
    }

    // Build query
    let dbQuery = supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId)
      .order('importance_score', { ascending: false })
      .limit(parseInt(limit) || 5);

    // Filter by category if provided
    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    const { data: memories, error: queryError } = await dbQuery;

    if (queryError) {
      logger.error('Memory retrieval failed', { error: queryError.message });
      return res.status(500).json({
        error: {
          message: 'Failed to retrieve memories',
          code: 'MEMORY_RETRIEVAL_FAILED'
        }
      });
    }

    // Filter by query text (simple text search)
    const filtered = memories.filter(m =>
      m.content.toLowerCase().includes(query.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );

    logger.info('Memories retrieved', { user_id: userId, count: filtered.length });

    res.json({
      success: true,
      memories: filtered,
      count: filtered.length
    });
  } catch (error) {
    logger.error('Retrieve memory error', { error: error.message });
    next(error);
  }
});

// GET /api/memory/list - List all memories
router.get('/list', verifyJWT, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const { count: total, error: countError } = await supabase
      .from('memories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      logger.error('Count failed', { error: countError.message });
      return res.status(500).json({
        error: {
          message: 'Failed to count memories',
          code: 'COUNT_FAILED'
        }
      });
    }

    // Get paginated memories
    const { data: memories, error: queryError } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (queryError) {
      logger.error('Memory list failed', { error: queryError.message });
      return res.status(500).json({
        error: {
          message: 'Failed to list memories',
          code: 'LIST_FAILED'
        }
      });
    }

    logger.info('Memories listed', { user_id: userId, page, limit, total });

    res.json({
      success: true,
      memories,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    logger.error('List memory error', { error: error.message });
    next(error);
  }
});

// GET /api/memory/search - Search memories
router.get('/search', verifyJWT, async (req, res, next) => {
  try {
    const { q, category } = req.query;
    const userId = req.user.id;

    if (!q) {
      return res.status(400).json({
        error: {
          message: 'q (query) parameter is required',
          code: 'MISSING_QUERY'
        }
      });
    }

    // Build query
    let dbQuery = supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId);

    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    const { data: memories, error: queryError } = await dbQuery;

    if (queryError) {
      logger.error('Search failed', { error: queryError.message });
      return res.status(500).json({
        error: {
          message: 'Search failed',
          code: 'SEARCH_FAILED'
        }
      });
    }

    // Filter by search query
    const results = memories.filter(m =>
      m.content.toLowerCase().includes(q.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
    );

    logger.info('Search completed', { user_id: userId, query: q, results: results.length });

    res.json({
      success: true,
      query: q,
      results,
      count: results.length
    });
  } catch (error) {
    logger.error('Search error', { error: error.message });
    next(error);
  }
});

// PUT /api/memory/:id - Update memory
router.put('/:id', verifyJWT, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, category, tags } = req.body;
    const userId = req.user.id;

    // Check ownership
    const { data: memory, error: fetchError } = await supabase
      .from('memories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !memory) {
      return res.status(404).json({
        error: {
          message: 'Memory not found',
          code: 'NOT_FOUND'
        }
      });
    }

    // Update memory
    const { data: updated, error: updateError } = await supabase
      .from('memories')
      .update({
        content: content || memory.content,
        category: category || memory.category,
        tags: tags || memory.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      logger.error('Memory update failed', { error: updateError.message });
      return res.status(500).json({
        error: {
          message: 'Failed to update memory',
          code: 'UPDATE_FAILED'
        }
      });
    }

    logger.info('Memory updated', { user_id: userId, memory_id: id });

    res.json({
      success: true,
      memory: updated
    });
  } catch (error) {
    logger.error('Update memory error', { error: error.message });
    next(error);
  }
});

// DELETE /api/memory/:id - Delete memory
router.delete('/:id', verifyJWT, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership
    const { data: memory, error: fetchError } = await supabase
      .from('memories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !memory) {
      return res.status(404).json({
        error: {
          message: 'Memory not found',
          code: 'NOT_FOUND'
        }
      });
    }

    // Delete memory
    const { error: deleteError } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      logger.error('Memory deletion failed', { error: deleteError.message });
      return res.status(500).json({
        error: {
          message: 'Failed to delete memory',
          code: 'DELETE_FAILED'
        }
      });
    }

    logger.info('Memory deleted', { user_id: userId, memory_id: id });

    res.json({
      success: true,
      message: 'Memory deleted successfully'
    });
  } catch (error) {
    logger.error('Delete memory error', { error: error.message });
    next(error);
  }
});

// GET /api/memory/project-context - Get full project context
router.get('/project-context', verifyJWT, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all memories grouped by category
    const { data: memories, error: queryError } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId)
      .order('importance_score', { ascending: false });

    if (queryError) {
      logger.error('Project context retrieval failed', { error: queryError.message });
      return res.status(500).json({
        error: {
          message: 'Failed to get project context',
          code: 'CONTEXT_FAILED'
        }
      });
    }

    // Group by category
    const context = {
      architecture: [],
      preferences: [],
      stack: [],
      tasks: [],
      decisions: [],
      other: []
    };

    memories.forEach(m => {
      if (context[m.category]) {
        context[m.category].push(m);
      }
    });

    logger.info('Project context retrieved', { user_id: userId });

    res.json({
      success: true,
      context,
      total_memories: memories.length
    });
  } catch (error) {
    logger.error('Project context error', { error: error.message });
    next(error);
  }
});

// Helper function to generate vector (placeholder)
function generateVector(text) {
  // This is a placeholder - in production, use actual embedding service
  // For now, return a simple hash-based vector
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  // Generate 1536-dimensional vector (for compatibility with embeddings)
  const vector = new Array(1536).fill(0);
  for (let i = 0; i < 1536; i++) {
    vector[i] = Math.sin(hash + i) * 0.5 + 0.5;
  }
  return vector;
}

export default router;
