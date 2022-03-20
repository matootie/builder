/**
 * Name utilities.
 */

// External imports.
import axios from "axios"

// Function to get an adjective from word API.
async function getAdjective(): Promise<string> {
  const response = await axios({
    method: "GET",
    baseURL: "https://random-word-form.herokuapp.com",
    url: "/random/adjective",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = response.data as string[]
  if (data && data.length > 0) return data[0]
  throw new Error("Invalid response from word API.")
}

// Function to get a noun from word API.
async function getNoun(): Promise<string> {
  const response = await axios({
    method: "GET",
    baseURL: "https://random-word-form.herokuapp.com",
    url: "/random/noun",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = response.data as string[]
  if (data && data.length > 0) return data[0]
  throw new Error("Invalid response from word API.")
}

/**
 * Generate a name.
 */
export async function generateName(): Promise<string> {
  // Choose a name from the name generator.
  const results = await Promise.all([getAdjective(), getNoun()])
  const name = results.join(" ")
  return name.replace(/\b\w/g, (c) => c.toUpperCase())
}
