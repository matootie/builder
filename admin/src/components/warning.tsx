/**
 * Warning component.
 */

// External imports.
import { ReactNode } from "react"
import { ExclamationIcon } from "@heroicons/react/solid"

/**
 * Warning functional React component.
 */
interface WarningProps {
  heading?: string
  body: ReactNode
  className?: string
}
export default function Warning({ heading, body, className }: WarningProps) {
  return (
    <div className={`rounded-md bg-yellow-50 p-4 ${className || ""}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            {heading ?? "Attention needed"}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">{body}</div>
        </div>
      </div>
    </div>
  )
}
