#!/usr/bin/env node

/**
 * Kiwo MCP Server
 * Integrates with Cursor, Claude Code, Windsurf, Cline, Continue.dev, and other MCP-compatible IDEs
 * 
 * Installation:
 * 1. Add to your IDE config (e.g., .cursor/mcp.json or claude_desktop_config.json)
 * 2. Point to this file or use npx kiwo-mcp-server
 * 3. Restart IDE
 * 4. Kiwo tools will be available in your IDE
 */

import Anthropic from '@anthropic-ai/sdk';
import { logger } from './utils/logger.js';

const API_URL = process.env.KIWO_API_URL || 'https://kiwo.onrender.com';
const USER_TOKEN = process.env.KIWO_TOKEN || '';

// MCP Server implementation
class KiwoMCPServer {
  constructor() {
    this.tools = [
      {
        name: 'capture_memory',
        description: 'Capture and save a memory about your project, preferences, or decisions. This memory will be available in all your AI tools.',
        input_schema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The memory content (e.g., "We use Supabase instead of Firebase because we need more control")'
            },
            category: {
              type: 'string',
              enum: ['architecture', 'preferences', 'stack', 'tasks', 'decisions', 'other'],
              description: 'Category of the memory'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Tags for organizing memories (e.g., ["database", "backend"])'
            }
          },
          required: ['content', 'category']
        }
      },
      {
        name: 'get_memories',
        description: 'Retrieve relevant memories for your current task. Searches across all your saved memories.',
        input_schema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (e.g., "database decisions" or "coding preferences")'
            },
            category: {
              type: 'string',
              enum: ['architecture', 'preferences', 'stack', 'tasks', 'decisions', 'other'],
              description: 'Filter by category (optional)'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of memories to return (default: 5)'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'get_project_context',
        description: 'Get complete project context including all memories, tech stack, and decisions.',
        input_schema: {
          type: 'object',
          properties: {
            project_id: {
              type: 'string',
              description: 'Project ID (optional, uses current project if not specified)'
            }
          }
        }
      },
      {
        name: 'list_memories',
        description: 'List all your saved memories with pagination.',
        input_schema: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Page number (default: 1)'
            },
            limit: {
              type: 'number',
              description: 'Items per page (default: 10)'
            }
          }
        }
      },
      {
        name: 'delete_memory',
        description: 'Delete a specific memory.',
        input_schema: {
          type: 'object',
          properties: {
            memory_id: {
              type: 'string',
              description: 'ID of the memory to delete'
            }
          },
          required: ['memory_id']
        }
      }
    ];
  }

  async captureMemory(content, category, tags = []) {
    try {
      const response = await fetch(`${API_URL}/api/memory/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${USER_TOKEN}`
        },
        body: JSON.stringify({
          content,
          category,
          tags,
          source: 'mcp_ide'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Memory captured successfully',
        memory_id: data.id
      };
    } catch (error) {
      logger.error('Failed to capture memory', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getMemories(query, category = null, limit = 5) {
    try {
      const params = new URLSearchParams({
        query,
        limit: limit.toString()
      });

      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`${API_URL}/api/memory/retrieve?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${USER_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        memories: data.memories || [],
        count: data.count || 0
      };
    } catch (error) {
      logger.error('Failed to retrieve memories', { error: error.message });
      return {
        success: false,
        error: error.message,
        memories: []
      };
    }
  }

  async getProjectContext(projectId = null) {
    try {
      const url = projectId 
        ? `${API_URL}/api/memory/project/${projectId}`
        : `${API_URL}/api/memory/project-context`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${USER_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        context: data
      };
    } catch (error) {
      logger.error('Failed to get project context', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  async listMemories(page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_URL}/api/memory/list?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${USER_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        memories: data.memories || [],
        total: data.total || 0,
        page,
        limit
      };
    } catch (error) {
      logger.error('Failed to list memories', { error: error.message });
      return {
        success: false,
        error: error.message,
        memories: []
      };
    }
  }

  async deleteMemory(memoryId) {
    try {
      const response = await fetch(`${API_URL}/api/memory/${memoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${USER_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return {
        success: true,
        message: 'Memory deleted successfully'
      };
    } catch (error) {
      logger.error('Failed to delete memory', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  async handleToolCall(toolName, toolInput) {
    switch (toolName) {
      case 'capture_memory':
        return await this.captureMemory(
          toolInput.content,
          toolInput.category,
          toolInput.tags
        );
      case 'get_memories':
        return await this.getMemories(
          toolInput.query,
          toolInput.category,
          toolInput.limit || 5
        );
      case 'get_project_context':
        return await this.getProjectContext(toolInput.project_id);
      case 'list_memories':
        return await this.listMemories(
          toolInput.page || 1,
          toolInput.limit || 10
        );
      case 'delete_memory':
        return await this.deleteMemory(toolInput.memory_id);
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  }

  getToolDefinitions() {
    return this.tools;
  }
}

// Initialize and export
const server = new KiwoMCPServer();

export default server;
export { KiwoMCPServer };
