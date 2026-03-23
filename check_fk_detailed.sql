-- Check the foreign key constraints on memories table
SELECT constraint_name, table_name, column_name, foreign_table_name, foreign_column_name
FROM information_schema.referential_constraints
WHERE table_name = 'memories';
