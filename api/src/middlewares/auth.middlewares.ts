/**
 * Auth middleware.
 */

// External imports.
import { Request, Response, NextFunction } from "express"

// Utility imports.
import { UnauthorizedError } from "@utils/exceptions"
import { IncomingHttpHeaders } from "http"
import { redis } from "@utils/redis"
import { keyify } from "@utils/keys"

/**
 * Auth handler logic.
 */
interface CheckAuthInput {
  headers: IncomingHttpHeaders
}
interface CheckAuthOutput {
  name?: string
}
export async function checkAuth({
  headers,
}: CheckAuthInput): Promise<CheckAuthOutput> {
  // Get the API key from request headers.
  const apiKey = headers["x-api-key"]
  if (!apiKey) throw new UnauthorizedError("Missing X-API-KEY header.")
  // Build the key.
  const key = keyify("admin", apiKey)
  // Validate that the API key exists in Redis.
  const exists = await redis.exists(key)
  if (exists === 0) throw new UnauthorizedError("Invalid API key.")
  // Get the actor data.
  const actor = await redis.hgetall(key)
  // Increment the total request count.
  await redis.hincrby(key, "requestCount", 1)
  // Return relevant actor metadata.
  return {
    name: actor.name,
  }
}

/**
 * Express auth handler.
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // Check authorization and get metadata about the actor.
  const actor = await checkAuth({ headers: req.headers })
  // Bind the actor to the request context.
  req.actor = actor
  // Continue to the next handler.
  next()
}
