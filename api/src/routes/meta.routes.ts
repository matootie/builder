/**
 * Meta routes.
 */

// External imports.
import { system } from "@middlewares/system.middlewares"
import { withDiscordContext } from "@utils/discord"
import axios from "axios"
import express from "express"

// The router.
export const meta = express.Router({ mergeParams: true })

/**
 * List guilds that a user is in.
 */
meta.get("/guilds", system({ expect: false }), async (req, res) => {
  // Localize parameters from request context.
  const sub = req.actor.sub

  const response = await withDiscordContext({ sub }, async ({ token }) => {
    return await axios({
      method: "GET",
      baseURL: "https://discord.com/api",
      url: "/users/@me/guilds",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: null,
    })
  })

  // Return it.
  res.status(response.status).send(response.data)
})
