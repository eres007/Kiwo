import fs from 'fs';
import path from 'path';
import { supabase } from '../server.js';
import { getRelevantMemories } from './memoryService.js';

// Initialize file sync service
export async function initializeFileSync() {
  console.log('File sync service initialized');
  // In production, this would watch the database for changes
  // and update context files accordingly
}

// Format memories for .cursorrules
export function formatForCursorrules(memories) {
  let content = '# Cursor Rules - MemoryLayer Context\n\n';

  // Personal preferences
  if (memories.personal && memories.personal.length > 0) {
    content += '## Your Preferences\n';
    memories.personal.forEach(m => {
      content += `- ${m.content}\n`;
    });
    content += '\n';
  }

  // Project context
  if (memories.project && memories.project.length > 0) {
    content += '## Project Context\n';

    // Group by subsection
    const grouped = groupBySubsection(memories.project);

    if (grouped.stack && grouped.stack.length > 0) {
      content += '### Stack\n';
      grouped.stack.forEach(m => {
        content += `- ${m.content}\n`;
      });
      content += '\n';
    }

    if (grouped.architecture && grouped.architecture.length > 0) {
      content += '### Architecture\n';
      grouped.architecture.forEach(m => {
        content += `- ${m.content}\n`;
      });
      content += '\n';
    }

    if (grouped.tasks && grouped.tasks.length > 0) {
      content += '### Current Tasks\n';
      grouped.tasks.forEach(m => {
        content += `- ${m.content}\n`;
      });
      content += '\n';
    }

    if (grouped.decisions && grouped.decisions.length > 0) {
      content += '### Key Decisions\n';
      grouped.decisions.forEach(m => {
        content += `- ${m.content}\n`;
      });
      content += '\n';
    }
  }

  // Others section
  if (memories.others && memories.others.length > 0) {
    content += '## General Notes\n';
    memories.others.forEach(m => {
      content += `- ${m.content}\n`;
    });
    content += '\n';
  }

  return content;
}

// Format memories for CLAUDE.md
export function formatForClaudeMd(memories) {
  let content = '# Claude Context - MemoryLayer\n\n';

  // Personal preferences
  if (memories.personal && memories.personal.length > 0) {
    content += '## Your Coding Style\n';
    memories.personal.forEach(m => {
      content += `- ${m.content}\n`;
    });
    content += '\n';
  }

  // Project context
  if (memories.project && memories.project.length > 0) {
    content += '## Project Information\n';

    const grouped = groupBySubsection(memories.project);

    if (grouped.stack && grouped.stack.length > 0) {
      content += '### Technology Stack\n';
      grouped.stack.forEach(m => {
        content += `- ${m.content}\n`;
      });
      content += '\n';
    }

    if (grouped.architecture && grouped.architecture.length > 0) {
      content += '### Architecture & Design\n';
      grouped.architecture.forEach(m => {
        content += `- ${m.content}\n`;
      });
      content += '\n';
    }

    if (grouped.tasks && grouped.tasks.length > 0) {
      content += '### What We\'re Building\n';
      grouped.tasks.forEach(m => {
        content += `- ${m.content}\n`;
      });
      content += '\n';
    }
  }

  return content;
}

// Format memories for GitHub Copilot
export function formatForCopilot(memories) {
  let content = '# GitHub Copilot Instructions\n\n';

  if (memories.personal && memories.personal.length > 0) {
    content += 'Coding preferences:\n';
    memories.personal.forEach(m => {
      content += `${m.content}\n`;
    });
    content += '\n';
  }

  if (memories.project && memories.project.length > 0) {
    const grouped = groupBySubsection(memories.project);

    if (grouped.stack && grouped.stack.length > 0) {
      content += 'Stack:\n';
      grouped.stack.forEach(m => {
        content += `${m.content}\n`;
      });
      content += '\n';
    }
  }

  return content;
}

// Write context files
export async function writeContextFiles(user_id, project_id = null) {
  try {
    const memories = await getRelevantMemories({
      user_id,
      project_id,
      file_path: null,
      tool: 'cursor',
    });

    // Write .cursorrules
    const cursorRules = formatForCursorrules(memories);
    fs.writeFileSync('.cursorrules', cursorRules);
    console.log('Updated .cursorrules');

    // Write CLAUDE.md
    const claudeMd = formatForClaudeMd(memories);
    fs.writeFileSync('CLAUDE.md', claudeMd);
    console.log('Updated CLAUDE.md');

    // Write .github/copilot-instructions.md
    const copilotInstructions = formatForCopilot(memories);
    const copilotDir = '.github';
    if (!fs.existsSync(copilotDir)) {
      fs.mkdirSync(copilotDir, { recursive: true });
    }
    fs.writeFileSync(path.join(copilotDir, 'copilot-instructions.md'), copilotInstructions);
    console.log('Updated .github/copilot-instructions.md');
  } catch (error) {
    console.error('Write context files error:', error);
  }
}

// Group memories by subsection
function groupBySubsection(memories) {
  const grouped = {};

  memories.forEach(memory => {
    if (!grouped[memory.subsection]) {
      grouped[memory.subsection] = [];
    }
    grouped[memory.subsection].push(memory);
  });

  return grouped;
}
