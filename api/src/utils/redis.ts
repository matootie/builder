/**
 * Redis connection utilities.
 */

// External imports.
import Redis from "ioredis"

// Export an established Redis connection.
export const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost", {
  lazyConnect: true,
})
