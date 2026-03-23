-- Disable RLS on users table to allow service role access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop the RLS policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
