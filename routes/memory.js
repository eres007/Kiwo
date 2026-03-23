import express from 'express';
import { supabase } from '../server.js';
import { getRelevantMemories, saveMemory, deleteMemory } from '../services/memoryService.js';
import { writeContextFiles } from '../services/fileSync.js';
import { validateMemoryCapture, validateMemoryQuery, validatePagination } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { captureLimiter, syncLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/memory/capture - Auto-capture and store memory
router.post('/capture', captureLimiter, validateMemoryCapture, asyncHandler(async (req, res) => {
  const { content, project_id, section, subsection, source } = req.body;
  const user_id = req.user.id; // Get from JWT token

  const memory = await saveMemory({
    content,
    project_id: project_id || null,
    section: section || 'others',
    subsection: subsection || 'general',
    source: source || 'api',
    user_id,
  });

  res.status(201).json({ success: true, memory });
}));

// GET /api/memory/context - Get relevant memories for current context
router.get('/context', asyncHandler(async (req, res) => {
  const { project_id, file_path, tool } = req.query;
  const user_id = req.user.id; // Get from JWT token

  const memories = await getRelevantMemories({
    user_id,
    project_id: project_id || null,
    file_path: file_path || null,
    tool: tool || 'cursor',
  });

  res.json({ success: true, memories });
}));

// GET /api/memory/all - Get all memories for a user (admin)
router.get('/all', validatePagination, asyncHandler(async (req, res) => {
  const user_id = req.user.id; // Get from JWT token
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('memories')
    .select('*', { count: 'exact' })
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  res.json({ 
    success: true, 
    memories: data,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit),
    },
  });
}));

// GET /api/memory/project/:project_id - Get all memories for a project
router.get('/project/:project_id', validatePagination, asyncHandler(async (req, res) => {
  const { project_id } = req.params;
  const user_id = req.user.id; // Get from JWT token
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('memories')
    .select('*', { count: 'exact' })
    .eq('user_id', user_id)
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  res.json({ 
    success: true, 
    memories: data,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit),
    },
  });
}));

// DELETE /api/memory/:id - Delete a memory
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id; // Get from JWT token

  await deleteMemory(id, user_id);

  res.json({ success: true, message: 'Memory deleted' });
}));

// POST /api/memory/sync - Manually trigger file sync
router.post('/sync', syncLimiter, asyncHandler(async (req, res) => {
  const { project_id } = req.body;
  const user_id = req.user.id; // Get from JWT token

  await writeContextFiles(user_id, project_id || null);

  res.json({ success: true, message: 'Context files synced' });
}));

export default router;
