/**
 * Category routes.
 */

// External imports.
import express from "express"

// Middleware imports.
import { perms } from "@middlewares/permission.middlewares"
import { owner } from "@middlewares/discord.middlewares"

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
categories.get(
  "/:serverId/categories/:categoryId",
  perms("read:categories"),
  owner({ param: "serverId", location: "path" }),
  async (req, res) => {
    const whitelisted = await checkCategory({
      serverId: req.params.serverId,
      categoryId: req.params.categoryId,
    })
    if (whitelisted) res.status(200).send({ message: "OK" })
    else throw new NotFoundError("Category is not in the whitelist")
  },
)

/**
 * Whitelist a category.
 */
categories.put(
  "/:serverId/categories/:categoryId",
  perms("manage:categories"),
  owner({ param: "serverId", location: "path" }),
  async (req, res) => {
    const changed = await whitelistCategory({
      serverId: req.params.serverId,
      categoryId: req.params.categoryId,
    })
    if (changed) res.status(200).send({ message: "OK" })
    else res.status(200).send({ message: "UNCHANGED" })
  },
)

/**
 * Blacklist a category.
 */
categories.delete(
  "/:serverId/categories/:categoryId",
  perms("manage:categories"),
  owner({ param: "serverId", location: "path" }),
  async (req, res) => {
    const changed = await blacklistCategory({
      serverId: req.params.serverId,
      categoryId: req.params.categoryId,
    })
    if (changed) res.status(200).send({ message: "OK" })
    else res.status(200).send({ message: "UNCHANGED" })
  },
)
