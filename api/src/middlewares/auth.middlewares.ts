/**
 * Auth middleware.
 */

// External imports.
import { Request, Response, NextFunction } from "express"
import { createRemoteJWKSet, jwtVerify } from "jose"

// Utility imports.
import { UnauthorizedError } from "@utils/exceptions"
import { URL } from "url"
import { IncomingHttpHeaders } from "http"

export interface Payload {
  iss: string
  sub: string
  aud: string | string[]
  iat: number
  exp: number
  azp: string
  scope: string
  gty?: "client-credentials" | string
  permissions?: string[]
}

const keychain = {}

export function extractPayload(jwt: string): Payload {
  const payload = jwt.split(".")[1]
  const payloadJSON = Buffer.from(payload, "base64").toString()
  const result = JSON.parse(payloadJSON)
  return result as Payload
}

async function verifySignature(jwt: string): Promise<Payload> {
  try {
    const payload = extractPayload(jwt)
    const JWKS = createRemoteJWKSet(
      new URL(`${payload.iss}.well-known/jwks.json`),
    )
    await jwtVerify(jwt, async (header, input) => {
      const kid = header.kid
      if (!kid) throw new UnauthorizedError("Malformed token.")
      let key = keychain[payload.iss]?.[kid]
      if (!key) {
        key = await JWKS(header, input)
        keychain[payload.iss] = {
          ...keychain[payload.iss],
          [kid]: key,
        }
      }
      return key
    })
    return payload
  } catch (error) {
    throw new UnauthorizedError("Unable to verify token signature.")
  }
}

interface CheckAuthInput {
  headers: IncomingHttpHeaders
}
export async function checkAuth({ headers }: CheckAuthInput) {
  const header = headers.authorization
  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Malformed Authorization header.")
  }
  const token = header.substring(7)
  const payload = await verifySignature(token)
  const userId = payload.sub.endsWith("@clients")
    ? payload.sub.split("@")[0]
    : payload.sub.split("|")[2]
  const system = payload.sub.endsWith("@clients")
  return {
    sub: payload.sub,
    id: userId,
    permissions: payload.permissions || [],
    system,
  }
}

/**
 * Express auth handler.
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === "production") {
    // Check authorization and get metadata about the actor.
    const actor = await checkAuth({ headers: req.headers })
    actor.permissions.push(
      "manage:names",
      "manage:categories",
      "read:categories",
    )
    // Bind the actor to the request context.
    req.actor = actor
  } else {
    req.actor = {
      sub: "oauth2|discord|183731781994938369",
      id: "183731781994938369",
      permissions: ["*"],
      system: false,
    }
  }
  // Continue to the next handler.
  next()
}
