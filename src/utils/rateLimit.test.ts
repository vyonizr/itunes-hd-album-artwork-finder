import { describe, it, expect } from 'vitest'
import type { NextApiRequest } from 'next'

import { getClientIp, isRateLimited } from './rateLimit'

const makeReq = (headers: Record<string, string | string[]>): NextApiRequest =>
  ({
    headers,
    socket: { remoteAddress: '127.0.0.1' },
  }) as unknown as NextApiRequest

describe('getClientIp', () => {
  it('takes the first address from a comma-separated x-forwarded-for header', () => {
    const req = makeReq({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })

  it('handles x-forwarded-for provided as an array', () => {
    const req = makeReq({ 'x-forwarded-for': ['9.9.9.9', '1.1.1.1'] })
    expect(getClientIp(req)).toBe('9.9.9.9')
  })

  it('falls back to the socket address when the header is missing', () => {
    const req = makeReq({})
    expect(getClientIp(req)).toBe('127.0.0.1')
  })
})

describe('isRateLimited', () => {
  it('never limits when Upstash env vars are not configured', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN

    expect(await isRateLimited('search', '1.2.3.4')).toBe(false)
  })
})
