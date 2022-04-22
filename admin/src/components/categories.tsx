/**
 * Names settings component.
 */

// External imports.
import { Fragment, useState } from "react"
import { useMutation, useQuery } from "react-query"
import { Dialog, Menu, Switch, Transition } from "@headlessui/react"
import { PlusCircleIcon } from "@heroicons/react/outline"
import { PlusIcon, DotsVerticalIcon } from "@heroicons/react/solid"

// Component imports.
import ErrorComponent from "@components/error"
import Loading from "@components/loading"

// Utility imports.
import { useUser } from "@utils/auth"
import { queryClient } from "@utils/query"
import { classNames } from "@utils/classes"

interface NamesProps {
  serverId: string
}
export default function Categories({ serverId }: NamesProps) {
  const { getAccessToken } = useUser()

  interface Category {
    id: string
    name: string
    enabled: boolean
  }
  const { data, isLoading, error } = useQuery<Category[]>(
    `categories${serverId}`,
    async () => {
      const token = await getAccessToken()
      const response = await fetch(
        `${process.env.API_BASE_URL}/servers/${serverId}/categories`,
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

  function categoriesLoading(count: number = 1) {
    const empties = [...Array(count)]
    return (
      <>
        {empties.map((_value, index) => (
          <div
            key={index}
            className="bg-gray-50 px-4 py-4 h-14 animate-pulse odd:delay-75 odd:bg-gray-100 rounded-lg"
          ></div>
        ))}
      </>
    )
  }

  function categoriesList(data: Category[]) {
    return (
      <>
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-gray-50 px-4 py-4 odd:bg-gray-100 rounded-lg"
          >
            <div
              className={classNames(
                "flex justify-between items-center",
                item.enabled ? "mb-4" : "mb-auto",
              )}
            >
              <span className="text-gray-700 font-semibold truncate">
                {item.name}
              </span>
              <CategorySwitch
                serverId={serverId}
                categoryId={item.id}
                enabled={item.enabled}
              />
            </div>
            {item.enabled && <CategoryOptions />}
          </div>
        ))}
      </>
    )
  }

  function categoriesEmpty() {
    return (
      <div className="p-8 text-center">
        <span className="text-sm text-gray-500 italic">
          Failed to fetch categories. The bot is likely not added to the server.
        </span>
      </div>
    )
  }

  function showCategories() {
    if (!data && isLoading) return categoriesLoading()
    else if (data && data.length > 0) return categoriesList(data)
    else return categoriesEmpty()
  }

  return (
    <div className="px-2 sm:px-4 lg:px-8 max-w-4xl mx-auto my-10">
      <div className="pb-5 border-b border-gray-200 flex justify-between items-end">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Categories
          </h3>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            Control which channel categories the integration will be enabled
            for.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col space-y-4">{showCategories()}</div>
    </div>
  )
}

interface CategorySwitchProps {
  serverId: string
  categoryId: string
  enabled: boolean
}
function CategorySwitch({
  serverId,
  categoryId,
  enabled,
}: CategorySwitchProps) {
  const { getAccessToken } = useUser()
  const { mutate, isLoading } = useMutation(
    async () => {
      const token = await getAccessToken()
      await fetch(
        `${process.env.API_BASE_URL}/servers/${serverId}/categories/${categoryId}`,
        {
          method: enabled ? "DELETE" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(`categories${serverId}`)
      },
    },
  )
  return (
    <Switch
      checked={enabled}
      onChange={() => mutate()}
      disabled={isLoading}
      className={classNames(
        enabled ? "bg-green-600" : "bg-gray-200",
        "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:animate-pulse",
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          enabled ? "translate-x-5" : "translate-x-0",
          "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
        )}
      >
        <span
          className={classNames(
            enabled
              ? "opacity-0 ease-out duration-100"
              : "opacity-100 ease-in duration-200",
            "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity",
          )}
          aria-hidden="true"
        >
          <svg
            className="h-3 w-3 text-gray-400"
            fill="none"
            viewBox="0 0 12 12"
          >
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          className={classNames(
            enabled
              ? "opacity-100 ease-in duration-200"
              : "opacity-0 ease-out duration-100",
            "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity",
          )}
          aria-hidden="true"
        >
          <svg
            className="h-3 w-3 text-green-600"
            fill="currentColor"
            viewBox="0 0 12 12"
          >
            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
          </svg>
        </span>
      </span>
    </Switch>
  )
}

function CategoryOptions() {
  return (
    <div className="p-8 text-center">
      <span className="text-sm text-gray-600 italic">
        Additional options will be available soon...
      </span>
    </div>
  )
}
