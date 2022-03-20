/**
 * Name routes.
 */

// External imports.
import express from "express"

// Process imports.
import { pickNameProcess } from "@processes/name.processes"

// Provider imports.
import { getReservationName } from "@providers/name.providers"

// The router.
export const names = express.Router({ mergeParams: true })

/**
 * Get a name for a new channel.
 */
names.get("/:serverId/names/:reservationId", async (req, res) => {
  // Localize parameters from request context.
  const serverId = req.params.serverId
  const reservationId = req.params.reservationId
  // See if there's already a name for this reservation.
  const recoveredName = await getReservationName({
    serverId,
    reservationId,
  })
  if (recoveredName) {
    // Return the recovered name for the reservation.
    res.status(200).send({
      name: recoveredName,
      reservationId,
      message: "RECOVERED",
    })
  } else {
    // Pick a new name for the reservation.
    const { item: reservedName } = await pickNameProcess({
      serverId,
      reservationId,
    })
    // Return it.
    res.status(200).send({
      name: reservedName,
      reservationId,
      message: "RESERVED",
    })
  }
})
