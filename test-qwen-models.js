// Test available Qwen models
const QWEN_API_URL = 'https://qwen-worker-proxy.ronitshrimankar1.workers.dev';

async function testModels() {
  console.log('🧪 Testing Available Qwen Models\n');

  const models = [
    'qwen-turbo',
    'qwen-plus',
    'qwen-max',
    'qwen-long',
    'qwen2-7b',
    'qwen2-72b',
    'qwen-vl-plus',
    'qwen-vl-max',
  ];

  for (const model of models) {
    try {
      console.log(`Testing model: ${model}`);
      const response = await fetch(`${QWEN_API_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: 'Say hello',
            },
          ],
          max_tokens: 50,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${model} works!`);
        console.log(`   Response: ${data.choices[0].message.content}\n`);
      } else {
        const error = await response.json();
        const errorMsg = error.error?.message || error.error?.error?.message || 'Unknown error';
        console.log(`❌ ${model}: ${errorMsg}\n`);
      }
    } catch (error) {
      console.log(`❌ ${model}: ${error.message}\n`);
    }
  }
}

testModels();
