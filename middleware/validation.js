// Input validation middleware

export function validateMemoryCapture(req, res, next) {
  const { content, project_id, section, subsection, source } = req.body;

  const errors = [];

  // Validate content
  if (!content || typeof content !== 'string') {
    errors.push('content is required and must be a string');
  } else if (content.trim().length === 0) {
    errors.push('content cannot be empty');
  } else if (content.length > 5000) {
    errors.push('content cannot exceed 5000 characters');
  }

  // Validate project_id if provided
  if (project_id && !isValidUUID(project_id)) {
    errors.push('project_id must be a valid UUID');
  }

  // Validate section
  const validSections = ['personal', 'project', 'others'];
  if (section && !validSections.includes(section)) {
    errors.push(`section must be one of: ${validSections.join(', ')}`);
  }

  // Validate subsection
  const validSubsections = ['stack', 'architecture', 'preferences', 'tasks', 'decisions', 'general'];
  if (subsection && !validSubsections.includes(subsection)) {
    errors.push(`subsection must be one of: ${validSubsections.join(', ')}`);
  }

  // Validate source
  if (source && typeof source !== 'string') {
    errors.push('source must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
      },
    });
  }

  next();
}

export function validateMemoryQuery(req, res, next) {
  const { project_id } = req.query;

  const errors = [];

  if (project_id && !isValidUUID(project_id)) {
    errors.push('project_id must be a valid UUID');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
      },
    });
  }

  next();
}

export function validatePagination(req, res, next) {
  const { page, limit } = req.query;

  if (page) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        error: {
          message: 'page must be a positive integer',
          code: 'VALIDATION_ERROR',
        },
      });
    }
  }

  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        error: {
          message: 'limit must be between 1 and 100',
          code: 'VALIDATION_ERROR',
        },
      });
    }
  }

  next();
}

// Helper function to validate UUID
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
