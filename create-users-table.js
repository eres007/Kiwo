// Create users table in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createUsersTable() {
  console.log('Checking if users table exists...\n');

  try {
    // Check if table exists
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (!error) {
      console.log('✅ Users table already exists!');
      return true;
    }

    console.log('Users table does not exist. Creating...\n');

    // Try using rpc to execute SQL
    const sqlStatements = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

      ALTER TABLE users ENABLE ROW LEVEL SECURITY;

      CREATE POLICY IF NOT EXISTS "Users can read own data" ON users
        FOR SELECT
        USING (auth.uid()::text = id::text OR current_setting('role') = 'service_role');

      CREATE POLICY IF NOT EXISTS "Users can update own data" ON users
        FOR UPDATE
        USING (auth.uid()::text = id::text OR current_setting('role') = 'service_role');

      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    // Try to execute via rpc
    const { error: rpcError } = await supabase.rpc('exec', { sql: sqlStatements });

    if (rpcError) {
      console.log('⚠️  RPC method not available');
      console.log('\nPlease create the users table manually:');
      console.log('1. Go to https://app.supabase.com');
      console.log('2. Select your project');
      console.log('3. Click "SQL Editor"');
      console.log('4. Click "New Query"');
      console.log('5. Copy and paste the SQL from migrations/002_create_users_table.sql');
      console.log('6. Click "Run"');
      console.log('\nOr read: SETUP_USERS_TABLE.md');
      return false;
    }

    console.log('✅ Users table created successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPlease create the users table manually:');
    console.log('1. Go to https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor"');
    console.log('4. Click "New Query"');
    console.log('5. Copy and paste the SQL from migrations/002_create_users_table.sql');
    console.log('6. Click "Run"');
    console.log('\nOr read: SETUP_USERS_TABLE.md');
    return false;
  }
}

createUsersTable().then(success => {
  if (success) {
    console.log('\n✅ Ready to test!');
    console.log('Run: node test-jwt-auth.js');
  }
  process.exit(success ? 0 : 1);
});
