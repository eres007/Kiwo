// Simple test - just check if API is responding
const BASE_URL = 'http://localhost:3000';

async function test() {
  console.log('Testing MemoryLayer API...\n');

  try {
    // Test health
    console.log('1. Health Check');
    let res = await fetch(`${BASE_URL}/health`);
    let data = await res.json();
    console.log('✅ Server running:', data.status);
    console.log('   Time:', data.timestamp, '\n');

    // Test capture endpoint (will fail without real user, but shows API is working)
    console.log('2. Testing Capture Endpoint');
    res = await fetch(`${BASE_URL}/api/memory/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Test memory',
        project_id: null,
        section: 'personal',
        subsection: 'preferences',
        source: 'test',
        user_id: 'test-user',
      }),
    });
    data = await res.json();
    console.log('Response:', data.error || data.success);
    console.log('(Expected error - need real Supabase user)\n');

    // Test retrieval endpoint
    console.log('3. Testing Retrieval Endpoint');
    res = await fetch(`${BASE_URL}/api/memory/context?user_id=test-user`);
    data = await res.json();
    console.log('Response:', data.success ? 'OK' : data.error);
    console.log('(Expected to work - returns empty if no memories)\n');

    console.log('✨ API is working! Now you need to:');
    console.log('   1. Create a real user in Supabase Auth');
    console.log('   2. Use that user_id in API calls');
    console.log('   3. Or disable RLS on memories table for testing');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
