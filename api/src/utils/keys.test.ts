/**
 * Tenant key utility unit tests.
 */

// Test subject imports.
import { keyify } from "./keys"

// Constants.
const SERVER_ID = "907723403639808030"
const EXAMPLE_KEY = "example:key"

/**
 * Ensure the resulting key is in the expected format.
 */
describe("When scoping a key to a tenant...", () => {
  it("...return the expected result.", () => {
    const key = keyify(SERVER_ID, EXAMPLE_KEY)
    expect(key).toBeDefined()
    expect(typeof key).toBe("string")
    expect(key).toBe(`${SERVER_ID}:${EXAMPLE_KEY}`)
  })
})
