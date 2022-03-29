import { Request, Response, NextFunction } from "express"

import { ForbiddenError, ServerError } from "@utils/exceptions"
import { listGuildsForUser } from "@providers/discord.providers"

/**
 * Check Discord admin user.
 */
interface CheckOwnerInput {
  sub: string
  serverId: string
}
export async function checkOwner({
  sub,
  serverId,
}: CheckOwnerInput): Promise<boolean> {
  const { items: servers } = await listGuildsForUser({ sub })
  const server = servers.find((server) => server.id === serverId)
  return server?.owner || false
}

/**
 * Express system user handler.
 */
interface DiscordOwnerCheckOptions {
  param: string
  location?: "path" | "query"
}
export const owner = ({
  param,
  location = "path",
}: DiscordOwnerCheckOptions) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    let serverId: string | undefined
    if (location === "path") {
      serverId = req.params[param]
    } else if (location === "query") {
      serverId = req.query[param] as string
      if (!serverId) return next()
    }
    if (!serverId) {
      throw new ServerError("Unexpected server ownership requirement.")
    }
    const result = await checkOwner({ sub: req.actor.sub, serverId })
    if (result === false) {
      throw new ForbiddenError("You are not an owner of this server.")
    }
    // Continue to the next handler.
    next()
  }
}
