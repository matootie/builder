/**
 * Name processes.
 */

// Provider imports.
import { pickName, addName } from "@providers/name.providers"

// Utility imports.
import { generateName } from "@utils/names"

/**
 * Pick name process.
 */
interface PickNameProcessInput {
  serverId: string
}
interface PickNameProcessOutput {
  item: string
}
export async function pickNameProcess({
  serverId,
}: PickNameProcessInput): Promise<PickNameProcessOutput> {
  // Pick a name.
  const { item } = await pickName({ serverId })
  // If we didn't get a name, we need to generate and add one.
  if (!item) {
    let added = false
    let name: string
    do {
      // Generate a name.
      name = generateName()
      // Add it to the set of in-use names.
      // Here, if we get back false it means the name is already in use,
      // thus we need to generate a new one.
      added = await addName({ serverId, name })
    } while (!added)
    // Return the generated, unique name.
    return { item: name }
  }
  // Return the picked name.
  return { item }
}
