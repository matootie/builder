/**
 * Settings page.
 */

// External imports
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { PlusIcon, XIcon } from "@heroicons/react/solid"

// Component imports.
import ErrorComponent from "@components/error"
import Loading from "@components/loading"
import Warning from "@components/warning"

// Utility imports.
import { useUser } from "@utils/auth"

const names = [
  "Moonlit Sonata",
  "Graceful Prance",
  "Perfect Ensemble",
  "Young Language",
  "Crisp Monkey",
  "Wonderful Name",
  "Breakfast Stew",
  "General Banter",
  "Civilized Discussion",
]

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
      <div className="px-2 sm:px-4 lg:px-8 max-w-4xl mx-auto">
        <div className="pb-5 border-b border-gray-200 flex justify-between items-end">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Names
            </h3>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              Choose custom names for the integration to use when creating new
              channels.
            </p>
          </div>
          <div className="text-gray-500">
            <span>9</span>/<span>10</span>
          </div>
        </div>
        <div className="mt-4">
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-4">
            {names.map((name) => (
              <li
                key={name}
                className="border border-black border-opacity-5 rounded-md px-2 py-4 md:py-3 bg-gray-100 text-gray-700 font-semibold shadow-sm relative group"
              >
                {name}
                <button className="absolute md:opacity-0 group-hover:opacity-100 transition-opacity top-0 right-0 -mr-2 -mt-2">
                  <XIcon className="bg-gray-500 hover:bg-red-500 text-gray-100 p-1 w-6 h-6 rounded-full" />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="relative flex w-full border-2 border-gray-300 group border-dashed rounded-lg px-2 py-4 md:py-3 text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-gray-700 font-semibold"
              >
                <PlusIcon className="bg-gray-300 group-hover:bg-green-500 text-gray-700 group-hover:text-gray-50 p-1 rounded-md w-6 h-6 mr-2" />
                Add a new name
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
