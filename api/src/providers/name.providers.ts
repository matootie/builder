/**
 * Name providers.
 */

// Utility imports.
import { keyify } from "@utils/keys"
import { redis } from "@utils/redis"

/**
 * Pick a name.
 */
interface PickNameInput {
  serverId: string
}
interface PickNameOutput {
  item?: string
}
export async function pickName({
  serverId,
}: PickNameInput): Promise<PickNameOutput> {
  // Build the keys.
  const usable = keyify(serverId, "names:usable")
  const inuse = keyify(serverId, "names:inuse")
  // Fetch a name from the set of usable names.
  const name = await redis.srandmember(usable)
  if (!name) return {}
  // Move the name to the set of in-use names.
  const moved = await redis.smove(usable, inuse, name)
  if (!moved) return {}
  // Return the name.
  return { item: name }
}

/**
 * Add a name.
 */
interface AddNameInput {
  serverId: string
  name: string
}
export async function addName({
  serverId,
  name,
}: AddNameInput): Promise<boolean> {
  // Build the key.
  const inuse = keyify(serverId, "names:inuse")
  // Add the name to the set of in-use names.
  const result = await redis.sadd(inuse, name)
  return result > 0
}

/**
 * Retire a name.
 */
interface RetireNameInput {
  serverId: string
  name: string
}
export async function retireName({
  serverId,
  name,
}: RetireNameInput): Promise<void> {
  // Build the keys.
  const usable = keyify(serverId, "names:usable")
  const inuse = keyify(serverId, "names:inuse")
  // Move the name to the set of usable names.
  await redis.smove(inuse, usable, name)
}
