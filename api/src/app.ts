/**
 * Express application.
 */

// External imports.
import express from "express"
import cors from "cors"

// Middleware imports.
import { authMiddleware } from "@middlewares/auth.middlewares"
import { errorMiddleware } from "@middlewares/error.middlewares"

// Route imports.
import { categories } from "@routes/category.routes"
import { names } from "@routes/name.routes"
import { channels } from "@routes/channel.routes"
import { meta } from "@routes/meta.routes"
import { guilds } from "@routes/guild.routes"

// Initialize the app.
export const app = express()

// Use the JSON middleware.
app.use(express.json())

// Use the CORS middleware.
app.use(cors())
app.options("*", (_req, res) => res.status(204).send())

// Use the auth middleware.
app.use(authMiddleware)

// Use application routes.
app.use("/", meta)
app.use("/servers", guilds)
app.use("/servers", categories)
app.use("/servers", names)
app.use("/servers", channels)

// Use the error middleware.
app.use(errorMiddleware)
