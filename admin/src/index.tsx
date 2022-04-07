/**
 * Main application entrypoint.
 */

// External imports.
import React, { FC } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { QueryClientProvider } from "react-query"
import { Auth0Provider } from "@auth0/auth0-react"

// Utility imports.
import { AuthProvider } from "@utils/auth"
import { queryClient } from "@utils/query"
import { Layout } from "@utils/layout"

// Style imports.
import "@fontsource/inter/latin.css"
import "@styles"

/**
 * Main application functional React component.
 */
const App: FC = (): JSX.Element => {
  return (
    <Auth0Provider
      domain="discordbuilder.us.auth0.com"
      clientId="5RzfKYvG40PgXWJwRzFQC25PED431PwS"
      redirectUri={window.location.origin}
      connection="discord"
      audience="builder"
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Layout />
          </Router>
        </QueryClientProvider>
      </AuthProvider>
    </Auth0Provider>
  )
}

// Render the application to DOM.
ReactDOM.render(<App />, document.getElementById("root"))
