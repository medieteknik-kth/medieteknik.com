import { type NextRequest, NextResponse } from 'next/server'

const PROTECTED_URLS_REGEX = new RegExp(
  ['/upload.*', '/account.*', '/admin.*', '/expense.*', '/invoice.*'].join('|')
)

/**
 * @name handleAuth
 * @description Middleware to handle authentication and authorization for protected routes.
 * It checks if the user has the necessary permissions to access the requested resource.
 * Should be used **first** in the middleware stack.
 * @param {NextRequest} request - The incoming request object.
 * @returns A promise that resolves to a NextResponse object.
 */
export async function handleAuth(request: NextRequest): Promise<NextResponse> {
  const matchesProtectedUrls = PROTECTED_URLS_REGEX.test(
    request.nextUrl.pathname
  )

  if (!matchesProtectedUrls) {
    return NextResponse.next()
  }

  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.API_URL

  const accessCookie = request.cookies.get('access_token_cookie')

  if (!accessCookie) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('return_url', request.nextUrl.pathname)

    return NextResponse.redirect(redirectUrl)
  }

  const sessionCookie = request.cookies.get('session')
  if (!sessionCookie) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('return_url', request.nextUrl.pathname)

    return NextResponse.redirect(redirectUrl)
  }

  const response = await fetch(`${baseUrl}/rgbank/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
      'Content-Type': 'application/json',
      Cookie: `${accessCookie.name}=${accessCookie.value}; ${sessionCookie.name}=${sessionCookie.value}`,
    },
    body: JSON.stringify({
      path: request.nextUrl.pathname,
      method: request.method,
    }),
  })

  if (response.status === 404) {
    return NextResponse.next()
  }

  if (!response.ok) {
    console.log('Response from permissions check:', await response.json())
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('return_url', request.nextUrl.pathname)

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}
