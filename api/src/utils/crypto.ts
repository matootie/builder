/**
 * Cryptographic utilities.
 */

// Standard imports.
import { createHash as createHashCrypto, randomBytes } from "crypto"

/**
 * Create a random salt string.
 */
type SaltSizes = 16 | 32 | 64
export function createSalt(size: SaltSizes = 32): string {
  return randomBytes(size / 2).toString("hex")
}

/**
 * Create a hash for a value.
 */
interface CreateHashInput {
  value: string
  salt: string
}
export function createHash({ value, salt }: CreateHashInput): string {
  const hash = createHashCrypto("sha256")
  hash.update(value)
  hash.update(salt)
  return hash.digest("hex")
}
