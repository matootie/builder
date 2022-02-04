/**
 * Cryptographic utility unit tests.
 */

// Test subject imports.
import { createHash as createHashCrypto } from "crypto"
import { createHash, createSalt } from "./crypto"

/**
 * Ensure creating salt makes a random string.
 */
describe("When creating salt...", () => {
  it("...return a string.", () => {
    const salt = createSalt(32)
    expect(salt).toBeDefined()
    expect(typeof salt).toBe("string")
    expect(salt.length).toBe(32)
  })
})

/**
 * Ensure creating a hash works properly.
 */
describe("When creating a hash...", () => {
  it("...should hash properly.", () => {
    const data = "Ooga Booga"
    const salt = "12345"
    const hash = createHashCrypto("sha256")
    hash.update(data + salt)
    const expected = hash.digest("hex")
    const result = createHash({ value: data, salt })
    expect(result).toBe(expected)
  })
})
