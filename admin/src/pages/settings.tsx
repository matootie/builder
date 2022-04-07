/**
 * Settings page.
 */

import { useParams } from "react-router-dom"

/**
 * Settings page functional React component.
 */
interface SettingsProps {
  guild: Guild
}
export default function Settings({ guild }: SettingsProps) {
  const { serverId } = useParams()
  return (
    <>
      <p>
        Settings for server with ID <code>{serverId}</code>
      </p>
      <p>The name of the server is "{guild.name}"</p>
    </>
  )
}
