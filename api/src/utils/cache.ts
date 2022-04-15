/**
 * Cache utilities.
 */

// Utility imports.
import { redis } from "@utils/redis"

/**
 * Get a value from cache.
 */
interface GetFromCacheInput {
  key: string
}
export async function getFromCache<T = object>({
  key,
}: GetFromCacheInput): Promise<T | undefined> {
  const value = await redis.get(`cache:${key}`)
  if (!value) return
  return JSON.parse(value)
}

/**
 * Set a value in cache.
 */
interface SetInCacheInput {
  key: string
  value: object
  ttl?: number
}
export async function setInCache({ key, value, ttl = 30 }: SetInCacheInput) {
  const valueJSON = JSON.stringify(value)
  await redis.set(`cache:${key}`, valueJSON, "EX", ttl)
}

/**
 * Invalidate a value in cache.
 */
interface InvalidateInCacheInput {
  key: string
}
export async function invalidateInCache({ key }: InvalidateInCacheInput) {
  await redis.del(`cache:${key}`)
}
