/**
 * Name processes.
 */

// Provider imports.
import {
  pickName,
  addName,
  reserveName,
  listCustomNames,
  checkNameInUse,
} from "@providers/name.providers"

// Utility imports.
import { generateName } from "@utils/names"

/**
 * Pick name process.
 */
interface PickNameProcessInput {
  serverId: string
  reservationId: string
}
interface PickNameProcessOutput {
  item: string
}
export async function pickNameProcess({
  serverId,
  reservationId,
}: PickNameProcessInput): Promise<PickNameProcessOutput> {
  // Pick a name.
  const { item } = await pickName({ serverId })
  // If we didn't get a name, we need to generate and add one.
  if (!item) {
    let added = false
    let name: string
    do {
      // Generate a name.
      name = await generateName()
      // Add it to the set of in-use names.
      // Here, if we get back false it means the name is already in use,
      // thus we need to generate a new one.
      added = await addName({ serverId, name })
    } while (!added)
    // Reserve the name.
    await reserveName({ serverId, reservationId, name })
    // Return the generated, unique name.
    return { item: name }
  }
  // Reserve the name.
  await reserveName({ serverId, reservationId, name: item })
  // Return the picked name.
  return { item }
}

/**
 * List custom names process.
 *
 * Lists names and also checks if names are in use.
 */
interface ListCustomNamesProcessInput {
  serverId: string
  cursor?: string
}
interface ListCustomNamesProcessOutput {
  items: { name: string; inuse: boolean }[]
  cursor?: string
}
export async function listCustomNamesProcess({
  serverId,
  cursor,
}: ListCustomNamesProcessInput): Promise<ListCustomNamesProcessOutput> {
  const { items, cursor: newCursor } = await listCustomNames({
    serverId,
    cursor,
  })
  const results: { name: string; inuse: boolean }[] = []
  for (const name of items) {
    const inuse = await checkNameInUse({ serverId, name })
    results.push({ name, inuse })
  }
  return {
    items: results,
    cursor: newCursor,
  }
}
