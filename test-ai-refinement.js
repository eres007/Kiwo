// Test AI refinement layer
import { refineMemory, categorizeMemory, generateContextSummary } from './services/aiRefinement.js';

async function testAIRefinement() {
  console.log('🤖 Testing AI Refinement Layer\n');

  try {
    // Test 1: Refine a memory
    console.log('1️⃣  Refining Raw Memory');
    const rawMemory = 'We decided to use React 18 instead of Vue because the team is more familiar with React and we need better TypeScript support for our large codebase';
    
    console.log('   Raw:', rawMemory);
    const refined = await refineMemory(rawMemory);
    console.log('   Refined:', refined.content);
    console.log('   Category:', refined.category);
    console.log('   Subsection:', refined.subsection);
    console.log('   Importance:', refined.importance_score);
    console.log('   Tags:', refined.tags, '\n');

    // Test 2: Categorize memory
    console.log('2️⃣  Categorizing Memory');
    const testContent = 'We prefer functional components with hooks, no class components';
    const category = await categorizeMemory(testContent);
    console.log('   Content:', testContent);
    console.log('   Category:', category, '\n');

    // Test 3: Generate context summary
    console.log('3️⃣  Generating Context Summary');
    const memories = [
      { subsection: 'stack', content: 'Using React 18 with TypeScript' },
      { subsection: 'architecture', content: 'Component-based architecture with Redux for state' },
      { subsection: 'preferences', content: 'Functional components only, no class components' },
    ];
    const summary = await generateContextSummary(memories);
    console.log('   Summary:');
    console.log('   ' + summary.split('\n').join('\n   '), '\n');

    console.log('✨ AI refinement tests completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAIRefinement();
