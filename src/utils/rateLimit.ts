import type { NextApiRequest } from 'next'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Rate limiting only for outbound Apple traffic (search + motion-artwork
// lookups); disabled locally when Upstash env vars aren't set.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null

const limiters: Record<string, Ratelimit> = {}

const getLimiter = (prefix: string): Ratelimit | null => {
  if (!redis) return null

  if (!limiters[prefix]) {
    limiters[prefix] = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '60 s'),
      prefix: `itunes-artwork-finder:${prefix}`,
    })
  }

  return limiters[prefix]
}

export const getClientIp = (req: NextApiRequest): string => {
  const header = req.headers['x-forwarded-for']
  const forwarded = Array.isArray(header) ? header[0] : header

  return forwarded?.split(',')[0].trim() ?? req.socket.remoteAddress ?? 'unknown'
}

export const isRateLimited = async (
  prefix: string,
  identifier: string
): Promise<boolean> => {
  const limiter = getLimiter(prefix)
  if (!limiter) return false

  const { success } = await limiter.limit(identifier)
  return !success
}
