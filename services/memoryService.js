import { supabase } from '../server.js';
import { generateVector } from './vectorService.js';
import { refineMemory } from './aiRefinement.js';

// Save a memory with hierarchical organization
export async function saveMemory({
  content,
  project_id,
  section,
  subsection,
  source,
  user_id,
}) {
  try {
    // Validate user_id is provided
    if (!user_id) {
      throw new Error('user_id is required');
    }

    // Use AI to refine the memory
    console.log('🤖 Refining memory with AI...');
    const refined = await refineMemory(content);

    // Generate vector embedding for semantic search
    const vector = await generateVector(refined.content);

    // Create memory object
    const memory = {
      user_id,
      project_id: project_id || null, // Allow null for project_id
      content: refined.content,
      section, // personal | project | others
      subsection: refined.subsection || subsection, // Use AI-detected subsection
      category: refined.category || 'general', // Ensure category has a default
      vector,
      source,
      importance_score: refined.importance_score || 0.5,
      tier: refined.importance_score > 0.7 ? 'hot' : 'warm', // Auto-tier based on importance
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      use_count: 0,
    };

    // Check for duplicates/conflicts
    if (project_id) {
      const { data: existing } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user_id)
        .eq('project_id', project_id)
        .eq('subsection', memory.subsection)
        .limit(5);

      if (existing && existing.length > 0) {
        // Skip duplicate memories
        console.log('⏭️  Memory skipped (duplicate)');
        return existing[0]; // Return existing memory
      }
    }

    // Insert new memory
    const { data, error } = await supabase
      .from('memories')
      .insert([memory])
      .select();

    if (error) {
      console.error('Memory insert error:', {
        user_id,
        error: error.message,
        code: error.code,
      });
      throw error;
    }

    console.log(`✅ Memory saved: ${memory.subsection} in ${section}`);
    return data[0];
  } catch (error) {
    console.error('Save memory error:', error);
    throw error;
  }
}

// Get relevant memories based on context
export async function getRelevantMemories({
  user_id,
  project_id,
  file_path,
  tool,
}) {
  try {
    // Always get personal section
    const { data: personalMemories, error: personalError } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user_id)
      .eq('section', 'personal')
      .order('importance_score', { ascending: false })
      .limit(10);

    if (personalError) throw personalError;

    let projectMemories = [];
    let othersMemories = [];

    // If project_id provided, get project-specific memories
    if (project_id) {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user_id)
        .eq('project_id', project_id)
        .eq('section', 'project')
        .order('importance_score', { ascending: false })
        .limit(15);

      if (error) throw error;
      projectMemories = data;
    } else {
      // Get others section if no project
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user_id)
        .eq('section', 'others')
        .order('importance_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      othersMemories = data;
    }

    // Combine and organize
    const memories = {
      personal: personalMemories,
      project: projectMemories,
      others: othersMemories,
    };

    // Update last_used for retrieved memories
    const allMemoryIds = [
      ...personalMemories.map(m => m.id),
      ...projectMemories.map(m => m.id),
      ...othersMemories.map(m => m.id),
    ];

    if (allMemoryIds.length > 0) {
      await supabase
        .from('memories')
        .update({
          last_used: new Date().toISOString(),
          use_count: supabase.rpc('increment_use_count'),
        })
        .in('id', allMemoryIds);
    }

    return memories;
  } catch (error) {
    console.error('Get relevant memories error:', error);
    throw error;
  }
}

// Delete a memory
export async function deleteMemory(id, user_id) {
  try {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id);

    if (error) throw error;

    console.log(`Memory deleted: ${id}`);
  } catch (error) {
    console.error('Delete memory error:', error);
    throw error;
  }
}


