import {
  COOKIE_SETTINGS,
  COOKIE_VERSION_NAME,
  COOKIE_VERSION_VALUE,
} from '@medieteknik/constants'
import type { NextRequest, NextResponse } from 'next/server'

/**
 * @name handleCookieUpdates
 * @description Handles cookie updates for the application. It checks if the incoming cookie is present and if the cookie version is up to date. If the cookie version is not up to date, it updates the cookie and sets a new cookie version.
 * @param {NextRequest} request - The incoming request object.
 * @param {NextResponse} response - The response object to be modified.
 * @returns The modified response object with updated cookies.
 */
export function handleCookieUpdates(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const cookieVersion = request.cookies.get(COOKIE_VERSION_NAME)

  if (cookieVersion && cookieVersion.value === COOKIE_VERSION_VALUE) {
    return response
  }

  const relevantCookies = Object.entries(COOKIE_SETTINGS).filter(
    ([cookieName]) => request.cookies.has(cookieName)
  )

  // If already on the correct language path, update the cookie version without redirecting to prevent constant redirects.
  for (const [cookieName, expectedOptions] of relevantCookies) {
    // Check if the cookie is already set
    if (request.cookies.has(cookieName)) {
      const cookie = request.cookies.get(cookieName)
      if (cookie && COOKIE_SETTINGS[cookieName]) {
        response.cookies.set(cookieName, cookie.value, expectedOptions)
      }
    }
  }

  // Set the cookie version to the latest version
  // This is to ensure that the cookie version is always up to date.
  response.cookies.set(
    COOKIE_VERSION_NAME,
    COOKIE_VERSION_VALUE,
    COOKIE_SETTINGS[COOKIE_VERSION_NAME]
  )

  return response
}
