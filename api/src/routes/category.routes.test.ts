/**
 * Category routes tests.
 */

// External imports.
import request from "supertest"

// Application import.
import { app } from "@app"

/**
 * Checking category tests.
 */
describe("When working with categories...", () => {
  it("...return 404 when blacklisted.", () => {
    return request(app).get("/servers/123/categories/123").expect(404)
  })
  it("...return OK when adding to whitelist.", () => {
    return request(app)
      .put("/servers/123/categories/123")
      .expect(200)
      .expect({ message: "OK" })
  })
  it("...return UNCHANGED when already on whitelist.", () => {
    return request(app)
      .put("/servers/123/categories/123")
      .expect(200)
      .expect({ message: "UNCHANGED" })
  })
  it("...return 200 when whitelisted.", () => {
    return request(app).get("/servers/123/categories/123").expect(200)
  })
  it("...return OK when removing from whitelist.", () => {
    return request(app)
      .delete("/servers/123/categories/123")
      .expect(200)
      .expect({ message: "OK" })
  })
  it("...return UNCHANGED when already removed from whitelist.", () => {
    return request(app)
      .delete("/servers/123/categories/123")
      .expect(200)
      .expect({ message: "UNCHANGED" })
  })
})
