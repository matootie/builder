/**
 * Discord processes.
 */

// Provider imports.
import {
  listGuildsForUser,
  ListGuildsForUserGuild,
} from "@providers/discord.providers"

/**
 * List owned guilds.
 */
interface ListOwnedGuildsInput {
  sub: string
}
interface ListOwnedGuildsOutput {
  items: ListGuildsForUserGuild[]
}
export async function listOwnedGuilds({
  sub,
}: ListOwnedGuildsInput): Promise<ListOwnedGuildsOutput> {
  const { items: guilds } = await listGuildsForUser({ sub })
  return {
    items: guilds.filter((guild) => guild.owner),
  }
}
