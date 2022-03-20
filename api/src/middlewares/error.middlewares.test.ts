/**
 * Error middleware tests.
 */

// External imports.
import { string, assert } from "superstruct"

// Test subject imports.
import { checkError } from "./error.middlewares"

// Utility imports.
import { NotFoundError, ServerError } from "@utils/exceptions"
import { StructError } from "superstruct"

/**
 * Test handling different errors.
 */
describe("When handling errors...", () => {
  test("...handle HTTP errors.", () => {
    // Build an example error.
    const error = new NotFoundError("Example message.")
    // Run the test subject function.
    const result = checkError({ error })
    // Assert.
    expect(result.error).toBe(error.error)
    expect(result.message).toBe(error.message)
    expect(result.status).toBe(error.status)
  })
  test("...handle StructError errors.", () => {
    expect.assertions(3)
    try {
      // Trigger an error.
      assert(100, string())
    } catch (error) {
      // Run the test subject function.
      const result = checkError({ error })
      // Assert.
      expect(result.error).toBe("Request validation error.")
      expect(result.message).toBe((error as StructError).message)
      expect(result.status).toBe(400)
    }
  })
  test("...handle exposable errors.", () => {
    // Build an example error.
    const error = { expose: true, statusCode: 400 }
    // Run the test subject function.
    const result = checkError({ error })
    // Assert.
    expect(result.error).toBe("Invalid request.")
    expect(result.message).toBeUndefined()
    expect(result.status).toBe(error.statusCode)
  })
  test("...handle non-HTTP errors.", () => {
    // Build an example error and a reference error.
    const error = new Error("Some sort of non-HTTP error.")
    const referenceError = new ServerError("An unknown error has occurred.")
    // Run the test subject function.
    const result = checkError({ error })
    // Assert.
    expect(result.error).toBe(referenceError.error)
    expect(result.message).toBe(referenceError.message)
    expect(result.status).toBe(referenceError.status)
  })
})
