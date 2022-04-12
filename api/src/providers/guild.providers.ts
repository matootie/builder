/**
 * Guild providers.
 *
 * - Mark a guild as joined.
 * - Mark a guild as left (unmark join).
 * - Check if in a guild.
 */

// Utility imports.
import { redis } from "@utils/redis"
import { keyify } from "@utils/keys"

/**
 * Check if in a guild.
 */
interface CheckGuildInput {
  serverId: string
}
export async function checkGuild({ serverId }: CheckGuildInput) {
  // Build the key.
  const key = keyify("joined", serverId)
  // Check if the key exists.
  const exists = await redis.exists(key)
  // Return whether or not the result was OK.
  if (!exists) return
  return await redis.hgetall(key)
}

/**
 * Mark a guild as joined or left.
 */
interface MarkGuildInput {
  serverId: string
  joined?: boolean
}
export async function markGuild({
  serverId,
  joined = true,
}: MarkGuildInput): Promise<boolean> {
  // Build the key.
  const key = keyify("joined", serverId)
  if (joined) {
    if (await checkGuild({ serverId })) {
      return false
    }
    // Get the associated name for the channel.
    const result = await redis.hset(key, { date: Date.now() })
    return result === 1
  } else {
    // Get the associated name for the channel.
    const result = await redis.del(key)
    return result === 1
  }
}
