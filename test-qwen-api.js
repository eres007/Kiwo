// Test Qwen Worker API directly
const QWEN_API_URL = 'https://qwen-worker-proxy.ronitshrimankar1.workers.dev';

async function testQwenAPI() {
  console.log('🧪 Testing Qwen Worker API\n');

  try {
    // Test 1: Simple chat completion
    console.log('1️⃣  Testing /v1/chat/completions');
    let response = await fetch(`${QWEN_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'user',
            content: 'Say hello',
          },
        ],
      }),
    });

    console.log('   Status:', response.status);
    console.log('   Headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('   Error:', errorText);
      console.log();
    } else {
      const data = await response.json();
      console.log('   ✅ Success!');
      console.log('   Response:', data);
      console.log();
    }

    // Test 2: Try root endpoint
    console.log('2️⃣  Testing root endpoint');
    response = await fetch(QWEN_API_URL);
    console.log('   Status:', response.status);
    const text = await response.text();
    console.log('   Response:', text.substring(0, 200));
    console.log();

    // Test 3: Try with different headers
    console.log('3️⃣  Testing with Authorization header');
    response = await fetch(`${QWEN_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test',
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'user',
            content: 'What is 2+2?',
          },
        ],
      }),
    });

    console.log('   Status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Success!');
      console.log('   Response:', data.choices[0].message.content);
    } else {
      const errorText = await response.text();
      console.log('   Error:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testQwenAPI();
