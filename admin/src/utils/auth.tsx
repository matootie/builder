/**
 * Auth utilities.
 */

// External imports.
import { createContext, FC, useContext } from "react"
import { useAuth0, User } from "@auth0/auth0-react"

// Component imports.
import Loading from "@components/loading"

// Constants.
const RETURN_URL = "https://builder.matootie.com"

/**
 * Auth context.
 */
interface IAuthContext {
  user: User
  logout: () => void
  getAccessToken: () => Promise<string>
}
const AuthContext = createContext<IAuthContext>({
  user: {},
  logout: () => {},
  getAccessToken: async () => "",
})

/**
 * Hook to get access to the user.
 */
export function useUser() {
  return useContext(AuthContext)
}

/**
 * Auth provider.
 */
export const AuthProvider: FC = ({ children }) => {
  const {
    loginWithRedirect,
    isLoading,
    logout,
    getAccessTokenSilently,
    isAuthenticated,
    user,
    error,
  } = useAuth0()
  if (isLoading) {
    return <Loading />
  }
  if (!isAuthenticated) {
    return (
      <>
        <h1>Please log in.</h1>
        {loginWithRedirect()}
      </>
    )
  }
  if (isAuthenticated && user) {
    return (
      <AuthContext.Provider
        value={{
          user,
          logout: () => logout({ returnTo: RETURN_URL }),
          getAccessToken: () => getAccessTokenSilently(),
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }
  return <p>{error?.message ?? "An error has occurred."}</p>
}
