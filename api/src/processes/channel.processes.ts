/**
 * Channel processes.
 */

// Provider imports.
import {
  associateChannel,
  disassociateChannel,
  getChannelName,
} from "@providers/channel.providers"
import {
  clearReservedName,
  getReservationName,
  retireName,
} from "@providers/name.providers"

/**
 * Assign reservation to channel.
 */
interface AssignReservationInput {
  serverId: string
  reservationId: string
  channelId: string
}
export async function assignReservation({
  serverId,
  reservationId,
  channelId,
}: AssignReservationInput): Promise<boolean> {
  // Get the name from the reservation.
  const name = await getReservationName({ serverId, reservationId })
  if (!name) return false
  // Associate the channel with the name.
  const result = await associateChannel({ serverId, channelId, name })
  // Clear the reservation.
  await clearReservedName({ serverId, reservationId })
  // Return the result.
  return result
}

/**
 * Clear a channel.
 */
interface ClearChannelInput {
  serverId: string
  channelId: string
}
export async function clearChannel({
  serverId,
  channelId,
}: ClearChannelInput): Promise<boolean> {
  // Get the associated name for the channel.
  const name = await getChannelName({ serverId, channelId })
  // Clear the association.
  const result = await disassociateChannel({ serverId, channelId })
  // Retire the name.
  if (name) await retireName({ serverId, name })
  return result
}
