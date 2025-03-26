import { COOKIE_SETTINGS } from '@/utility/Constants'
import type { NextResponse } from 'next/server'

/**
 * @name mergeResponses
 * @description Merges the cookies and headers from the old response into the new response.
 * This is useful for preserving cookies and headers when redirecting or modifying responses.
 * @param {NextResponse} oldResponse - The original response object.
 * @param {NextResponse} newResponse - The new response object to merge into.
 * @returns {NextResponse} - The new response object with merged cookies and headers.
 */
export function mergeResponses(
  oldResponse: NextResponse,
  newResponse: NextResponse
): NextResponse {
  // Merge cookies from newResponse into response
  for (const cookie of oldResponse.cookies.getAll()) {
    if (newResponse.cookies.has(cookie.name)) {
      // If the cookie already exists in newResponse, skip it
      continue
    }
    const options = COOKIE_SETTINGS[cookie.name] ?? {}
    newResponse.cookies.set(cookie.name, cookie.value, options)
  }

  // Merge headers from newResponse into response
  oldResponse.headers.forEach((value, key) => {
    newResponse.headers.set(key, value)
  })

  return newResponse
}
