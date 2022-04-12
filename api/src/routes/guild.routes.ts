/**
 * Guild routes.
 */

// External imports.
import express from "express"

// Middleware imports.
import { perms } from "@middlewares/permission.middlewares"

// Provider imports.
import { checkGuild, markGuild } from "@providers/guild.providers"
import { NotFoundError } from "@utils/exceptions"

// The router.
export const guilds = express.Router({ mergeParams: true })

/**
 * Check if a guild is joined.
 */
guilds.get("/:serverId", perms("read:guilds"), async (req, res) => {
  // Localize parameters from request context.
  const serverId = req.params.serverId
  // Check the guild.
  const result = await checkGuild({ serverId })
  // Return the response.
  if (result) {
    res.status(200).send(result)
  } else {
    throw new NotFoundError("Guild not found.")
  }
})

/**
 * Mark a guild as joined.
 */
guilds.put("/:serverId", perms("manage:guilds"), async (req, res) => {
  // Localize parameters from request context.
  const serverId = req.params.serverId
  // Mark the guild.
  const result = await markGuild({ serverId, joined: true })
  // Return the response.
  if (result) {
    res.status(200).send({ message: "UPDATED" })
  } else {
    res.status(200).send({ message: "UNCHANGED" })
  }
})

/**
 * Mark a guild as left.
 */
guilds.delete("/:serverId", perms("manage:guilds"), async (req, res) => {
  // Localize parameters from request context.
  const serverId = req.params.serverId
  // Mark the guild.
  const result = await markGuild({ serverId, joined: false })
  // Return the response.
  if (result) {
    res.status(200).send({ message: "CLEARED" })
  } else {
    res.status(200).send({ message: "UNCHANGED" })
  }
})
