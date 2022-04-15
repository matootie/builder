/**
 * Category processes.
 */

// Provider imports.
import { checkCategory } from "@providers/category.providers"
import { listChannelsInGuild } from "@providers/discord.providers"

/**
 * List categories in guild.
 */
interface ListCategoriesProcessInput {
  serverId: string
}
export interface ListCategoriesProcessCategory {
  id: string
  name: string
  enabled: boolean
}
interface ListCategoriesProcessOutput {
  items: ListCategoriesProcessCategory[]
}
export async function listCategoriesProcess({
  serverId,
}: ListCategoriesProcessInput): Promise<ListCategoriesProcessOutput> {
  const { items } = await listChannelsInGuild({ serverId })
  const results: ListCategoriesProcessCategory[] = []
  for (const item of items) {
    const enabled = await checkCategory({ serverId, categoryId: item.id })
    results.push({
      id: item.id,
      name: item.name,
      enabled,
    })
  }
  return { items: results }
}
