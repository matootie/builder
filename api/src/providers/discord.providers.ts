/**
 * Discord providers.
 */

// External imports.
import axios from "axios"

// Utility imports.
import { withDiscordContext, withDiscordSystemContext } from "@utils/discord"
import { TooManyRequestsError } from "@utils/exceptions"
import { getFromCache, setInCache } from "@utils/cache"

/**
 * List guilds that a user is in.
 */
interface ListGuildsForUserInput {
  sub: string
}
export interface ListGuildsForUserGuild {
  id: string
  name: string
  icon: string
  owner: boolean
  permissions: number
  features: string[]
  permissions_new: string
}
interface ListGuildsForUserOutput {
  items: ListGuildsForUserGuild[]
}
export async function listGuildsForUser({
  sub,
}: ListGuildsForUserInput): Promise<ListGuildsForUserOutput> {
  let guilds = await getFromCache({ key: `${sub}|guilds` })
  if (!guilds) {
    const response = await withDiscordContext({ sub }, async ({ token }) => {
      const response = await axios({
        method: "GET",
        baseURL: "https://discord.com/api",
        url: "/users/@me/guilds",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: null,
      })
      if (response.status === 401) throw new Error("Unauthorized.")
      return response
    })
    if (response.status === 429) throw new TooManyRequestsError()
    if (response.status !== 200) return { items: [] }
    guilds = response.data
    await setInCache({ key: `${sub}|guilds`, value: response.data, ttl: 600 })
  }
  return { items: guilds as ListGuildsForUserGuild[] }
}

/**
 * List channels in a guild.
 */
interface ListCategoriesInGuildInput {
  serverId: string
}
export interface ListCategoriesInGuildCategory {
  id: string
  type: number
  name: string
  [key: string]: any
}
interface ListCategoriesInGuildOutput {
  items: ListCategoriesInGuildCategory[]
}
export async function listChannelsInGuild({
  serverId,
}: ListCategoriesInGuildInput): Promise<ListCategoriesInGuildOutput> {
  let channels = await getFromCache<ListCategoriesInGuildCategory[]>({
    key: `${serverId}|channels`,
  })
  if (!channels) {
    const response = await withDiscordSystemContext(async ({ token }) => {
      const response = await axios({
        method: "GET",
        baseURL: "https://discord.com/api",
        url: `/guilds/${serverId}/channels`,
        headers: {
          Authorization: `Bot ${token}`,
        },
        validateStatus: null,
      })
      if (response.status === 401) throw new Error("Unauthorized.")
      return response
    })
    if (response.status === 429) throw new TooManyRequestsError()
    if (response.status !== 200) return { items: [] }
    channels = response.data
    await setInCache({
      key: `${serverId}|channels`,
      value: response.data,
      ttl: 10,
    })
  }
  return {
    items: channels?.filter((x) => x.type === 4) || [],
  }
}
