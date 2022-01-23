/**
 * Express application.
 */

// External imports.
import express from "express"
import cors from "cors"

// Middleware imports.
import { errorMiddleware } from "@middlewares/error.middlewares"

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

// Use the error middleware.
app.use(errorMiddleware)
