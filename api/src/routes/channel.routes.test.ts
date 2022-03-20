/**
 * Channel routes tests.
 */

// External imports.
import request from "supertest"

// Application import.
import { app } from "@app"

/**
 * Assigning reservation tests.
 */
describe("When assigning reserved names...", () => {
  it("...do nothing with no prior reservation", async () => {
    const response = await request(app)
      .put("/servers/123/channels/123")
      .send({ reservationId: "abc" })
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe("UNCHANGED")
  })
  it("...ensure idempotency and response format.", async () => {
    await request(app).get("/servers/123/names/def")
    const response1 = await request(app)
      .put("/servers/123/channels/123")
      .send({ reservationId: "def" })
    const response2 = await request(app)
      .put("/servers/123/channels/123")
      .send({ reservationId: "def" })
    expect(response1.statusCode).toBe(200)
    expect(response2.statusCode).toBe(200)
    expect(response1.body.message).toBe("UPDATED")
    expect(response2.body.message).toBe("UNCHANGED")
  })
})

/**
 * Clearing channel tests.
 */
describe("When clearing channels of their name...", () => {
  it("...do nothing with no prior records.", async () => {
    const response = await request(app).delete("/servers/123/channels/456")
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe("UNCHANGED")
  })
  it("...ensure idempotency and response format.", async () => {
    await request(app).get("/servers/123/names/ghi")
    await request(app)
      .put("/servers/123/channels/456")
      .send({ reservationId: "ghi" })
    const response1 = await request(app).delete("/servers/123/channels/456")
    const response2 = await request(app).delete("/servers/123/channels/456")
    expect(response1.statusCode).toBe(200)
    expect(response2.statusCode).toBe(200)
    expect(response1.body.message).toBe("CLEARED")
    expect(response2.body.message).toBe("UNCHANGED")
  })
})
