// AI Refinement Service
// Uses Qwen3 or Claude to refine raw memories into structured data

import { logger } from '../utils/logger.js';

const QWEN_API_KEY = process.env.QWEN_API_KEY;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'qwen'; // 'qwen' or 'claude'

/**
 * Refine raw memory text into structured memory
 * Extracts key information, assigns importance score, and categorizes
 */
export async function refineMemory(rawText, category) {
  try {
    if (AI_MODEL === 'claude' && CLAUDE_API_KEY) {
      return await refineWithClaude(rawText, category);
    } else if (AI_MODEL === 'qwen' && QWEN_API_KEY) {
      return await refineWithQwen(rawText, category);
    } else {
      logger.warn('No AI model configured, returning raw memory');
      return {
        content: rawText,
        category,
        importance_score: 0.5
      };
    }
  } catch (error) {
    logger.error('Memory refinement failed', { error: error.message });
    // Return raw memory on error
    return {
      content: rawText,
      category,
      importance_score: 0.5
    };
  }
}

/**
 * Refine using Claude API
 */
async function refineWithClaude(rawText, category) {
  try {
    const prompt = `You are a memory refinement system. Extract and structure the following memory.

Raw memory: "${rawText}"
Category: ${category}

Return a JSON object with:
{
  "content": "Refined, concise memory (1-2 sentences)",
  "importance_score": 0.0-1.0 (how important is this memory?),
  "key_points": ["point1", "point2"] (key takeaways)
}

Only return valid JSON, no other text.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse JSON response
    const refined = JSON.parse(content);
    logger.info('Memory refined with Claude', { category });

    return {
      content: refined.content,
      category,
      importance_score: refined.importance_score || 0.5,
      key_points: refined.key_points || []
    };
  } catch (error) {
    logger.error('Claude refinement failed', { error: error.message });
    throw error;
  }
}

/**
 * Refine using Qwen API
 */
async function refineWithQwen(rawText, category) {
  try {
    const prompt = `You are a memory refinement system. Extract and structure the following memory.

Raw memory: "${rawText}"
Category: ${category}

Return a JSON object with:
{
  "content": "Refined, concise memory (1-2 sentences)",
  "importance_score": 0.0-1.0 (how important is this memory?),
  "key_points": ["point1", "point2"] (key takeaways)
}

Only return valid JSON, no other text.`;

    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.output.text;

    // Parse JSON response
    const refined = JSON.parse(content);
    logger.info('Memory refined with Qwen', { category });

    return {
      content: refined.content,
      category,
      importance_score: refined.importance_score || 0.5,
      key_points: refined.key_points || []
    };
  } catch (error) {
    logger.error('Qwen refinement failed', { error: error.message });
    throw error;
  }
}

/**
 * Batch refine multiple memories
 */
export async function refineBatch(memories) {
  try {
    const refined = await Promise.all(
      memories.map(m => refineMemory(m.content, m.category))
    );
    return refined;
  } catch (error) {
    logger.error('Batch refinement failed', { error: error.message });
    return memories;
  }
}

/**
 * Calculate importance score based on multiple factors
 */
export function calculateImportanceScore(memory) {
  let score = 0.5; // Base score

  // Increase score for certain keywords
  const importantKeywords = ['critical', 'important', 'must', 'essential', 'decision', 'architecture'];
  importantKeywords.forEach(keyword => {
    if (memory.content.toLowerCase().includes(keyword)) {
      score += 0.1;
    }
  });

  // Increase score based on recency
  const daysSinceCreated = (Date.now() - new Date(memory.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated < 7) {
    score += 0.1;
  }

  // Increase score based on usage
  if (memory.use_count > 5) {
    score += 0.2;
  } else if (memory.use_count > 0) {
    score += 0.1;
  }

  // Cap at 1.0
  return Math.min(score, 1.0);
}

export default {
  refineMemory,
  refineBatch,
  calculateImportanceScore
};
