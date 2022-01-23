/**
 * Error middleware tests.
 */

// Test subject imports.
import { checkError } from "./error.middlewares"

// Utility imports.
import { NotFoundError, ServerError } from "@utils/exceptions"

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
    // Build an example error.
    const error = {
      name: "StructError",
      message: "At path: example validation error.",
    }
    // Run the test subject function.
    const result = checkError({ error })
    // Assert.
    expect(result.error).toBe("Request validation error.")
    expect(result.message).toBe(error.message)
    expect(result.status).toBe(400)
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
