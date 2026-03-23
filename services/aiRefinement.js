// AI Refinement Layer using Qwen Model
// Extracts structured memories from raw conversations

const QWEN_API_URL = 'https://qwen-worker-proxy.ronitshrimankar1.workers.dev';
const MODEL = 'qwen3-coder-flash';

export async function refineMemory(rawContent) {
  try {
    const prompt = `Extract key memories from this developer conversation.
Return a JSON object with these fields:
- content: The main memory (1-2 sentences, max 100 chars)
- category: One of: stack, architecture, preferences, tasks, decisions, general
- subsection: One of: stack, architecture, preferences, tasks, decisions, general
- importance_score: 0.0 to 1.0 (how important is this memory?)
- tags: Array of relevant tags (max 3)

Raw content:
"${rawContent}"

Return ONLY valid JSON, no markdown, no extra text.`;

    const response = await fetch(`${QWEN_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    let refinedText = data.choices[0].message.content;

    // Remove markdown code blocks if present
    refinedText = refinedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Parse the JSON response
    const refined = JSON.parse(refinedText);

    return {
      content: refined.content || rawContent.substring(0, 100),
      category: refined.category || 'general',
      subsection: refined.subsection || 'general',
      importance_score: Math.min(1, Math.max(0, refined.importance_score || 0.5)),
      tags: refined.tags || [],
    };
  } catch (error) {
    console.error('AI refinement error:', error);
    // Fallback: return basic structure
    return {
      content: rawContent.substring(0, 100),
      category: 'general',
      subsection: 'general',
      importance_score: 0.5,
      tags: [],
    };
  }
}

// Merge new memory with existing ones (deduplication)
export async function mergeMemories(newMemory, existingMemories) {
  try {
    if (existingMemories.length === 0) {
      return { action: 'add', reason: 'no existing memories' };
    }

    const existingContent = existingMemories
      .map(m => `- ${m.content}`)
      .join('\n');

    const prompt = `You are a memory deduplication system.
New memory: "${newMemory.content}"

Existing memories:
${existingContent}

If the new memory is a duplicate or very similar to an existing one, return:
{"action": "skip", "reason": "duplicate"}

If the new memory updates/conflicts with an existing one, return:
{"action": "update", "memory_id": "id_of_memory_to_update", "reason": "reason"}

If the new memory is unique and should be added, return:
{"action": "add", "reason": "reason"}

Return ONLY valid JSON, no markdown.`;

    const response = await fetch(`${QWEN_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    let jsonText = data.choices[0].message.content;
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const decision = JSON.parse(jsonText);

    return decision;
  } catch (error) {
    console.error('Memory merge error:', error);
    return { action: 'add', reason: 'error in merge logic' };
  }
}

// Categorize memory automatically
export async function categorizeMemory(content) {
  try {
    const prompt = `Categorize this developer memory into ONE category:
- stack: Technology choices (React, Node, Python, etc)
- architecture: Design patterns and structural decisions
- preferences: Coding style and conventions
- tasks: Current work and next steps
- decisions: Key architectural or technical decisions
- general: Anything else

Memory: "${content}"

Return ONLY the category name, nothing else.`;

    const response = await fetch(`${QWEN_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    const category = data.choices[0].message.content.trim().toLowerCase();

    const validCategories = [
      'stack',
      'architecture',
      'preferences',
      'tasks',
      'decisions',
      'general',
    ];
    return validCategories.includes(category) ? category : 'general';
  } catch (error) {
    console.error('Categorization error:', error);
    return 'general';
  }
}

// Generate summary of memories for context injection
export async function generateContextSummary(memories) {
  try {
    if (memories.length === 0) {
      return '';
    }

    const memoryList = memories
      .map(m => `- ${m.subsection}: ${m.content}`)
      .join('\n');

    const prompt = `Create a concise, developer-friendly summary of these project memories.
Keep it under 200 words. Format as bullet points.

Memories:
${memoryList}

Return ONLY the summary, no other text.`;

    const response = await fetch(`${QWEN_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Summary generation error:', error);
    // Fallback: return simple list
    return memories.map(m => `- ${m.content}`).join('\n');
  }
}
