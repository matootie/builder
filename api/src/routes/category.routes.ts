/**
 * Category routes.
 */

// External imports.
import express from "express"

// Provider imports.
import {
  blacklistCategory,
  checkCategory,
  whitelistCategory,
} from "@providers/category.providers"

// Utility imports.
import { NotFoundError } from "@utils/exceptions"

// The router.
export const categories = express.Router({ mergeParams: true })

/**
 * Get a category from the whitelist.
 */
categories.get("/:serverId/categories/:categoryId", async (req, res) => {
  const whitelisted = await checkCategory({
    serverId: req.params.serverId,
    categoryId: req.params.categoryId,
  })
  if (whitelisted) res.status(200).send({ message: "OK" })
  else throw new NotFoundError("Category is not in the whitelist")
})

/**
 * Whitelist a category.
 */
categories.put("/:serverId/categories/:categoryId", async (req, res) => {
  const changed = await whitelistCategory({
    serverId: req.params.serverId,
    categoryId: req.params.categoryId,
  })
  if (changed) res.status(200).send({ message: "OK" })
  else res.status(200).send({ message: "UNCHANGED" })
})

/**
 * Blacklist a category.
 */
categories.delete("/:serverId/categories/:categoryId", async (req, res) => {
  const changed = await blacklistCategory({
    serverId: req.params.serverId,
    categoryId: req.params.categoryId,
  })
  if (changed) res.status(200).send({ message: "OK" })
  else res.status(200).send({ message: "UNCHANGED" })
})
