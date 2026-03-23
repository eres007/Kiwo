# MemoryLayer AI Refinement Layer

## Overview

The AI refinement layer uses **Qwen3 Coder Flash** model to intelligently extract, categorize, and structure developer memories from raw conversations.

## Architecture

```
Raw Conversation
    ↓
Qwen3 Coder Flash API
    ↓
Structured Memory (JSON)
    ├── content: Refined text
    ├── category: stack|architecture|preferences|tasks|decisions|general
    ├── subsection: Same as category
    ├── importance_score: 0.0-1.0
    └── tags: Array of relevant tags
    ↓
Vector Embedding
    ↓
Supabase Storage
    ↓
Auto-Sync to Context Files
    ├── .cursorrules
    ├── CLAUDE.md
    └── .github/copilot-instructions.md
```

## Available Models

From `/v1/models` endpoint:
- `qwen3-coder-flash` ✅ (Used for MVP)
- `qwen3-coder-plus`
- `vision-model`

## API Functions

### 1. refineMemory(rawContent)
Extracts and structures a raw memory.

**Input:**
```
"We decided to use React 18 instead of Vue because the team is more familiar with React"
```

**Output:**
```json
{
  "content": "Team chose React 18 over Vue due to existing familiarity",
  "category": "decisions",
  "subsection": "decisions",
  "importance_score": 0.75,
  "tags": ["react", "vue", "typescript"]
}
```

### 2. categorizeMemory(content)
Categorizes a memory into one of 6 categories.

**Categories:**
- `stack`: Technology choices (React, Node, Python, etc)
- `architecture`: Design patterns and structural decisions
- `preferences`: Coding style and conventions
- `tasks`: Current work and next steps
- `decisions`: Key architectural decisions
- `general`: Anything else

### 3. mergeMemories(newMemory, existingMemories)
Deduplicates memories and detects conflicts.

**Actions:**
- `skip`: Duplicate detected
- `update`: Conflicts with existing memory
- `add`: Unique, should be added

### 4. generateContextSummary(memories)
Creates a concise summary for context injection.

## Integration Points

### Backend API
- `POST /api/memory/capture` — Auto-refines before storing
- `GET /api/memory/context` — Returns refined memories
- `POST /api/memory/sync` — Triggers file sync

### File Sync
- Reads refined memories from database
- Formats for each tool
- Writes to context files

### Tools
- Cursor reads `.cursorrules`
- Claude Code reads `CLAUDE.md`
- GitHub Copilot reads `.github/copilot-instructions.md`

## Performance

- **Refinement time**: ~1-2 seconds per memory
- **API calls**: Batched at session end (not per message)
- **Cost**: ~$0.001 per refinement (Qwen3 Coder Flash is cheap)

## Error Handling

All functions have fallbacks:
- If Qwen API fails, returns basic structure
- If JSON parsing fails, returns raw content
- If network error, returns cached result

## Testing

```bash
# Test AI refinement
node test-ai-refinement.js

# Test Qwen API directly
node test-qwen-api.js

# Test full API with refinement
node test-api.js

# Test file sync
node test-file-sync.js
```

## Next Steps

1. ✅ AI refinement layer working
2. ✅ Qwen3 Coder Flash integrated
3. ✅ File sync generating context files
4. ⏳ Build admin dashboard
5. ⏳ Add Chrome extension
6. ⏳ Deploy to production
