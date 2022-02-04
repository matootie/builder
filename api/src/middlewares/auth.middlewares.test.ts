/**
 * Auth middleware tests.
 */

// Utility imports.
import { UnauthorizedError } from "@utils/exceptions"
import { redis } from "@utils/redis"

// Test subject imports.
import { checkAuth } from "./auth.middlewares"

jest.mock("@utils/redis")

const VALID_API_KEY = "12345"
const VALID_NAME = "Ooga Booga"
const DB = {}

/**
 * Test handling auth.
 */
describe("When handling auth...", () => {
  beforeAll(async () => {
    // Set the value in the fake database.
    DB[`admin:${VALID_API_KEY}`] = { name: VALID_NAME }
    // Fake a bunch of Redis implementation.
    redis.exists = jest.fn().mockImplementation((key) => {
      const result = DB[key]
      return !!result ? 1 : 0
    })
    redis.hgetall = jest.fn().mockImplementation((key) => {
      return DB[key]
    })
    redis.hincrby = jest.fn().mockImplementation((key, field, amount) => {
      let original = DB[key][field]
      if (!original || typeof original !== "number") original = 0
      const updated = original + amount
      DB[key][field] = updated
      return updated
    })
  })
  test("...succeed with proper API key.", async () => {
    // Run the test subject function.
    const result = await checkAuth({
      headers: { ["x-api-key"]: VALID_API_KEY },
    })
    // Assert.
    expect(result.name).toBeDefined()
    expect(result.name).toBe(VALID_NAME)
  })
  test("...fail with invalid API key.", async () => {
    // Run the test subject function.
    await expect(
      checkAuth({
        headers: { ["x-api-key"]: "Booga" },
      }),
    ).rejects.toMatchObject(new UnauthorizedError("Invalid API key."))
  })
  test("...fail with no API key.", async () => {
    // Run the test subject function.
    await expect(
      checkAuth({
        headers: {},
      }),
    ).rejects.toMatchObject(new UnauthorizedError("Missing X-API-KEY header."))
  })
})
