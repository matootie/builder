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

// Initialize the app.
export const app = express()

// Use the JSON middleware.
app.use(express.json())

// Use the CORS middleware.
app.use(
  cors({
    origin: ["*"],
  }),
)

// Use the auth middleware.
app.use(authMiddleware)

// Use category routes.
app.use("/servers", categories)
app.use("/servers", names)

// Use the error middleware.
app.use(errorMiddleware)
