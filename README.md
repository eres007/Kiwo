# MemoryLayer Backend

AI Memory Infrastructure for Developers

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Database Migration

Go to your Supabase SQL Editor and run the SQL from `migrations/001_update_memories_schema.sql`

### 3. Environment Variables

Your `.env.local` file is already set up with Supabase credentials.

### 4. Start the Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Capture Memory
```
POST /api/memory/capture
Body: {
  "content": "Using React 18 with TypeScript",
  "project_id": "proj_123",
  "section": "project",
  "subsection": "stack",
  "source": "cursor",
  "user_id": "user_123"
}
```

### Get Relevant Memories
```
GET /api/memory/context?user_id=user_123&project_id=proj_123&tool=cursor
```

### Get All Memories
```
GET /api/memory/all?user_id=user_123
```

### Get Project Memories
```
GET /api/memory/project/proj_123?user_id=user_123
```

### Delete Memory
```
DELETE /api/memory/mem_123?user_id=user_123
```

## Memory Hierarchy

```
User
├── Personal Section
│   ├── Coding preferences
│   ├── Tools
│   └── Workflow patterns
│
├── Projects Section
│   ├── Project A
│   │   ├── Stack
│   │   ├── Architecture
│   │   ├── Tasks
│   │   └── Decisions
│   │
│   └── Project B
│       └── ...
│
└── Others Section
    ├── General knowledge
    └── Learnings
```

## File Sync

Context files are automatically updated:
- `.cursorrules` - For Cursor
- `CLAUDE.md` - For Claude Code
- `.github/copilot-instructions.md` - For GitHub Copilot

## Next Steps

1. Test API endpoints with sample data
2. Build admin dashboard for viewing memories
3. Add Chrome extension for browser-based tools
4. Integrate with actual tools (Cursor, Claude Code)
