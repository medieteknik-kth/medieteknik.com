import {
  COOKIE_SETTINGS,
  COOKIE_VERSION_NAME,
  COOKIE_VERSION_VALUE,
} from '@/utility/Constants'
import { mergeResponses } from '@/utility/middlware/util'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * @name handleCookieUpdates
 * @description Handles cookie updates for the application. It checks if the incoming cookie is present and if the cookie version is up to date. If the cookie version is not up to date, it updates the cookie and sets a new cookie version.
 * @param {NextRequest} request - The incoming request object.
 * @param {NextResponse} response - The response object to be modified.
 * @returns {Promise<NextResponse>} - The modified response object with updated cookies.
 */
export async function handleCookieUpdates(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const cookieVersion = request.cookies.get(COOKIE_VERSION_NAME)
  const cookieName = 'language'
  const incomingCookie = request.cookies.get(cookieName)
  const expectedOptions = COOKIE_SETTINGS[cookieName]

  if (incomingCookie) {
    if (cookieVersion && cookieVersion.value === COOKIE_VERSION_VALUE) {
      return response
    }

    const newResponse = NextResponse.redirect(
      new URL(`/${incomingCookie.value}`, request.url)
    )
    newResponse.cookies.set(cookieName, incomingCookie.value, expectedOptions)
    const modifiedResponse = mergeResponses(response, newResponse)
    modifiedResponse.cookies.set(
      COOKIE_VERSION_NAME,
      COOKIE_VERSION_VALUE,
      COOKIE_SETTINGS[COOKIE_VERSION_NAME]
    )
    return modifiedResponse
  }

  return response
}
