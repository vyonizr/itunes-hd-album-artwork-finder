import type { NextApiRequest } from 'next'

const FALLBACK_COUNTRY = 'US'

// Vercel sets this header from the request's geo IP; absent in local dev.
const getCountryCode = (req: NextApiRequest): string => {
  const header = req.headers['x-vercel-ip-country']
  const country = Array.isArray(header) ? header[0] : header

  return country && /^[A-Za-z]{2}$/.test(country)
    ? country.toUpperCase()
    : FALLBACK_COUNTRY
}

export default getCountryCode
