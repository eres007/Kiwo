-- Drop the foreign key constraint on memories table
ALTER TABLE memories DROP CONSTRAINT IF EXISTS memories_user_id_fkey;
