/**
 * Channel processes unit tests.
 */

// Test subject imports.
import { assignReservation, clearChannel } from "./channel.processes"

// Provider imports.
import {
  associateChannel,
  disassociateChannel,
  getChannelName,
} from "@providers/channel.providers"
import {
  clearReservedName,
  getReservationName,
  retireName,
} from "@providers/name.providers"

// Mocks.
jest.mock("@providers/channel.providers")
const associateChannelMock = associateChannel as jest.MockedFunction<
  typeof associateChannel
>
const disassociateChannelMock = disassociateChannel as jest.MockedFunction<
  typeof disassociateChannel
>
const getChannelNameMock = getChannelName as jest.MockedFunction<
  typeof getChannelName
>
jest.mock("@providers/name.providers")
const getReservationNameMock = getReservationName as jest.MockedFunction<
  typeof getReservationName
>

/**
 * Assign reservation tests.
 */
describe("When assigning a reservation...", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it("...return false when a reservation doesn't exist.", async () => {
    // Set up mocks.
    getReservationNameMock.mockResolvedValue(undefined)
    // Run the test subject function.
    const result = await assignReservation({
      serverId: "123",
      reservationId: "123",
      channelId: "123",
    })
    // Assert.
    expect(result).toBe(false)
    expect(associateChannel).toHaveBeenCalledTimes(0)
    expect(clearReservedName).toHaveBeenCalledTimes(0)
  })
  it("...return false when the channel could not be associated.", async () => {
    // Set up mocks.
    getReservationNameMock.mockResolvedValue("Booga")
    associateChannelMock.mockResolvedValue(false)
    // Run the test subject function.
    const result = await assignReservation({
      serverId: "123",
      reservationId: "123",
      channelId: "123",
    })
    // Assert.
    expect(result).toBe(false)
    expect(associateChannel).toHaveBeenCalledTimes(1)
    expect(associateChannel).toHaveBeenCalledWith({
      serverId: "123",
      channelId: "123",
      name: "Booga",
    })
    expect(clearReservedName).toHaveBeenCalledTimes(1)
  })
  it("...return true when everything is expected.", async () => {
    // Set up mocks.
    getReservationNameMock.mockResolvedValue("Booga")
    associateChannelMock.mockResolvedValue(true)
    // Run the test subject function.
    const result = await assignReservation({
      serverId: "123",
      reservationId: "123",
      channelId: "123",
    })
    // Assert.
    expect(result).toBe(true)
    expect(associateChannel).toHaveBeenCalledTimes(1)
    expect(clearReservedName).toHaveBeenCalledTimes(1)
  })
})

/**
 * Clear channel tests.
 */
describe("When clearing a channel...", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it("...disassociate an invalid name.", async () => {
    // Set up mocks.
    getChannelNameMock.mockResolvedValue(undefined)
    disassociateChannelMock.mockResolvedValue(true)
    // Run the test subject function.
    const result = await clearChannel({ serverId: "123", channelId: "123" })
    // Assert.
    expect(result).toBe(true)
    expect(retireName).toHaveBeenCalledTimes(0)
  })
  it("...disassociate and retire the name.", async () => {
    // Set up mocks.
    getChannelNameMock.mockResolvedValue("Booga")
    disassociateChannelMock.mockResolvedValue(false)
    // Run the test subject function.
    const result = await clearChannel({ serverId: "123", channelId: "123" })
    // Assert.
    expect(result).toBe(false)
    expect(retireName).toHaveBeenCalledTimes(1)
    expect(retireName).toHaveBeenCalledWith({ serverId: "123", name: "Booga" })
  })
})
