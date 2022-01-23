/**
 * Category providers.
 *
 * - Whitelist a category to auto-add channels.
 * - Blacklist a category to prevent auto-adds.
 */

// Utility imports.
import { redis } from "@utils/redis"
import { keyify } from "@utils/keys"

/**
 * Check if a channel category is whitelisted.
 */
interface CheckCategoryInput {
  serverId: string
  categoryId: string
}
export async function checkCategory({
  serverId,
  categoryId,
}: CheckCategoryInput): Promise<boolean> {
  // Build the key.
  const whitelist = keyify(serverId, "categories:whitelisted")
  // Check if the category is in the set of whitelisted categories.
  const result = await redis.sismember(whitelist, categoryId)
  // Return the result.
  return !!result
}

/**
 * Whitelist a channel category.
 */
interface WhitelistCategoryInput {
  serverId: string
  categoryId: string
}
export async function whitelistCategory({
  serverId,
  categoryId,
}: WhitelistCategoryInput): Promise<boolean> {
  // Build the keys.
  const whitelist = keyify(serverId, "categories:whitelisted")
  // Add the category to the set of whitelisted categories.
  const result = await redis.sadd(whitelist, categoryId)
  // Return whether or not the category was whitelisted.
  return result === 1
}

/**
 * Blacklist a channel category.
 */
interface BlacklistCategoryInput {
  serverId: string
  categoryId: string
}
export async function blacklistCategory({
  serverId,
  categoryId,
}: BlacklistCategoryInput): Promise<boolean> {
  // Build the key.
  const whitelist = keyify(serverId, "categories:whitelisted")
  // Remove the category from the set of whitelisted categories.
  const result = await redis.srem(whitelist, categoryId)
  // Return whether or not the category was blacklisted.
  return result === 1
}
