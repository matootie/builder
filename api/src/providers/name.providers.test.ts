/**
 * Name providers unit tests.
 */

// Utility imports.
import { redis } from "@utils/redis"

// Test subject imports.
import { pickName, addName, retireName } from "./name.providers"

// Mock the Redis client.
jest.mock("@utils/redis")

/**
 * Test picking names.
 */
describe("When picking names...", () => {
  test("...return undefined when there are no usable names.", async () => {
    // Fake that there are no names available in the set of usable names.
    redis.srandmember = jest.fn().mockResolvedValue(null)
    // Run the test subject function.
    const { item } = await pickName({ serverId: "123" })
    // Expect it to return undefined.
    expect(item).toBeUndefined()
  })
  test("...return undefined when the move was unsuccessful.", async () => {
    // Fake a name being picked from the set of usable names.
    redis.srandmember = jest.fn().mockResolvedValue("Ooga Booga")
    // Fake the name failing to move sets.
    redis.smove = jest.fn().mockResolvedValue(false)
    // Run the test subject function.
    const { item } = await pickName({ serverId: "123" })
    // Expect the resulting name.
    expect(item).toBeUndefined()
  })
  test("...move the name properly.", async () => {
    // Fake sets for usable and in-use names.
    const source = new Set(["Ooga Booga"])
    const destination = new Set()
    // Fake the implementation of picking a name.
    redis.srandmember = jest.fn().mockImplementation(() => {
      if (source.has("Ooga Booga")) {
        return "Ooga Booga"
      }
    })
    // Fake the implementation of moving a name from usable to in-use.
    redis.smove = jest.fn().mockImplementation((_src, _dest, name) => {
      source.delete(name)
      destination.add(name)
      return true
    })
    // Run the test subject function.
    const { item } = await pickName({ serverId: "123" })
    // Assert.
    expect(source.size).toBe(0)
    expect(destination.size).toBe(1)
    expect(item).toBe("Ooga Booga")
  })
})

/**
 * Test adding names.
 */
describe("When adding names...", () => {
  it("...return false when name already exists.", async () => {
    // Fake the resolution of adding the name to the set in Redis.
    redis.sadd = jest.fn().mockResolvedValue(0)
    // Run the test subject function.
    const result = await addName({ serverId: "123", name: "Ooga Booga" })
    // Assert.
    expect(result).toBe(false)
  })
  it("...return true when the name was successfully added.", async () => {
    // Fake the resolution of adding the name to the set in Redis.
    redis.sadd = jest.fn().mockResolvedValue(1)
    // Run the test subject function.
    const result = await addName({ serverId: "123", name: "Ooga Booga" })
    // Assert.
    expect(result).toBe(true)
  })
})

/**
 * Test retiring names.
 */
describe("When retiring names...", () => {
  it("...move the name from in-use to usable.", async () => {
    // Fake sets for usable and in-use names.
    const usable = new Set()
    const inuse = new Set(["Ooga Booga"])
    // Fake the implementation of moving a name from usable to in-use.
    redis.smove = jest.fn().mockImplementation((_src, _dest, name) => {
      inuse.delete(name)
      usable.add(name)
      return true
    })
    // Run the test subject function.
    await retireName({ serverId: "123", name: "Ooga Booga" })
    // Assert.
    expect(usable.size).toBe(1)
    expect(inuse.size).toBe(0)
  })
})
