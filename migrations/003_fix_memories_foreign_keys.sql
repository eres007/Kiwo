-- Fix foreign key constraints for memories table
-- This migration ensures memories table properly references users table

-- First, check if memories table exists and has the right structure
-- If memories table doesn't have user_id foreign key, add it

-- Drop existing foreign key if it exists (be careful with this)
-- ALTER TABLE memories DROP CONSTRAINT IF EXISTS memories_user_id_fkey;

-- Add proper foreign key constraint
ALTER TABLE memories
ADD CONSTRAINT memories_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Ensure project_id can be null or reference a projects table
-- For now, we'll allow null project_id
ALTER TABLE memories
ALTER COLUMN project_id DROP NOT NULL;

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories(user_id);

-- Create index for project_id lookups
CREATE INDEX IF NOT EXISTS idx_memories_project_id ON memories(project_id);

-- Ensure created_at has proper default
ALTER TABLE memories
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
