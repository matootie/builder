/**
 * Channel providers unit tests.
 */

// Utility imports.
import { redis } from "@utils/redis"

// Test subject imports.
import { associateChannel, disassociateChannel } from "./channel.providers"

// Mock the Redis client.
jest.mock("@utils/redis")

/**
 * Test associating a channel.
 */
describe("When associating a channel...", () => {
  test("...return true when it has been associated.", async () => {
    // Fake associating the channel with a name.
    let channelAssociation: string | undefined
    redis.set = jest.fn().mockImplementation((_key, name: string) => {
      channelAssociation = name
      return "OK"
    })
    // Run the test subject function.
    const result = await associateChannel({
      serverId: "123",
      channelId: "123",
      name: "Ooga Booga",
    })
    // Assert.
    expect(channelAssociation).toBeDefined()
    expect(channelAssociation).toBe("Ooga Booga")
    expect(result).toBe(true)
  })
})

/**
 * Test disassociating a channel.
 */
describe("When disassociating a channel...", () => {
  test("...return true when it has been disassociated.", async () => {
    // Fake disassociating the channel with a name.
    let channelAssociation: string | undefined = "Ooga Booga"
    redis.del = jest.fn().mockImplementation(() => {
      channelAssociation = undefined
      return 1
    })
    // Run the test subject function.
    const result = await disassociateChannel({
      serverId: "123",
      channelId: "123",
    })
    // Assert.
    expect(channelAssociation).toBeUndefined()
    expect(result).toBe(true)
  })
})
