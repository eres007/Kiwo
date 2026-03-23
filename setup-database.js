// Database setup script - Creates users table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupDatabase() {
  console.log('Setting up database...\n');

  try {
    // Create users table
    console.log('Creating users table...');
    const { error: createError } = await supabase.rpc('exec', {
      sql: `
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

        CREATE POLICY "Users can read own data" ON users
          FOR SELECT
          USING (auth.uid()::text = id::text OR current_setting('role') = 'service_role');

        CREATE POLICY "Users can update own data" ON users
          FOR UPDATE
          USING (auth.uid()::text = id::text OR current_setting('role') = 'service_role');

        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (createError) {
      console.log('Note: Table may already exist or RPC not available');
      console.log('Using direct SQL approach instead...\n');
      
      // Try direct SQL execution via query
      const sqlStatements = [
        `CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP,
          is_active BOOLEAN DEFAULT true
        );`,
        
        `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
        
        `CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);`,
      ];

      for (const sql of sqlStatements) {
        try {
          const { error } = await supabase.from('users').select('id').limit(1);
          if (error && error.code === 'PGRST116') {
            console.log('✅ Users table needs to be created manually in Supabase');
          }
        } catch (e) {
          // Table doesn't exist
        }
      }
    } else {
      console.log('✅ Users table created successfully');
    }

    // Verify table exists
    console.log('\nVerifying table...');
    const { data, error: verifyError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (verifyError) {
      console.log('⚠️  Users table not found. Please create it manually in Supabase:\n');
      console.log('1. Go to Supabase Dashboard');
      console.log('2. Click "SQL Editor"');
      console.log('3. Click "New Query"');
      console.log('4. Copy and paste the SQL from migrations/002_create_users_table.sql');
      console.log('5. Click "Run"');
      console.log('\nThen run this script again.');
      return false;
    } else {
      console.log('✅ Users table verified and ready');
      return true;
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\nPlease create the users table manually:');
    console.log('1. Go to Supabase Dashboard');
    console.log('2. Click "SQL Editor"');
    console.log('3. Click "New Query"');
    console.log('4. Copy and paste the SQL from migrations/002_create_users_table.sql');
    console.log('5. Click "Run"');
    return false;
  }
}

setupDatabase().then(success => {
  if (success) {
    console.log('\n✅ Database setup complete!');
    console.log('You can now run: node test-jwt-auth.js');
  } else {
    console.log('\n⚠️  Please complete the manual setup steps above');
  }
  process.exit(success ? 0 : 1);
});
