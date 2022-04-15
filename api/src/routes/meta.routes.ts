/**
 * Meta routes.
 */

// External imports.
import express from "express"

// Middleware imports.
import { system } from "@middlewares/system.middlewares"

// Process imports.
import { listOwnedGuilds } from "@processes/discord.processes"
import { invalidateInCache } from "@utils/cache"

// The router.
export const meta = express.Router({ mergeParams: true })

/**
 * List guilds that a user is in.
 */
meta.get("/guilds", system({ expect: false }), async (req, res) => {
  // Localize parameters from request context.
  const sub = req.actor.sub
  // Invalidate any existing data in the cache.
  if (process.env.NODE_ENV === "production") {
    await invalidateInCache({ key: `${sub}|guilds` })
  }
  // Retrieve data.
  const { items: guilds } = await listOwnedGuilds({ sub })
  // Return it.
  res.status(200).send(guilds)
})
