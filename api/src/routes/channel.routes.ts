/**
 * Channel routes.
 */

// External imports.
import express from "express"
import { assert } from "superstruct"

// Process imports.
import { assignReservation, clearChannel } from "@processes/channel.processes"

// Schema imports.
import { ApplyReservationSchema } from "@schemas/channel.schemas"

// The router.
export const channels = express.Router({ mergeParams: true })

/**
 * Assign a reservation to a channel.
 */
channels.put("/:serverId/channels/:channelId", async (req, res) => {
  // Validate request body.
  assert(req.body, ApplyReservationSchema)
  // Localize parameters from request context.
  const serverId = req.params.serverId
  const channelId = req.params.channelId
  const reservationId = req.body.reservationId
  // Assign the reservation.
  const result = await assignReservation({
    serverId,
    reservationId,
    channelId,
  })
  // Return the response.
  if (result) {
    res.status(200).send({ message: "UPDATED" })
  } else {
    res.status(200).send({ message: "UNCHANGED" })
  }
})

/**
 * Clear a channels name.
 */
channels.delete("/:serverId/channels/:channelId", async (req, res) => {
  // Localize parameters from request context.
  const serverId = req.params.serverId
  const channelId = req.params.channelId
  // Clear the channel.
  const result = await clearChannel({
    serverId,
    channelId,
  })
  // Return the response.
  if (result) {
    res.status(200).send({ message: "CLEARED" })
  } else {
    res.status(200).send({ message: "UNCHANGED" })
  }
})
