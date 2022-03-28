import { Request, Response, NextFunction } from "express"

import { ForbiddenError } from "@utils/exceptions"

/**
 * Check system user.
 */
interface CheckSystemInput {
  system: boolean
  expect?: boolean
}
export function checkSystem({
  system,
  expect = true,
}: CheckSystemInput): boolean {
  return system === expect
}

/**
 * Express system user handler.
 */
export const system = ({ expect }: { expect?: boolean }) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!checkSystem({ system: req.actor.system, expect })) {
      throw new ForbiddenError(
        "You do not have permission to perform this action.",
      )
    }
    // Continue to the next handler.
    next()
  }
}
