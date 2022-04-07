/**
 * Error component.
 */

/**
 * Error functional React component.
 */
interface ErrorProps {
  message?: string
}
export default function ErrorComponent({ message }: ErrorProps) {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <p className="">{message || "An error has occurred."}</p>
    </div>
  )
}
