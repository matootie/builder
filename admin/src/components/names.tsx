/**
 * Names settings component.
 */

// External imports.
import { Fragment, useState } from "react"
import { useMutation, useQuery } from "react-query"
import { Dialog, Menu, Transition } from "@headlessui/react"
import { PlusCircleIcon } from "@heroicons/react/outline"
import { PlusIcon, DotsVerticalIcon } from "@heroicons/react/solid"

// Component imports.
import ErrorComponent from "@components/error"
import Loading from "@components/loading"

// Utility imports.
import { useUser } from "@utils/auth"
import { queryClient } from "@utils/query"
import { classNames } from "@utils/classes"

const MAX_NAMES = 10

interface NamesProps {
  serverId: string
}
export default function Names({ serverId }: NamesProps) {
  const { getAccessToken } = useUser()

  const { data, error } = useQuery<{ name: string; inuse: boolean }[]>(
    `customNames${serverId}`,
    async () => {
      const token = await getAccessToken()
      const response = await fetch(
        `${process.env.API_BASE_URL}/servers/${serverId}/names`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const result = await response.json()
      return result.items
    },
  )

  if (error) {
    console.error(error)
    return <ErrorComponent />
  }

  if (data) {
    return (
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
            <span>{data.length}</span>/<span>{MAX_NAMES}</span>
          </div>
        </div>
        <div className="mt-4">
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-4">
            {data.map(({ name }) => (
              <NameButton key={name} serverId={serverId} name={name} />
            ))}
            {data.length < MAX_NAMES && <NewNameButton serverId={serverId} />}
          </ul>
        </div>
      </div>
    )
  }

  return <Loading />
}

interface NameButtonProps {
  serverId: string
  name: string
}
function NameButton({ serverId, name }: NameButtonProps) {
  const { getAccessToken } = useUser()
  const { mutate: removeName, isLoading } = useMutation<
    void,
    unknown,
    { name: string }
  >(
    async ({ name }) => {
      const token = await getAccessToken()
      await fetch(
        `${process.env.API_BASE_URL}/servers/${serverId}/names/${name}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(`customNames${serverId}`)
      },
    },
  )
  if (isLoading) {
    return (
      <li className="border border-black border-opacity-0 rounded-md px-2 py-4 md:py-3 bg-gray-100 text-gray-500 font-semibold relative group">
        {name}
      </li>
    )
  }
  return (
    <li className="border border-black border-opacity-5 rounded-md px-2 py-4 md:py-3 bg-gray-100 text-gray-700 font-semibold shadow-sm group flex flex-row justify-between items-center">
      <span>{name}</span>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="bg-gray-100 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-0 z-0">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <span className="text-gray-300 block w-full text-left px-4 py-2 text-sm font-normal">
                    View stats
                  </span>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? "bg-red-100 text-red-700" : "text-red-600",
                      "block w-full text-left px-4 py-2 text-sm font-semibold",
                    )}
                    onClick={() => removeName({ name })}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  )
}

interface NewNameButtonProps {
  serverId: string
}
function NewNameButton({ serverId }: NewNameButtonProps) {
  // Modal.
  const [name, setName] = useState<string>("")
  const [isOpen, setIsOpen] = useState<boolean>(false)
  // Requests.
  const { getAccessToken } = useUser()
  const { mutate: addName } = useMutation(
    async () => {
      const token = await getAccessToken()
      await fetch(
        `${process.env.API_BASE_URL}/servers/${serverId}/names/${name}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(`customNames${serverId}`)
        setIsOpen(false)
        setName("")
      },
    },
  )

  function handleSubmit() {
    addName()
  }

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusCircleIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Add a new name
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Add a new custom name for the integration to use when
                          creating new channels.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-8 py-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Something Goes Here"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit()
                      }}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleSubmit()}
                  >
                    Add
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <li>
        <button
          type="button"
          className="relative flex w-full border-2 border-gray-300 group border-dashed rounded-lg px-2 py-4 md:py-3 text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-gray-700 font-semibold"
          onClick={() => setIsOpen(true)}
        >
          <PlusIcon className="bg-gray-300 group-hover:bg-green-500 text-gray-700 group-hover:text-gray-50 p-1 rounded-md w-6 h-6 mr-2" />
          Add a new name
        </button>
      </li>
    </>
  )
}
