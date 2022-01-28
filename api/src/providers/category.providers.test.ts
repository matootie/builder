/**
 * Category providers unit tests.
 */

// Utility imports.
import { redis } from "@utils/redis"

// Test subject imports.
import {
  checkCategory,
  whitelistCategory,
  blacklistCategory,
} from "./category.providers"

// Mock the Redis client.
jest.mock("@utils/redis")

/**
 * Test checking a category.
 */
describe("When checking if a category is whitelisted...", () => {
  test("...return false when it is not whitelisted.", async () => {
    // Fake the result of checking the set of whitelisted categories.
    redis.sismember = jest.fn().mockResolvedValue(0)
    // Run the test subject function.
    const result = await checkCategory({ serverId: "123", categoryId: "123" })
    // Assert.
    expect(result).toBe(false)
  })
  test("...return true when it is whitelisted.", async () => {
    // Fake the result of checking the set of whitelisted categories.
    redis.sismember = jest.fn().mockResolvedValue(1)
    // Run the test subject function.
    const result = await checkCategory({ serverId: "123", categoryId: "123" })
    // Assert.
    expect(result).toBe(true)
  })
})

/**
 * Test whitelisting a category.
 */
describe("When whitelisting a category...", () => {
  test("...return true when it has been whitelisted.", async () => {
    // Fake adding a category to the set of whitelisted categories.
    const whitelisted = new Set()
    redis.sadd = jest.fn().mockImplementation((_key, item) => {
      whitelisted.add(item)
      return 1
    })
    // Run the test subject function.
    const result = await whitelistCategory({
      serverId: "123",
      categoryId: "123",
    })
    // Assert.
    expect(whitelisted.size).toBe(1)
    expect(whitelisted.has("123")).toBe(true)
    expect(result).toBe(true)
  })
  test("...return false when it is already whitelisted.", async () => {
    // Fake the result of adding a category to the set of whitelisted categories.
    redis.sadd = jest.fn().mockResolvedValue(0)
    // Run the test subject function.
    const result = await whitelistCategory({
      serverId: "123",
      categoryId: "123",
    })
    // Expect the resulting name.
    expect(result).toBe(false)
  })
})

/**
 * Test blacklisting a category.
 */
describe("When blacklisting a category...", () => {
  test("...return true when it has been blacklisted.", async () => {
    // Fake removing a category from the set of whitelisted categories.
    const whitelisted = new Set(["123"])
    redis.srem = jest.fn().mockImplementation((_key, item) => {
      whitelisted.delete(item)
      return 1
    })
    // Run the test subject function.
    const result = await blacklistCategory({
      serverId: "123",
      categoryId: "123",
    })
    // Assert.
    expect(whitelisted.size).toBe(0)
    expect(whitelisted.has("123")).toBe(false)
    expect(result).toBe(true)
  })
  test("...return false when it is already blacklisted.", async () => {
    // Fake the result of removing a category from the set of whitelisted categories.
    redis.srem = jest.fn().mockResolvedValue(0)
    // Run the test subject function.
    const result = await blacklistCategory({
      serverId: "123",
      categoryId: "123",
    })
    // Expect the resulting name.
    expect(result).toBe(false)
  })
})
