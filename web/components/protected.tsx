import { UserProfile, useUser } from "@auth0/nextjs-auth0"
import type { NextComponentType } from "next"
import { useRouter } from "next/router"
import { createContext, useContext } from "react"

export const UserContext = createContext<UserProfile>({})

const Protected: NextComponentType = ({ children }) => {
  const { user, error, isLoading } = useUser()
  const router = useRouter()

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  if (!user) {
    router.push(`/api/auth/login?returnTo=${router.pathname}`)
    return <></>
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export default Protected
