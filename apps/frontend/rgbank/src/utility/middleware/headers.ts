import { generateCSP } from '@/utility/middleware/csp'
import type { NextResponse } from 'next/server'

/**
 * @name setResponseHeaders
 * @description Sets the response headers for the application.
 *   * `Content-Security-Policy` header with a nonce,
 *   * `x-nonce` header,
 *   * `Strict-Transport-Security` header if in production.
 * @param {NextResponse} response - The response object to be modified.
 * @returns The modified response object with updated headers.
 */
export function setResponseHeaders(response: NextResponse): NextResponse {
  const nonce = crypto.randomUUID()

  response.headers.set('Content-Security-Policy', generateCSP(nonce))
  response.headers.set('x-nonce', nonce)
  response.headers.set('X-Robots-Tag', 'noindex, nofollow') // This app shouldn't be indexed by search engines

  if (process.env.NODE_ENV === 'production') {
    // TODO: Roll out longer HSTS in the future, ca 1 week to 604800, then 3 months to 63072000
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=3600; includeSubDomains'
    )
  }

  return response
}
