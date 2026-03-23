-- Check the memories table structure
SELECT constraint_name, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_name = 'memories' AND constraint_name LIKE '%user_id%';
