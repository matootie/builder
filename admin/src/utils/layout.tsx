/**
 * Global application layout.
 */

// External imports.
import { FC, Fragment, useState } from "react"
import { useQuery } from "react-query"
import { Routes, Route, useMatch, Navigate, Link } from "react-router-dom"
import { Transition, Dialog } from "@headlessui/react"
import { MenuIcon, XIcon } from "@heroicons/react/outline"

// Component imports.
import Loading from "@components/loading"
import ErrorComponent from "@components/error"

// Page imports.
import Settings from "@pages/settings"

// Utility imports.
import { useUser } from "@utils/auth"

/**
 * Combine class names into a string.
 */
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Layout functional React component.
 */
export const Layout: FC = ({ children }) => {
  const { logout, user, getAccessToken } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const match = useMatch(window.location.pathname)

  const {
    isLoading,
    error,
    data: servers,
  } = useQuery<Guild[]>("serverData", async () => {
    const token = await getAccessToken()
    const response = await fetch(`${process.env.API_BASE_URL}/guilds`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    const servers: Guild[] =
      data?.map((guild: Guild) => {
        return {
          id: guild.id,
          name: guild.name,
          icon: guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            : "https://cdn.discordapp.com/embed/avatars/0.png",
        }
      }) || []
    return servers
  })

  if (error) {
    console.error(error)
    return <ErrorComponent />
  }

  if (servers) {
    const serverId = match?.pathname.split("/")[1]
    if (!serverId) {
      return <Navigate to={`/${servers[0].id}/settings`} />
    }
    return (
      <>
        <div className="h-screen bg-white overflow-hidden flex">
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 flex z-40 lg:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
              </Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white focus:outline-none">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div className="flex-shrink-0 flex items-center px-4">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-900-text.svg"
                        alt="Builder"
                      />
                    </div>
                    <nav aria-label="Sidebar" className="mt-5">
                      <div className="px-2 space-y-1">
                        {servers.map((server) => (
                          <Link
                            key={server.id}
                            to={`/${server.id}/settings`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span
                              className={classNames(
                                server.id === serverId
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                              )}
                            >
                              <img
                                src={server.icon}
                                className="mr-4 h-6 w-6 rounded-md"
                                aria-hidden="true"
                              />
                              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                {server.name}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </nav>
                  </div>
                  <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                    <a
                      onClick={() => logout()}
                      className="flex-shrink-0 group block cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div>
                          <img
                            className="inline-block h-10 w-10 rounded-full"
                            src={user.picture}
                            alt={`Profile picture for ${user.nickname}`}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                            {user.nickname}
                          </p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                            Click to sign out
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="flex flex-col w-64">
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-gray-100">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                  <div className="flex items-center flex-shrink-0 px-4">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-900-text.svg"
                      alt="Builder"
                    />
                  </div>
                  <nav className="mt-5 flex-1" aria-label="Sidebar">
                    <div className="px-2 space-y-1">
                      {servers.map((server) => (
                        <Link key={server.id} to={`/${server.id}/settings`}>
                          <span
                            className={classNames(
                              server.id === serverId
                                ? "bg-gray-200 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                              "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                            )}
                          >
                            <img
                              src={server.icon}
                              className="mr-3 h-6 w-6 rounded-md"
                              aria-hidden="true"
                            />
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {server.name}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <a
                    onClick={() => logout()}
                    className="flex-shrink-0 w-full group block cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div>
                        <img
                          className="inline-block h-9 w-9 rounded-full"
                          src={user.picture}
                          alt={`Profile picture for ${user.nickname}`}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {user.nickname}
                        </p>
                        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                          Click to sign out
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
            <div className="lg:hidden">
              <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-1.5">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Builder"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="-mr-3 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 relative z-0 flex overflow-hidden">
              <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last p-4">
                {/* Start main area*/}
                <Routes>
                  <Route
                    path="/:serverId/settings"
                    element={
                      <Settings
                        // @ts-expect-error Known contents of array.
                        guild={servers.find((x) => x.id === serverId)}
                      />
                    }
                  />
                </Routes>
                {/* End main area */}
              </main>
            </div>
          </div>
        </div>
      </>
    )
  }

  return <Loading />
}
