-- Delete orphaned memories (memories with user_ids that don't exist in users table)
DELETE FROM memories
WHERE user_id NOT IN (SELECT id FROM users);
