import { SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { handleAuth } from '@/utility/middlware/auth'
import { setResponseHeaders } from '@/utility/middlware/headers'
import { mergeResponses } from '@/utility/middlware/util'
import { handleCookieUpdates, handleLanguage } from '@medieteknik/middleware'
import acceptLanguage from 'accept-language'
import { type NextRequest, NextResponse } from 'next/server'

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

const BLACKLISTED_URLS_REGEX = new RegExp(
  [
    '^/_next',
    '^/_vercel',
    '^/\\.well-known',
    '^/static',
    '^/robots\\.txt',
    '^/sitemap\\.xml',
    '^/manifest\\.webmanifest',
    '^/favicon',
    '^/icon',
    '^/service-worker\\.js',
    '^/web-app-manifest-192x192\\.png',
    '^/web-app-manifest-192x192-maskable\\.png',
    '^/web-app-manifest-512x512\\.png',
    '/screenshots.*',
    '/apple-icon\\.png',
    '/react_devtools_backend_compact\\.js\\.map',
    '/installHook\\.js\\.map',
    '/ads\\.txt',
    '/__nextjs_original-stack-frame.*',
    '/discord',
  ].join('|')
)

export async function middleware(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next()
  response = await handleAuth(request, response)
  response = handleLanguage(
    request,
    response,
    BLACKLISTED_URLS_REGEX,
    mergeResponses
  )
  response = setResponseHeaders(response)
  response = handleCookieUpdates(request, response)

  return response
}
