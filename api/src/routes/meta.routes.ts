/**
 * Meta routes.
 */

// External imports.
import { system } from "@middlewares/system.middlewares"
import { withDiscordContext } from "@utils/discord"
import { NotFoundError } from "@utils/exceptions"
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
    const result = await axios({
      method: "GET",
      baseURL: "https://discord.com/api",
      url: "/users/@me/guilds",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: null,
    })
    return result.data
  })

  if (!response) {
    throw new NotFoundError()
  }

  // Return it.
  res.status(200).send(response)
})
