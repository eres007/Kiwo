// Setup users table using Supabase REST API
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function setupAuthTable() {
  console.log('Setting up users table for JWT authentication...\n');

  const sql = `
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

  try {
    console.log('Attempting to create users table via Supabase API...\n');

    // Try using the Supabase REST API with SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ sql }),
    });

    if (response.ok) {
      console.log('✅ Users table created successfully!\n');
      return true;
    } else {
      const error = await response.text();
      console.log('⚠️  Could not create table via API');
      console.log('Response:', error);
      console.log('\n');
      return false;
    }
  } catch (error) {
    console.log('⚠️  API request failed:', error.message);
    console.log('\n');
    return false;
  }
}

async function main() {
  const success = await setupAuthTable();

  if (!success) {
    console.log('📋 MANUAL SETUP REQUIRED\n');
    console.log('Please create the users table manually:\n');
    console.log('1. Go to: https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" in the left sidebar');
    console.log('4. Click "New Query"');
    console.log('5. Copy the SQL from: migrations/002_create_users_table.sql');
    console.log('6. Paste it into the editor');
    console.log('7. Click "Run"');
    console.log('\nOr read the detailed guide: SETUP_USERS_TABLE.md\n');
    process.exit(1);
  }

  console.log('✅ Setup complete!\n');
  console.log('You can now run the tests:');
  console.log('  node test-jwt-auth.js\n');
  process.exit(0);
}

main();
