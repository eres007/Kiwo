// Test file sync functionality
const BASE_URL = 'http://localhost:3000';

const TEST_USER_ID = 'f5553b46-6aee-4acf-9765-6794caa855a2';
const TEST_PROJECT_ID = 'f628db5c-2a28-448d-9f7c-1b0e5344b912';

async function testFileSync() {
  console.log('🧪 Testing File Sync\n');

  try {
    // Trigger file sync
    console.log('1️⃣  Triggering File Sync');
    let response = await fetch(`${BASE_URL}/api/memory/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: TEST_USER_ID,
        project_id: TEST_PROJECT_ID,
      }),
    });
    let data = await response.json();
    console.log('✅ Response:', data.message, '\n');

    // Check if files were created
    console.log('2️⃣  Checking Generated Files');
    const fs = await import('fs');

    if (fs.existsSync('.cursorrules')) {
      console.log('✅ .cursorrules created');
      const content = fs.readFileSync('.cursorrules', 'utf-8');
      console.log('   Content preview:');
      console.log('   ' + content.split('\n').slice(0, 5).join('\n   '));
      console.log();
    } else {
      console.log('❌ .cursorrules not found');
    }

    if (fs.existsSync('CLAUDE.md')) {
      console.log('✅ CLAUDE.md created');
      const content = fs.readFileSync('CLAUDE.md', 'utf-8');
      console.log('   Content preview:');
      console.log('   ' + content.split('\n').slice(0, 5).join('\n   '));
      console.log();
    } else {
      console.log('❌ CLAUDE.md not found');
    }

    console.log('✨ File sync test completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFileSync();
