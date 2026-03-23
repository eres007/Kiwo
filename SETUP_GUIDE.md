# MemoryLayer Backend - Setup Guide

## Step 1: Update Supabase Schema

Go to your Supabase dashboard → SQL Editor and run this:

```sql
-- Add new columns to memories table
ALTER TABLE memories
ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'others',
ADD COLUMN IF NOT EXISTS subsection TEXT DEFAULT 'general';

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_memories_user_section 
ON memories(user_id, section);

CREATE INDEX IF NOT EXISTS idx_memories_project_section 
ON memories(project_id, section, subsection);

CREATE INDEX IF NOT EXISTS idx_memories_importance 
ON memories(user_id, importance_score DESC);
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start the Server

```bash
npm run dev
```

Server will run on `http://localhost:3000`

## Step 4: Test the API

```bash
node test-api.js
```

## API Endpoints

### 1. Capture a Memory
```bash
curl -X POST http://localhost:3000/api/memory/capture \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Using React 18 with TypeScript",
    "project_id": "proj_123",
    "section": "project",
    "subsection": "stack",
    "source": "cursor",
    "user_id": "user_123"
  }'
```

### 2. Get Relevant Memories
```bash
curl "http://localhost:3000/api/memory/context?user_id=user_123&project_id=proj_123&tool=cursor"
```

### 3. Get All Memories
```bash
curl "http://localhost:3000/api/memory/all?user_id=user_123"
```

### 4. Delete a Memory
```bash
curl -X DELETE "http://localhost:3000/api/memory/mem_123?user_id=user_123"
```

## Memory Sections

- **personal**: User's coding preferences, tools, workflow
- **project**: Project-specific context (stack, architecture, tasks)
- **others**: General knowledge, learnings, experiments

## Subsections

- **stack**: Technology choices (React, Node, etc)
- **architecture**: Design decisions and patterns
- **preferences**: Coding style and conventions
- **tasks**: Current work and next steps
- **decisions**: Key architectural decisions
- **general**: Anything else

## File Sync

After capturing memories, context files are automatically generated:
- `.cursorrules` - For Cursor
- `CLAUDE.md` - For Claude Code
- `.github/copilot-instructions.md` - For GitHub Copilot

## Next Steps

1. ✅ Backend API running
2. ⏳ Build admin dashboard
3. ⏳ Add Chrome extension for browser tools
4. ⏳ Integrate with Cursor, Claude Code
