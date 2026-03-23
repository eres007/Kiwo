import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUser() {
  try {
    console.log('Creating test user...\n');

    // Create user with email and password
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@memorylayer.dev',
      password: 'TestPassword123!',
      email_confirm: true, // Auto-confirm email
    });

    if (error) {
      console.error('❌ Error creating user:', error.message);
      return;
    }

    const userId = data.user.id;
    console.log('✅ Test user created!');
    console.log('   Email: test@memorylayer.dev');
    console.log('   Password: TestPassword123!');
    console.log('   User ID:', userId);
    console.log('\n📝 Save this User ID for testing:\n');
    console.log(`TEST_USER_ID="${userId}"\n`);

    // Create a test project
    console.log('Creating test project...\n');

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          user_id: userId,
          name: 'Test Project',
          description: 'A test project for MemoryLayer',
          stack: 'React, Node.js, PostgreSQL',
        },
      ])
      .select();

    if (projectError) {
      console.error('❌ Error creating project:', projectError.message);
      return;
    }

    const projectId = projectData[0].id;
    console.log('✅ Test project created!');
    console.log('   Name: Test Project');
    console.log('   Project ID:', projectId);
    console.log('\n📝 Save this Project ID for testing:\n');
    console.log(`TEST_PROJECT_ID="${projectId}"\n`);

    console.log('✨ Setup complete! You can now test the API with:');
    console.log(`   User ID: ${userId}`);
    console.log(`   Project ID: ${projectId}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestUser();
