/**
 * Name utilities.
 */

// External imports.
import Moniker from "moniker"

// Create a name generator.
const names = Moniker.generator([Moniker.adjective, Moniker.noun], {
  glue: " ",
})

/**
 * Generate a name.
 */
export function generateName(): string {
  // Choose a name from the name generator.
  const name: string = names.choose()
  return name.replace(/\b\w/g, (c) => c.toUpperCase())
}
