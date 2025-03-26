import { SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { handleAuth } from '@/utility/middlware/auth'
import { handleCookieUpdates } from '@/utility/middlware/cookie'
import { setResponseHeaders } from '@/utility/middlware/headers'
import { handleLanguage } from '@/utility/middlware/language'
import acceptLanguage from 'accept-language'
import type { NextRequest, NextResponse } from 'next/server'

acceptLanguage.languages(SUPPORTED_LANGUAGES)

export const config = {
  matcher: [
    {
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      has: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
    },
  ],
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  let response = await handleLanguage(request)
  response = await setResponseHeaders(response) // Add request if needed
  response = await handleCookieUpdates(request, response)
  response = await handleAuth(request, response)

  return response
}
