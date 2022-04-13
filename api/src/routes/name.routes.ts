/**
 * Name routes.
 */

// External imports.
import express from "express"

// Process imports.
import {
  listCustomNamesProcess,
  pickNameProcess,
} from "@processes/name.processes"

// Provider imports.
import {
  addCustomName,
  getReservationName,
  removeCustomName,
} from "@providers/name.providers"
import { perms } from "@middlewares/permission.middlewares"

// The router.
export const names = express.Router({ mergeParams: true })

/**
 * Get a name for a new channel.
 */
names.get(
  "/:serverId/names/:reservationId",
  perms("read:names"),
  async (req, res) => {
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
  },
)

/**
 * Add a custom name.
 */
names.put("/:serverId/names/:name", perms("manage:names"), async (req, res) => {
  const serverId = req.params.serverId
  const name = req.params.name
  const result = await addCustomName({ serverId, name })
  if (result) {
    res.status(200).send({ message: "ADDED" })
  } else {
    res.status(200).send({ message: "UNCHANGED" })
  }
})

/**
 * Remove a custom name.
 */
names.delete(
  "/:serverId/names/:name",
  perms("manage:names"),
  async (req, res) => {
    const serverId = req.params.serverId
    const name = req.params.name
    const result = await removeCustomName({ serverId, name })
    if (result) {
      res.status(200).send({ message: "REMOVED" })
    } else {
      res.status(200).send({ message: "UNCHANGED" })
    }
  },
)

/**
 * List custom names.
 */
names.get("/:serverId/names", perms("manage:names"), async (req, res) => {
  const serverId = req.params.serverId
  const result = await listCustomNamesProcess({ serverId })
  res.status(200).send(result)
})
