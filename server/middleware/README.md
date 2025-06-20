# Server Middleware

This directory contains custom middleware for the AGENTS.md Educational Platform.

## Mutation Disabling Middleware

### Purpose
The `disableMutations.ts` middleware provides production safety by blocking write operations (POST, PUT, PATCH, DELETE) when the `MUTATIONS_ENABLED` environment variable is not set to `'true'`.

### Usage
This middleware is automatically applied to all routes in the application. It allows:

- **GET, HEAD, OPTIONS requests**: Always allowed (read-only operations)
- **POST, PUT, PATCH, DELETE requests**: Blocked unless `MUTATIONS_ENABLED=true`

### Environment Configuration

| Environment | MUTATIONS_ENABLED | Behavior |
|-------------|-------------------|----------|
| Local Development | undefined | All operations allowed |
| Production (default) | undefined | Write operations return 403 |
| Admin Portal Live | `true` | All operations allowed |

### Implementation
The middleware is registered early in the server startup process in `server/index.ts`:

```typescript
import { disableMutations } from "./middleware/disableMutations";
app.use(disableMutations);
```

### Response Format
When mutations are disabled, write operations return:

```json
{
  "error": "Write operations are disabled until the admin portal is live."
}
```

### Deployment Strategy
1. Deploy with `MUTATIONS_ENABLED` unset (default)
2. All read operations continue working normally
3. Write operations are blocked with 403 responses
4. When admin portal is ready, set `MUTATIONS_ENABLED=true` and redeploy
5. All operations resume normal functionality

This approach ensures data integrity in production while maintaining the complete codebase for easy reactivation.