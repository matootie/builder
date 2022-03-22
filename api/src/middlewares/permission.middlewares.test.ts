/**
 * Permission middleware tests.
 */

// Test subject imports.
import { checkPermission } from "./permission.middlewares"

/**
 * Test checking for permissions.
 */
describe("When checking for permissions...", () => {
  test("...return true when permission exists.", () => {
    // Run the test subject function.
    const result = checkPermission({
      requiredPermission: "manage:names",
      existingPermissions: ["read:names", "manage:categories", "manage:names"],
    })
    // Assert.
    expect(result).toBe(true)
  })
  test("...return false when permission is missing.", () => {
    // Run the test subject function.
    const result = checkPermission({
      requiredPermission: "manage:channels",
      existingPermissions: ["read:names", "manage:categories", "manage:names"],
    })
    // Assert.
    expect(result).toBe(false)
  })
})
