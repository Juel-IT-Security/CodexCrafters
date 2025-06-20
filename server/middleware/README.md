# Server Middleware Documentation

This directory contains production-ready middleware for the AGENTS.md Educational Platform, demonstrating enterprise-grade security, performance, and monitoring patterns.

## 📖 Educational Focus
Each middleware demonstrates real-world production patterns used in professional software development, complete with educational comments and learning references.

## Middleware Components

### 1. Mutation Disabling Middleware (`disableMutations.ts`)

**Purpose**: Production safety through environment-based feature toggling
**Educational Topics**: Deployment safety, feature flags, graceful degradation

**Key Learning Points**:
- Environment-based configuration patterns
- Non-destructive deployment strategies
- Read-only mode implementation
- Safe production rollout techniques

**Usage Pattern**:
```typescript
import { disableMutations } from "./middleware/disableMutations";
app.use(disableMutations); // Apply before route handlers
```

**Environment Configuration**:

| Environment | MUTATIONS_ENABLED | Behavior | Use Case |
|-------------|-------------------|----------|----------|
| Local Development | undefined | All operations allowed | Full functionality for testing |
| Production (default) | undefined | Write operations return 403 | Read-only safe deployment |
| Admin Portal Live | `true` | All operations allowed | Full functionality restored |

**HTTP Method Handling**:
- **Safe Methods** (GET, HEAD, OPTIONS): Always allowed - no server state changes
- **Write Methods** (POST, PUT, PATCH, DELETE): Blocked until explicitly enabled

**Response Format**:
```json
{
  "error": "Write operations are disabled until the admin portal is live."
}
```

### 2. Enhanced Error Handler (`errorHandler.ts`)

**Purpose**: Production-ready error monitoring with security and user experience focus
**Educational Topics**: Error handling, logging, security, monitoring

**Key Learning Points**:
- Comprehensive error logging with context
- Sensitive data protection in logs
- Environment-aware error responses
- Error tracking with unique identifiers
- Global exception handling patterns

**Features**:
- **Error ID Generation**: Unique identifiers for tracking and support correlation
- **Sensitive Data Masking**: Request bodies masked in logs to prevent data leaks
- **Environment-Aware Responses**: Detailed errors in development, safe messages in production
- **Comprehensive Logging**: Full context capture for debugging without exposing secrets
- **Unhandled Exception Protection**: Global handlers for promises and synchronous errors

**Production Integration Points**:
```typescript
// Error monitoring service integration (Sentry, DataDog, etc.)
// Replace console.error with monitoring service calls
```

**Error Response Format**:
```typescript
// Development Environment
{
  "message": "Detailed error message",
  "errorId": "abc123def456",
  "stack": "Full stack trace..."
}

// Production Environment  
{
  "message": "User-friendly error message",
  "errorId": "abc123def456"
}
```

## Implementation Order

The middleware stack is carefully ordered in `server/index.ts` for optimal security and performance:

1. **Compression** - Performance optimization (reduce response size)
2. **CORS** - Security (control cross-origin requests)
3. **Helmet** - Security (add protective headers)
4. **Rate Limiting** - Abuse prevention (limit request frequency)
5. **Mutation Disabling** - Production safety (control write operations)
6. **Body Parsing** - Functionality (parse request bodies)
7. **Custom Logging** - Monitoring (track performance and issues)
8. **Error Handler** - Reliability (handle and log errors)

## Learning Objectives

### Security Patterns
- Environment-based configuration
- Sensitive data protection
- Error information disclosure controls
- Request validation and sanitization

### Production Patterns
- Feature toggling and deployment safety
- Comprehensive error monitoring
- Performance optimization techniques
- Graceful degradation strategies

### Monitoring & Observability
- Error tracking and correlation
- Performance monitoring
- Security event logging
- User experience optimization

## Testing Patterns

### Mutation Disabling Testing
```bash
# Test read operations (should work)
curl -X GET http://localhost:5000/api/examples

# Test write operations (should be blocked)
curl -X POST http://localhost:5000/api/examples -d '{"test": "data"}'
```

### Error Handler Testing
```typescript
// Trigger error to test error handling
app.get('/test-error', () => {
  throw new Error('Test error for monitoring');
});
```

## Integration with Monitoring Services

The middleware is designed for easy integration with professional monitoring tools:

- **Sentry**: Error tracking and performance monitoring
- **DataDog**: Infrastructure and application monitoring  
- **New Relic**: Application performance monitoring
- **LogRocket**: User session recording and debugging

Replace `console.error` calls with your monitoring service's API for production deployment.

## Best Practices Demonstrated

1. **Defense in Depth**: Multiple layers of security and error handling
2. **Fail-Safe Defaults**: Secure by default, require explicit enabling
3. **Observability**: Comprehensive logging without security risks
4. **User Experience**: Clear error messages and graceful degradation
5. **Developer Experience**: Detailed information in development, security in production