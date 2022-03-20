/**
 * Name utility unit tests.
 */

// Test subject imports.
import { generateName } from "./names"

/**
 * Verify that the generated channel names are a string.
 */
describe("When generating channel names...", () => {
  it("...return a string", async () => {
    const name = await generateName()
    expect(typeof name).toBe("string")
    expect(name.length).toBeGreaterThan(0)
  })
})
