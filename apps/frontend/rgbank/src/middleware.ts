import { SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { handleAuth } from '@/utility/middleware/authorization'
import { handleCookieUpdates } from '@/utility/middleware/cookie'
import { setResponseHeaders } from '@/utility/middleware/headers'
import { handleLanguage } from '@/utility/middleware/language'
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
  let response = await handleAuth(request)
  response = handleLanguage(request, response)
  response = setResponseHeaders(response)
  response = handleCookieUpdates(request, response)

  return response
}
