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
 * Reserve a name for the future.
 */
interface ReserveNameInput {
  serverId: string
  reservationId: string
  name: string
}
export async function reserveName({
  serverId,
  reservationId,
  name,
}: ReserveNameInput): Promise<boolean> {
  // Build the key.
  const key = keyify(serverId, `reservation:${reservationId}`)
  // Write the reservation to the database.
  const result = await redis.set(key, name)
  // Return whether or not the result was OK.
  return result === "OK"
}

/**
 * Get the name from a reservation.
 */
interface GetReservationNameInput {
  serverId: string
  reservationId: string
}
export async function getReservationName({
  serverId,
  reservationId,
}: GetReservationNameInput): Promise<string | undefined> {
  // Build the key.
  const key = keyify(serverId, `reservation:${reservationId}`)
  // Get the name.
  const name = await redis.get(key)
  // Return the result.
  if (name === null) return
  return name
}

/**
 * Clear the reservation of a name.
 */
interface ClearReservedNameInput {
  serverId: string
  reservationId: string
}
export async function clearReservedName({
  serverId,
  reservationId,
}: ClearReservedNameInput): Promise<boolean> {
  // Build the key.
  const key = keyify(serverId, `reservation:${reservationId}`)
  // Clear the reservation.
  const result = await redis.del(key)
  // Return whether or not the delete was successful.
  return result === 1
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

/**
 * Check if a name is in use.
 */
interface CheckNameInUseInput {
  serverId: string
  name: string
}
export async function checkNameInUse({
  serverId,
  name,
}: CheckNameInUseInput): Promise<boolean> {
  // Build the keys.
  const key = keyify(serverId, "names:inuse")
  // Check if the name exists in the set of used names.
  const response = await redis.sismember(key, name)
  // Return.
  return response === 1
}

/**
 * Add a custom name.
 */
interface AddCustomNameInput {
  serverId: string
  name: string
}
export async function addCustomName({
  serverId,
  name,
}: AddCustomNameInput): Promise<boolean> {
  // Build the keys.
  const customs = keyify(serverId, "names:custom")
  const usable = keyify(serverId, "names:usable")
  // Add the names.
  const response = await redis.sadd(customs, name)
  const added = response === 1
  if (added) await redis.sadd(usable, name)
  // Return.
  return added
}

/**
 * Remove a custom name.
 */
interface RemoveCustomNameInput {
  serverId: string
  name: string
}
export async function removeCustomName({
  serverId,
  name,
}: RemoveCustomNameInput): Promise<boolean> {
  // Build the keys.
  const customs = keyify(serverId, "names:custom")
  const inuse = keyify(serverId, "names:inuse")
  const usable = keyify(serverId, "names:usable")
  // Remove the names.
  const response = await redis.srem(customs, name)
  const removed = response === 1
  if (removed) {
    await redis.srem(inuse, name)
    await redis.srem(usable, name)
  }
  // Return.
  return removed
}

/**
 * List custom names.
 */
interface ListCustomNamesInput {
  serverId: string
  cursor?: string
}
interface ListCustomNamesOutput {
  items: string[]
  cursor?: string
}
export async function listCustomNames({
  serverId,
  cursor,
}: ListCustomNamesInput): Promise<ListCustomNamesOutput> {
  // Build the key.
  const customs = keyify(serverId, "names:custom")
  // List items.
  const [newCursor, names] = await redis.sscan(customs, cursor ?? 0)
  // Return.
  return {
    items: names,
    cursor: newCursor || undefined,
  }
}
