-- Update memories table to support hierarchical organization
-- Run this in Supabase SQL Editor

-- Add new columns if they don't exist
ALTER TABLE memories
ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'others',
ADD COLUMN IF NOT EXISTS subsection TEXT DEFAULT 'general';

-- Create indexes for hierarchical queries
CREATE INDEX IF NOT EXISTS idx_memories_user_section 
ON memories(user_id, section);

CREATE INDEX IF NOT EXISTS idx_memories_project_section 
ON memories(project_id, section, subsection);

CREATE INDEX IF NOT EXISTS idx_memories_importance 
ON memories(user_id, importance_score DESC);

-- Create a function to increment use_count
CREATE OR REPLACE FUNCTION increment_use_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.use_count = NEW.use_count + 1;
  NEW.last_used = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for use_count
DROP TRIGGER IF EXISTS trigger_increment_use_count ON memories;
CREATE TRIGGER trigger_increment_use_count
BEFORE UPDATE ON memories
FOR EACH ROW
EXECUTE FUNCTION increment_use_count();
