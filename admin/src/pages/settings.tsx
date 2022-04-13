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

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    console.error(error)
    return <ErrorComponent />
  }

  return (
    <>
      {/* Warning, if not joined */}
      {!data && (
        <Warning
          className="mb-4"
          heading="The Builder chatbot is not in this server."
          body={
            <p>
              None of these changes will affect anything until the bot is added
              to this server.{" "}
              <a href="https://www.github.com/matootie" className="underline">
                You can invite the chatbot by clicking here!
              </a>
            </p>
          }
        />
      )}
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
            <p className="text-sm font-medium text-gray-500">
              {!!data ? (
                <>
                  Using Builder integration since{" "}
                  <time dateTime={new Date(parseInt(data.date)).toISOString()}>
                    {new Date(parseInt(data.date)).toLocaleDateString()}.
                  </time>
                </>
              ) : (
                <>Not currently using Builder integration.</>
              )}
            </p>
          </div>
        </div>
      </div>
      {/* Name settings */}
      <Names serverId={guild.id} />
    </>
  )
}
