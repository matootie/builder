/**
 * Express application.
 */

// External imports.
import express from "express"
import cors from "cors"

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

app.get("/hello", (_req, res) => {
  const url = process.env.REDIS_URL ?? "No URL provided."
  res.status(200).send({
    message: "Hello!",
    url,
  })
})
