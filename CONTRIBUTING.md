# Contributing to MemoryLayer

Thank you for your interest in contributing to MemoryLayer! We welcome contributions from the community.

## Code of Conduct

Please be respectful and constructive in all interactions. We're committed to providing a welcoming and inclusive environment.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Git
- Supabase account (free tier works)

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/eres007/Kiwo.git
cd Kiwo

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
# NEXT_PUBLIC_SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
# JWT_SECRET=...
# ENCRYPTION_KEY=...

# Start development server
npm run dev

# In another terminal, run tests
npm test
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Keep functions small and focused

### 3. Write Tests

```bash
# Add tests for your feature
# Tests should be in the same directory as the code

# Run tests to ensure they pass
npm test
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing feature"
# or
git commit -m "fix: resolve critical bug"
```

**Commit Message Format:**
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for test additions
- `chore:` for maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Description of what was changed and why
- Reference to any related issues
- Screenshots if applicable

## Code Style Guidelines

### JavaScript/Node.js

```javascript
// Use const by default, let if needed
const value = 'constant';
let counter = 0;

// Use arrow functions
const add = (a, b) => a + b;

// Use async/await
async function fetchData() {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Use destructuring
const { name, email } = user;
const [first, ...rest] = array;

// Use template literals
const message = `Hello, ${name}!`;

// Use meaningful variable names
const userEmail = 'user@example.com'; // Good
const ue = 'user@example.com'; // Bad

// Add comments for complex logic
// Calculate importance score based on frequency and recency
const score = (frequency * 0.7) + (recency * 0.3);
```

### Error Handling

```javascript
// Always handle errors
try {
  const result = await operation();
  return result;
} catch (error) {
  logger.error('Operation failed', { error: error.message });
  throw new Error('User-friendly error message');
}

// Use structured error responses
res.status(400).json({
  error: {
    message: 'Invalid input',
    code: 'INVALID_INPUT',
    details: 'Email is required'
  }
});
```

### Logging

```javascript
// Use structured logging
logger.info('User created', { user_id: userId, email });
logger.warn('Rate limit approaching', { ip, requests: 95 });
logger.error('Database error', { error: error.message, query });
```

## Testing Guidelines

### Writing Tests

```javascript
// Test file: test-feature.js
import http from 'http';

async function testFeature() {
  console.log('\n=== TEST: Feature Name ===');
  
  try {
    const response = await makeRequest('POST', '/api/endpoint', data);
    
    if (response.status === 200 && response.body.success) {
      console.log('✅ Test passed');
      return true;
    } else {
      console.log('❌ Test failed');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm run test:auth

# Run with verbose output
npm test -- --verbose
```

## Documentation

### Update Documentation When:
- Adding new features
- Changing API endpoints
- Modifying configuration
- Fixing bugs that affect usage

### Documentation Format

```markdown
# Feature Name

## Description
Brief description of the feature.

## Usage
```bash
# Example code
```

## Parameters
- `param1` (type): Description
- `param2` (type): Description

## Returns
Description of return value

## Example
```javascript
// Example usage
```

## See Also
- [Related Feature](./link)
```

## Pull Request Process

1. **Before submitting:**
   - Run `npm test` and ensure all tests pass
   - Update documentation if needed
   - Check for any console errors or warnings
   - Verify your changes don't break existing functionality

2. **PR Description should include:**
   - What problem does this solve?
   - How does it solve it?
   - Any breaking changes?
   - Screenshots/examples if applicable

3. **Review process:**
   - At least one maintainer review required
   - All CI checks must pass
   - No merge conflicts
   - Code quality standards met

4. **After approval:**
   - Squash commits if requested
   - Merge to main branch
   - Delete feature branch

## Reporting Issues

### Bug Reports

Include:
- Clear title describing the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (Node version, OS, etc.)
- Error messages/logs

### Feature Requests

Include:
- Clear title describing the feature
- Use case/problem it solves
- Proposed solution
- Alternative solutions considered
- Any additional context

## Performance Considerations

When contributing, keep these in mind:

- **Database queries:** Use indexes, avoid N+1 queries
- **API responses:** Keep payloads small, use pagination
- **Memory:** Avoid memory leaks, clean up resources
- **Caching:** Cache frequently accessed data
- **Logging:** Don't log sensitive data

## Security Considerations

- Never commit secrets or credentials
- Validate all user input
- Use parameterized queries
- Sanitize error messages
- Follow OWASP guidelines
- Report security issues privately

## Getting Help

- 📧 Email: support@memorylayer.dev
- 💬 Discord: [Join our community](https://discord.gg/memorylayer)
- 📚 Docs: [Read the documentation](./README.md)
- 🐛 Issues: [GitHub Issues](https://github.com/eres007/Kiwo/issues)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to MemoryLayer! 🎉
