// Generate vector embedding for semantic search
// For now, using a simple hash-based approach
// Later, replace with actual Claude embeddings API

export async function generateVector(content) {
  // Placeholder: Generate a 1536-dimensional vector
  // In production, this would call Claude embeddings API
  // For MVP, we'll use a simple deterministic approach

  const vector = new Array(1536).fill(0);

  // Simple hash-based vector generation
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Distribute hash across vector dimensions
  for (let i = 0; i < 1536; i++) {
    vector[i] = Math.sin(hash + i) * 0.5 + 0.5; // Normalize to 0-1
  }

  return vector;
}

// Semantic search using vector similarity
export async function semanticSearch(queryVector, memories) {
  // Calculate cosine similarity between query and each memory
  const results = memories.map(memory => {
    const similarity = cosineSimilarity(queryVector, memory.vector);
    return {
      ...memory,
      similarity,
    };
  });

  // Sort by similarity and return top results
  return results.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vec1, vec2) {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}
