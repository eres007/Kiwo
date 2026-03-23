// Simple test script to verify API endpoints
// Run with: node test-api.js

const BASE_URL = 'http://localhost:3000';

// Test user ID and project ID (real ones from Supabase)
const TEST_USER_ID = 'f5553b46-6aee-4acf-9765-6794caa855a2';
const TEST_PROJECT_ID = 'f628db5c-2a28-448d-9f7c-1b0e5344b912';

async function testAPI() {
  console.log('🧪 Testing MemoryLayer API\n');

  try {
    // Test 1: Health check
    console.log('1️⃣  Health Check');
    let response = await fetch(`${BASE_URL}/health`);
    let data = await response.json();
    console.log('✅ Server is running\n');

    // Test 2: Capture a memory
    console.log('2️⃣  Capturing Memory');
    response = await fetch(`${BASE_URL}/api/memory/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Using React 18 with TypeScript and Tailwind CSS',
        project_id: TEST_PROJECT_ID,
        section: 'project',
        subsection: 'stack',
        source: 'test',
        user_id: TEST_USER_ID,
      }),
    });
    data = await response.json();
    if (data.success) {
      console.log('✅ Memory captured:', data.memory.id);
      console.log('   Content:', data.memory.content);
      console.log('   Section:', data.memory.section);
      console.log('   Subsection:', data.memory.subsection, '\n');
    } else {
      console.log('❌ Error:', data.error, '\n');
    }

    // Test 3: Capture another memory
    console.log('3️⃣  Capturing Another Memory');
    response = await fetch(`${BASE_URL}/api/memory/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Prefer functional components with hooks, no class components',
        project_id: TEST_PROJECT_ID,
        section: 'project',
        subsection: 'preferences',
        source: 'test',
        user_id: TEST_USER_ID,
      }),
    });
    data = await response.json();
    if (data.success) {
      console.log('✅ Memory captured:', data.memory.id, '\n');
    }

    // Test 4: Get relevant memories
    console.log('4️⃣  Getting Relevant Memories');
    response = await fetch(
      `${BASE_URL}/api/memory/context?user_id=${TEST_USER_ID}&project_id=${TEST_PROJECT_ID}&tool=cursor`
    );
    data = await response.json();
    if (data.success) {
      console.log('✅ Retrieved memories:');
      console.log('   Personal:', data.memories.personal.length);
      console.log('   Project:', data.memories.project.length);
      console.log('   Others:', data.memories.others.length, '\n');
    }

    // Test 5: Get all memories
    console.log('5️⃣  Getting All Memories');
    response = await fetch(`${BASE_URL}/api/memory/all?user_id=${TEST_USER_ID}`);
    data = await response.json();
    if (data.success) {
      console.log('✅ Total memories:', data.memories.length);
      data.memories.forEach(m => {
        console.log(`   - ${m.subsection}: ${m.content.substring(0, 50)}...`);
      });
      console.log();
    }

    console.log('✨ All tests completed!');
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testAPI();
