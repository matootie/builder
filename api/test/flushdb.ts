import { redis } from "@utils/redis"

beforeAll(async () => {
  await redis.flushdb("sync")
})

afterAll(async () => {
  await redis.quit()
})
