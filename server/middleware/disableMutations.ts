import { Request, Response, NextFunction } from 'express';

/**
 * Blocks any non-GET/HEAD/OPTIONS request when MUTATIONS_ENABLED !== 'true'.
 * Keeps the code in place so it's easy to re-enable once the admin UI ships.
 */
export function disableMutations(req: Request, res: Response, next: NextFunction) {
  const readMethods = ['GET', 'HEAD', 'OPTIONS'];
  const live = process.env.MUTATIONS_ENABLED === 'true';

  if (!live && !readMethods.includes(req.method)) {
    return res.status(403).json({
      error: 'Write operations are disabled until the admin portal is live.',
    });
  }

  next();
}