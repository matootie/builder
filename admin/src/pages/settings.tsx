/**
 * Settings page.
 */

// External imports
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"

// Component imports.
import ErrorComponent from "@components/error"
import Loading from "@components/loading"
import Warning from "@components/warning"

// Utility imports.
import { useUser } from "@utils/auth"
import Names from "@components/names"
import Categories from "@components/categories"

function getDiscordInviteURL() {
  const appId = process.env.DISCORD_CLIENT_ID || "933497162183082077"
  return `https://discord.com/api/oauth2/authorize?client_id=${appId}&permissions=16&scope=bot`
}

/**
 * Settings page functional React component.
 */
interface SettingsProps {
  guild: Guild
}
export default function Settings({ guild }: SettingsProps) {
  const { getAccessToken } = useUser()
  const { serverId } = useParams()

  const { data, isLoading, error } = useQuery<{ date: string }>(
    `isJoined${guild.id}`,
    async () => {
      const token = await getAccessToken()
      const response = await fetch(
        `${process.env.API_BASE_URL}/servers/${serverId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.status !== 200) {
        return
      }
      return await response.json()
    },
  )

  if (error) {
    console.error(error)
    return <ErrorComponent />
  }

  function heading() {
    if (!!data && !isLoading) {
      return (
        <>
          Using Builder integration since{" "}
          <time dateTime={new Date(parseInt(data.date)).toISOString()}>
            {new Date(parseInt(data.date)).toLocaleDateString()}.
          </time>
        </>
      )
    } else if (!data && isLoading) {
      return <>Loading...</>
    } else {
      return <>Not currently using Builder integration.</>
    }
  }

  return (
    <>
      {/* Heading */}
      <div className="md:flex md:items-center md:justify-between md:space-x-5 mt-6 mb-10 xl:mb-16 mx-auto max-w-5xl">
        <div className="flex items-start space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <img className="h-16 w-16 rounded-full" src={guild.icon} alt="" />
              <span
                className="absolute inset-0 shadow-inner rounded-full"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="pt-1.5">
            <h1 className="text-2xl font-bold text-gray-900">{guild.name}</h1>
            <p className="text-sm font-medium text-gray-500">{heading()}</p>
          </div>
        </div>
      </div>
      {/* Warning, if not joined */}
      {!isLoading && !data && (
        <Warning
          className="mb-4 max-w-4xl mx-auto"
          heading="The Builder chatbot is not in this server."
          body={
            <p>
              None of these changes will affect anything until the bot is added
              to this server.{" "}
              <a
                href={getDiscordInviteURL()}
                target="_blank"
                className="underline"
              >
                You can invite the chatbot by clicking here!
              </a>
            </p>
          }
        />
      )}
      {/* Name settings */}
      <Names serverId={guild.id} />
      {/* Category settings */}
      <Categories serverId={guild.id} />
    </>
  )
}
