/**
 * Discord API utilities.
 */

// External imports.
import axios from "axios"
import FormData from "form-data"

// Utility imports.
import { redis } from "@utils/redis"
import { ServerError } from "@utils/exceptions"
import { URLSearchParams } from "url"

/**
 * Fetch a management API token.
 */
interface FetchManagementTokenOutput {
  accessToken: string
  expires: number
}
async function fetchManagementToken(): Promise<FetchManagementTokenOutput> {
  const response = await axios({
    method: "POST",
    baseURL: "https://discordbuilder.us.auth0.com",
    url: "/oauth/token",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: "https://discordbuilder.us.auth0.com/api/v2/",
      grant_type: "client_credentials",
    },
  })
  const accessToken = response.data.access_token
  const expires =
    JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64").toString("utf-8"),
    ).exp * 1000
  return { accessToken, expires }
}

/**
 * Get management token.
 * This wraps the fetchManagementToken function to cache received tokens.
 */
let _cachedTokenResponse: FetchManagementTokenOutput | undefined
async function getManagementToken(): Promise<string> {
  if (
    !_cachedTokenResponse ||
    _cachedTokenResponse.expires < Date.now() - 1 * 60 * 60 * 1000
  ) {
    _cachedTokenResponse = await fetchManagementToken()
  }
  return _cachedTokenResponse.accessToken
}

/**
 * Get Discord token from Auth0.
 */
interface GetDiscordTokenFromAuth0Input {
  sub: string
}
async function getDiscordTokenFromAuth0({
  sub,
}: GetDiscordTokenFromAuth0Input): Promise<DiscordToken | undefined> {
  try {
    const token = await getManagementToken()
    const response = await axios({
      method: "GET",
      baseURL: "https://discordbuilder.us.auth0.com/api/v2",
      url: `/users/${sub}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.status !== 200) return
    if (!response.data) return
    const identities: any[] | undefined = response.data.identities
    if (!identities?.length) return
    const identity: {
      access_token?: string
      refresh_token?: string
    } = identities.find((x) => x.connection === "discord")
    if (!identity) return
    if (!identity.access_token) return
    if (!identity.refresh_token) return
    return {
      accessToken: identity.access_token,
      refreshToken: identity.refresh_token,
    }
  } catch (error) {
    // TODO: Log error.
    return
  }
}

async function getDiscordTokenFromRefresh(
  oldToken: DiscordToken,
): Promise<DiscordToken | undefined> {
  try {
    const form = new URLSearchParams()
    form.append("client_id", process.env.DISCORD_CLIENT_ID || "")
    form.append("client_secret", process.env.DISCORD_CLIENT_SECRET || "")
    form.append("grant_type", "refresh_token")
    form.append("refresh_token", oldToken.refreshToken)
    const response = await axios({
      method: "POST",
      baseURL: "https://discord.com/api",
      url: "/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: form,
    })
    const accessToken = response.data.access_token
    const refreshToken = response.data.refresh_token
    if (!accessToken || !refreshToken) return
    return { accessToken, refreshToken }
  } catch (error) {
    // TODO: Log error.
    return
  }
}

/**
 * Get Discord token from database.
 */
interface GetDiscordTokenFromDBInput {
  sub: string
}
async function getDiscordTokenFromDB({
  sub,
}: GetDiscordTokenFromDBInput): Promise<DiscordToken | undefined> {
  const accessToken = await redis.hget(`admin:idp:${sub}`, "accessToken")
  if (!accessToken) return
  const refreshToken = await redis.hget(`admin:idp:${sub}`, "refreshToken")
  if (!refreshToken) return
  return { accessToken, refreshToken }
}

/**
 * Set Discord token in database.
 */
interface SetDiscordTokenInDBInput {
  sub: string
  token: DiscordToken
}
async function setDiscordTokenInDB({ sub, token }: SetDiscordTokenInDBInput) {
  await redis.hset(`admin:idp:${sub}`, {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
  })
}

/**
 * Fetch a users Discord token from Auth0.
 */
interface FetchDiscordTokenInput {
  sub: string
  fromRefresh?: boolean
  oldToken?: DiscordToken
}
export interface DiscordToken {
  accessToken: string
  refreshToken: string
}
interface FetchDiscordTokenOutput {
  token?: DiscordToken
}
async function fetchDiscordToken({
  sub,
  fromRefresh = false,
  oldToken,
}: FetchDiscordTokenInput): Promise<FetchDiscordTokenOutput> {
  if (fromRefresh) {
    if (!oldToken) return {}
    const newToken = await getDiscordTokenFromRefresh(oldToken)
    if (newToken) {
      await setDiscordTokenInDB({ sub, token: newToken })
    }
    return { token: newToken }
  } else {
    const dbToken = await getDiscordTokenFromDB({ sub })
    if (!dbToken) {
      const idpToken = await getDiscordTokenFromAuth0({ sub })
      if (idpToken) {
        await setDiscordTokenInDB({ sub, token: idpToken })
      }
      return { token: idpToken }
    }
    return { token: dbToken }
  }
}

interface WithDiscordContextOptions {
  sub: string
}
interface WithDiscordContextFunctionOptions {
  token: string
}
export async function withDiscordContext<T>(
  { sub }: WithDiscordContextOptions,
  func: (options: WithDiscordContextFunctionOptions) => Promise<T>,
): Promise<T> {
  const { token } = await fetchDiscordToken({ sub, fromRefresh: false })
  if (!token) {
    throw new ServerError("Failed to retrieve token for Discord user.")
  }
  try {
    const response = await func({ token: token.accessToken })
    return response
  } catch (error) {
    const { token: newToken } = await fetchDiscordToken({
      sub,
      fromRefresh: true,
      oldToken: token,
    })
    if (!newToken) {
      throw new ServerError("Failed to retrieve token for Discord user.")
    }
    const response = await func({ token: newToken.accessToken })
    return response
  }
}
