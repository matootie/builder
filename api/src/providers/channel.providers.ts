/**
 * Channel providers.
 *
 * - Associate a channel ID with a name.
 * - Disassociate a channel ID with a name.
 */

// Utility imports.
import { redis } from "@utils/redis"
import { keyify } from "@utils/keys"

/**
 * Associate a channel ID with a name.
 */
interface AssociateChannelInput {
  serverId: string
  channelId: string
  name: string
}
export async function associateChannel({
  serverId,
  channelId,
  name,
}: AssociateChannelInput): Promise<boolean> {
  // Build the key.
  const channelKey = keyify(serverId, channelId)
  // Associate the channel with the name.
  const result = await redis.set(channelKey, name)
  // Return whether or not the result was OK.
  return result === "OK"
}

/**
 * Get the name of a channel.
 */
interface GetChannelNameInput {
  serverId: string
  channelId: string
}
export async function getChannelName({
  serverId,
  channelId,
}: GetChannelNameInput): Promise<string | undefined> {
  // Build the key.
  const key = keyify(serverId, channelId)
  // Get the associated name for the channel.
  const result = await redis.get(key)
  // Return the result.
  if (result === null) return undefined
  return result
}

/**
 * Disassociate a channel ID with a name.
 */
interface DisassociateChannelInput {
  serverId: string
  channelId: string
}
export async function disassociateChannel({
  serverId,
  channelId,
}: DisassociateChannelInput): Promise<boolean> {
  // Build the key.
  const channelKey = keyify(serverId, channelId)
  // Remove the association between the channel and the name.
  const result = await redis.del(channelKey)
  // Return whether or not the channel was disassociated.
  return result === 1
}
