import { handleLogin } from "@auth0/nextjs-auth0"
import { auth0 } from "@utils/auth0"

export default auth0.handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      authorizationParams: {
        connection: "discord",
      },
    })
  },
})
