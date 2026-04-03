import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const TEST_USER_ID = '81ca8448-280c-47b6-a25c-953f0028f524';
const TEST_EMAIL = 'test@memorylayer.com';
const API_URL = 'http://localhost:3000';

async function runTest() {
  try {
    console.log('--- Kiwo API Key System Test ---');

    // 1. Generate JWT
    const token = jwt.sign(
      { sub: TEST_USER_ID, email: TEST_EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('1. JWT Generated');

    // 2. Generate API Key
    const genRes = await fetch(`${API_URL}/api/api-keys/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ label: 'System Verification Key' })
    });

    const genData = await genRes.json();
    if (!genRes.ok) throw new Error(`Key generation failed: ${JSON.stringify(genData)}`);
    
    const apiKey = genData.key;
    console.log(`2. API Key Generated: ${apiKey.substring(0, 10)}...`);

    // 3. Capture Memory using API Key
    const capRes = await fetch(`${API_URL}/api/memory/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        content: `Test memory via API Key at ${new Date().toISOString()}`,
        category: 'Verification'
      })
    });

    const capData = await capRes.json();
    if (!capRes.ok) throw new Error(`Memory capture failed: ${JSON.stringify(capData)}`);
    
    console.log('3. Memory Captured successfully using API Key!');
    console.log('Response:', capData.memory.id);

    // 4. List Keys to verify last_used
    const listRes = await fetch(`${API_URL}/api/api-keys/list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const listData = await listRes.json();
    const verifiedKey = listData.keys.find(k => k.id === genData.id);
    console.log(`4. Key usage updated: ${verifiedKey.last_used ? 'YES' : 'NO'}`);

    console.log('\n✅ ALL TESTS PASSED!');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    process.exit(1);
  }
}

runTest();
