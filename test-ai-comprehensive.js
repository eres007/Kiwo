// Comprehensive AI memory handling tests
import { 
  refineMemory, 
  categorizeMemory, 
  mergeMemories, 
  generateContextSummary 
} from './services/aiRefinement.js';

const BASE_URL = 'http://localhost:3000';
const TEST_USER_ID = 'f5553b46-6aee-4acf-9765-6794caa855a2';
const TEST_PROJECT_ID = 'f628db5c-2a28-448d-9f7c-1b0e5344b912';

async function testAIMemoryHandling() {
  console.log('🧪 Comprehensive AI Memory Handling Tests\n');

  let passCount = 0;
  let failCount = 0;

  // Test 1: Refine various memory types
  console.log('1️⃣  Testing Memory Refinement\n');

  const testCases = [
    {
      name: 'Stack Decision',
      input: 'We decided to use React 18 with TypeScript instead of Vue because the team knows React better',
      expectedCategory: 'decisions',
    },
    {
      name: 'Architecture Pattern',
      input: 'We use a component-based architecture with Redux for state management and REST APIs',
      expectedCategory: 'architecture',
    },
    {
      name: 'Coding Preference',
      input: 'We prefer functional components with hooks, no class components, and always use TypeScript strict mode',
      expectedCategory: 'preferences',
    },
    {
      name: 'Current Task',
      input: 'Currently building the checkout flow with payment integration using Stripe',
      expectedCategory: 'tasks',
    },
    {
      name: 'Tech Stack',
      input: 'Frontend: React 18, Backend: Node.js, Database: PostgreSQL, Cache: Redis',
      expectedCategory: 'stack',
    },
    {
      name: 'Empty/Minimal',
      input: 'test',
      expectedCategory: 'general',
    },
    {
      name: 'Very Long Content',
      input: 'We have decided after extensive research and team discussions that we will use React 18 with TypeScript for our frontend because it provides excellent type safety, has a large ecosystem, and our team has significant experience with it. We also decided to use Node.js for the backend because it allows us to share code between frontend and backend, and we can use the same language throughout the stack. For the database, we chose PostgreSQL because it is a robust relational database with excellent support for complex queries and transactions.',
      expectedCategory: 'decisions',
    },
    {
      name: 'Multiple Technologies',
      input: 'Stack includes React, Vue, Angular, Node.js, Python, TypeScript, JavaScript, PostgreSQL, MongoDB, Redis',
      expectedCategory: 'stack',
    },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`   Testing: ${testCase.name}`);
      const refined = await refineMemory(testCase.input);

      if (refined.content && refined.category && refined.importance_score !== undefined) {
        console.log(`   ✅ Pass`);
        console.log(`      Content: ${refined.content.substring(0, 60)}...`);
        console.log(`      Category: ${refined.category}`);
        console.log(`      Importance: ${refined.importance_score}`);
        console.log(`      Tags: ${refined.tags.join(', ')}\n`);
        passCount++;
      } else {
        console.log(`   ❌ Fail - Missing fields\n`);
        failCount++;
      }
    } catch (error) {
      console.log(`   ❌ Fail - ${error.message}\n`);
      failCount++;
    }
  }

  // Test 2: Categorization accuracy
  console.log('2️⃣  Testing Categorization Accuracy\n');

  const categorizationTests = [
    { content: 'Using React and TypeScript', expected: 'stack' },
    { content: 'MVC pattern with separation of concerns', expected: 'architecture' },
    { content: 'Prefer camelCase naming convention', expected: 'preferences' },
    { content: 'Building user authentication module', expected: 'tasks' },
    { content: 'Chose PostgreSQL over MongoDB', expected: 'decisions' },
  ];

  for (const test of categorizationTests) {
    try {
      const category = await categorizeMemory(test.content);
      const isCorrect = category === test.expected;

      console.log(`   Content: "${test.content}"`);
      console.log(`   Expected: ${test.expected}, Got: ${category}`);
      console.log(`   ${isCorrect ? '✅ Pass' : '❌ Fail'}\n`);

      isCorrect ? passCount++ : failCount++;
    } catch (error) {
      console.log(`   ❌ Fail - ${error.message}\n`);
      failCount++;
    }
  }

  // Test 3: Deduplication
  console.log('3️⃣  Testing Memory Deduplication\n');

  const newMemory = {
    content: 'Using React 18 with TypeScript',
    category: 'stack',
  };

  const existingMemories = [
    { content: 'Using React 18 with TypeScript', id: 'mem_1' },
    { content: 'Using Node.js for backend', id: 'mem_2' },
  ];

  try {
    const decision = await mergeMemories(newMemory, existingMemories);
    console.log(`   New: "${newMemory.content}"`);
    console.log(`   Existing: ${existingMemories.map(m => `"${m.content}"`).join(', ')}`);
    console.log(`   Decision: ${decision.action}`);
    console.log(`   Reason: ${decision.reason}`);

    if (decision.action === 'skip') {
      console.log(`   ✅ Pass - Correctly detected duplicate\n`);
      passCount++;
    } else {
      console.log(`   ⚠️  Warning - Expected 'skip', got '${decision.action}'\n`);
      failCount++;
    }
  } catch (error) {
    console.log(`   ❌ Fail - ${error.message}\n`);
    failCount++;
  }

  // Test 4: Context Summary Generation
  console.log('4️⃣  Testing Context Summary Generation\n');

  const memories = [
    { subsection: 'stack', content: 'React 18 with TypeScript' },
    { subsection: 'architecture', content: 'Component-based with Redux' },
    { subsection: 'preferences', content: 'Functional components only' },
    { subsection: 'tasks', content: 'Building checkout flow' },
  ];

  try {
    const summary = await generateContextSummary(memories);
    console.log(`   Input memories: ${memories.length}`);
    console.log(`   Summary length: ${summary.length} chars`);
    console.log(`   Summary preview:\n   ${summary.split('\n').slice(0, 3).join('\n   ')}`);

    if (summary.length > 0 && summary.length < 500) {
      console.log(`   ✅ Pass - Summary generated\n`);
      passCount++;
    } else {
      console.log(`   ❌ Fail - Summary too long or empty\n`);
      failCount++;
    }
  } catch (error) {
    console.log(`   ❌ Fail - ${error.message}\n`);
    failCount++;
  }

  // Test 5: API Integration
  console.log('5️⃣  Testing API Integration\n');

  try {
    console.log(`   Capturing memory via API...`);
    let response = await fetch(`${BASE_URL}/api/memory/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'We use Tailwind CSS for styling with a mobile-first approach',
        project_id: TEST_PROJECT_ID,
        section: 'project',
        subsection: 'preferences',
        source: 'test',
        user_id: TEST_USER_ID,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Memory captured: ${data.memory.id}`);
      console.log(`   Category: ${data.memory.category}`);
      console.log(`   Importance: ${data.memory.importance_score}\n`);
      passCount++;
    } else {
      console.log(`   ❌ Fail - API error\n`);
      failCount++;
    }
  } catch (error) {
    console.log(`   ❌ Fail - ${error.message}\n`);
    failCount++;
  }

  // Test 6: Edge Cases
  console.log('6️⃣  Testing Edge Cases\n');

  const edgeCases = [
    { name: 'Empty string', input: '' },
    { name: 'Very short', input: 'a' },
    { name: 'Special characters', input: '!@#$%^&*()' },
    { name: 'Numbers only', input: '12345' },
    { name: 'Unicode', input: '你好世界 مرحبا بالعالم' },
    { name: 'Very long (1000 chars)', input: 'a'.repeat(1000) },
  ];

  for (const edgeCase of edgeCases) {
    try {
      console.log(`   Testing: ${edgeCase.name}`);
      const refined = await refineMemory(edgeCase.input);

      if (refined && refined.content !== undefined) {
        console.log(`   ✅ Pass - Handled gracefully\n`);
        passCount++;
      } else {
        console.log(`   ❌ Fail - Invalid response\n`);
        failCount++;
      }
    } catch (error) {
      console.log(`   ❌ Fail - ${error.message}\n`);
      failCount++;
    }
  }

  // Summary
  console.log('═'.repeat(50));
  console.log(`\n📊 Test Results`);
  console.log(`   ✅ Passed: ${passCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📈 Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%\n`);

  if (failCount === 0) {
    console.log('🎉 All tests passed! AI memory handling is robust.\n');
  } else {
    console.log(`⚠️  ${failCount} test(s) failed. Review above for details.\n`);
  }
}

testAIMemoryHandling();
