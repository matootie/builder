/**
 * Key utilities.
 */

/**
 * Format a tenant key.
 */
export function keyify(serverId: string, key: string): string {
  return `${serverId}:${key}`
}
