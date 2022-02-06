/**
 * Name processes unit tests.
 */

// Test subject imports.
import { pickNameProcess } from "./name.processes"

// Provider imports.
import { pickName, addName, reserveName } from "@providers/name.providers"

// Utility imports.
import { generateName } from "@utils/names"

// Mocks.
jest.mock("@providers/name.providers")
const pickNameMock = pickName as jest.MockedFunction<typeof pickName>
const addNameMock = addName as jest.MockedFunction<typeof addName>
const reserveNameMock = reserveName as jest.MockedFunction<typeof reserveName>
jest.mock("@utils/names")
const generateNameMock = generateName as jest.MockedFunction<
  typeof generateName
>

/**
 * Test picking a name process.
 */
describe("When picking a name...", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it("...return an available name.", async () => {
    // Set up mocks.
    pickNameMock.mockResolvedValue({ item: "Booga" })
    reserveNameMock.mockResolvedValue(true)
    // Run the test subject function.
    const result = await pickNameProcess({
      serverId: "123",
      reservationId: "123",
    })
    // Assert.
    expect(result.item).toBe("Booga")
  })
  it("...generate and add a name if none to pick.", async () => {
    // Set up mocks.
    pickNameMock.mockResolvedValue({})
    generateNameMock.mockReturnValue("Ooga")
    addNameMock.mockResolvedValue(true)
    reserveNameMock.mockResolvedValue(true)
    // Run the test subject function.
    const result = await pickNameProcess({
      serverId: "123",
      reservationId: "123",
    })
    // Assert.
    expect(generateName).toHaveBeenCalledTimes(1)
    expect(addName).toHaveBeenCalledTimes(1)
    expect(result.item).toBe("Ooga")
  })
  it("...generate multiple names until available.", async () => {
    // Set up mocks.
    pickNameMock.mockResolvedValue({})
    const names = ["Name1", "Name2", "Name3"]
    generateNameMock.mockImplementation(() => {
      return names.pop() ?? "Name"
    })
    const added = new Set(names)
    addNameMock.mockImplementation(async ({ name }) => {
      return !added.has(name)
    })
    reserveNameMock.mockResolvedValue(true)
    // Run the test subject function.
    const result = await pickNameProcess({
      serverId: "123",
      reservationId: "123",
    })
    // Assert.
    expect(generateName).toHaveBeenCalledTimes(4)
    expect(addName).toHaveBeenCalledTimes(4)
    expect(result.item).toBe("Name")
  })
})
