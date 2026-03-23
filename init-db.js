// Initialize database - create users table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function initDB() {
  console.log('Initializing database...\n');

  try {
    // Check if table exists
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (!error) {
      console.log('✅ Users table already exists');
      return true;
    }

    console.log('Users table not found. You need to create it manually in Supabase.\n');
    console.log('Steps:');
    console.log('1. Go to https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor"');
    console.log('4. Click "New Query"');
    console.log('5. Copy and paste the SQL from: migrations/002_create_users_table.sql');
    console.log('6. Click "Run"\n');
    console.log('Then run: node test-jwt-auth.js\n');
    
    return false;

  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

initDB().then(success => {
  process.exit(success ? 0 : 1);
});
