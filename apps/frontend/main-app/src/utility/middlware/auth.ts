import { mergeResponses } from '@/utility/middlware/util'
import { type NextRequest, NextResponse } from 'next/server'

const PROTECTED_URLS_REGEX = new RegExp(['/profile', '/account.*'].join('|'))

/**
 * @name handleAuth
 * @description Handles authentication for protected URLs. If the user is not authenticated and tries to access a protected URL, they are redirected to the home page.
 * @param {NextRequest} request - The incoming request object.
 * @param {NextResponse} response - The response object to be modified.
 * @returns {Promise<NextResponse>} - The modified response object with updated cookies.
 */
export async function handleAuth(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const matchesProtectedUrls = PROTECTED_URLS_REGEX.test(
    request.nextUrl.pathname
  )
  const isAuthenticated = request.cookies.has('access_token_cookie')

  if (matchesProtectedUrls && !isAuthenticated) {
    const newResponse = NextResponse.redirect(new URL('/', request.url))

    const modifiedResponse = mergeResponses(response, newResponse)

    return modifiedResponse
  }

  return response
}
