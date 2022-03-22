import { ForbiddenError } from "@utils/exceptions"
import { Request, Response, NextFunction } from "express"

/**
 * Check permissions.
 */
interface CheckPermissionInput {
  requiredPermission: string
  existingPermissions: string[]
}
export function checkPermission({
  requiredPermission,
  existingPermissions,
}: CheckPermissionInput): boolean {
  return existingPermissions.includes(requiredPermission)
}

/**
 * Express permissions handler.
 */
export const perms = (p: string | string[]) => {
  const requiredPermissions = typeof p === "string" ? [p] : p
  return async (req: Request, _res: Response, next: NextFunction) => {
    const existingPermissions = req.actor.permissions
    // As long as the actor doesn't have the omniperm...
    if (!checkPermission({ requiredPermission: "*", existingPermissions })) {
      // For every permission in the list of required permissions...
      for (const permission of requiredPermissions) {
        // If the actor doesn't have the permission...
        if (
          !checkPermission({
            requiredPermission: permission,
            existingPermissions,
          })
        ) {
          // Throw.
          throw new ForbiddenError(
            "You do not have permission to perform this action.",
          )
        }
      }
    }
    // Continue to the next handler.
    next()
  }
}
