/**
 * Name routes tests.
 */

// External imports.
import request from "supertest"

// Application import.
import { app } from "@app"

/**
 * Reserving name tests.
 */
describe("When reserving names...", () => {
  it("...return new name for new channel.", async () => {
    const response = await request(app).get("/servers/123/names/abc")
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe("RESERVED")
    expect(typeof response.body.name).toBe("string")
  })
  it("...return the same name for multiple reservations.", async () => {
    const response1 = await request(app).get("/servers/123/names/def")
    const response2 = await request(app).get("/servers/123/names/def")
    expect(response1.statusCode).toBe(200)
    expect(response2.statusCode).toBe(200)
    expect(response1.body.message).toBe("RESERVED")
    expect(response2.body.message).toBe("RECOVERED")
    expect(response1.body.name).toBe(response2.body.name)
  })
})
