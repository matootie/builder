/**
 * Name processes.
 */

// Provider imports.
import { pickName, addName, reserveName } from "@providers/name.providers"

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
