import {
  FALLBACK_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  SUPPORTED_LANGUAGES,
} from '@/utility/Constants'
import acceptLanguage from 'accept-language'
import { NextURL } from 'next/dist/server/web/next-url'
import { type NextRequest, NextResponse } from 'next/server'
import type { LanguageCode } from './models/Language'

acceptLanguage.languages(SUPPORTED_LANGUAGES)

const isDevelopment = process.env.NODE_ENV === 'development'

export const Config = {
  matcher: ['/:language*'],
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
    '^/web-app-manifest-192x192\\.png',
    '^/web-app-manifest-512x512\\.png',
    '^/screenshots',
    '^/apple-icon\\.png',
    '^/react_devtools_backend_compact\\.js\\.map',
    '^/installHook\\.js\\.map',
    '^/ads\\.txt',
    '^/__nextjs_original-stack-frame',
  ].join('|')
)

/**
 * Handles the language redirection and cookie setting based on the request headers and cookies.
 *
 * @param {NextRequest} request - The request object containing headers.
 * @return {NextResponse} The response object with redirection or next response.
 */
async function handleLanguage(
  request: NextRequest
): Promise<NextResponse | string | undefined> {
  // Blacklisted URLs, which should not be redirected
  const isBlacklisted = BLACKLISTED_URLS_REGEX.test(request.nextUrl.pathname)

  if (isBlacklisted) {
    return undefined
  }

  let response: NextResponse = new NextResponse()

  function getCookieLanguage(): LanguageCode | undefined {
    const languageCookie = request.cookies.get('language')
    if (languageCookie) {
      return languageCookie.value as LanguageCode
    }
    return undefined
  }

  function getBrowserLanguage(): LanguageCode | undefined {
    const acceptLanguage = request.headers.get('Accept-Language')
    if (acceptLanguage) {
      const [languageCode] = acceptLanguage.split(',')[0].split('-')
      if (SUPPORTED_LANGUAGES.includes(languageCode as LanguageCode)) {
        return languageCode as LanguageCode
      }
    }
    return undefined
  }

  function getRefererLanguage(): LanguageCode | undefined {
    const referer = request.headers.get('Referer')
    if (referer) {
      const url = new NextURL(referer)
      const language = SUPPORTED_LANGUAGES.find((locale) =>
        url.pathname.startsWith(`/${locale}`)
      )
      return language || undefined
    }
    return undefined
  }

  const language =
    getCookieLanguage() ?? // Cookie language, taken from when a user has visited the site before and has a cookie set.
    getBrowserLanguage() ?? // Browser language, taken from when a user navigates to the site from a search engine or similar.
    getRefererLanguage() ?? // Referer language, taken from when a user navigates to the site from another page.
    FALLBACK_LANGUAGE // Fallback language, used when no other language is found.

  // Non-specified language or language not supported
  if (
    !SUPPORTED_LANGUAGES.some((locale) =>
      request.nextUrl.pathname.startsWith(`/${locale}`)
    )
  ) {
    if (isDevelopment) {
      console.warn(
        `Redirecting to /${language}. Original path: ${request.nextUrl.pathname}`
      )
    }

    response = NextResponse.redirect(
      new NextURL(
        `/${language}${request.nextUrl.pathname.replace(/^\/[^/]+/, '') || '/'}`,
        request.nextUrl
      )
    )

    response.cookies.set(LANGUAGE_COOKIE_NAME, language, {
      path: '/',
      sameSite: 'lax',
      expires: new Date(Date.now() + 31_536_000_000),
      secure: !isDevelopment,
    })
    return response
  }

  return language
}

function generateCSP(nonce: string): string {
  return `default-src 'none'; 
    script-src 'self' https://vercel.live 'nonce-${nonce}';
    connect-src 'self' ${process.env.NODE_ENV === 'development' ? 'localhost:80 http://localhost:*' : 'https://api.medieteknik.com'} https://vercel.live wss://ws-us3.pusher.com blob:; 
    media-src blob:; 
    img-src 'self' https://storage.googleapis.com https://vercel.live https://vercel.com https://i.ytimg.com data: blob:; 
    style-src 'self' https://vercel.live 'unsafe-inline'; 
    font-src 'self' https://vercel.live https://assets.vercel.com; 
    frame-src 'self' https://www.youtube.com/ https://www.instagram.com https://vercel.live; 
    object-src 'none'; 
    base-uri 'none'; 
    form-action 'self'; 
    frame-ancestors 'none'; 
    manifest-src 'self'; 
    worker-src 'self'; 
    script-src-elem 'self' https://vercel.live https://va.vercel-scripts.com 'nonce-${nonce}';`.replace(
    /\s+/g,
    ' '
  )
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const languageResponse = await handleLanguage(request)
  const nonce = crypto.randomUUID()
  const csp = generateCSP(nonce)
  const headers = new Headers(request.headers)
  headers.set('Content-Security-Policy', csp)
  headers.set('x-nonce', nonce)
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  const response = NextResponse.next({ headers })

  if (languageResponse instanceof NextResponse) {
    languageResponse.headers.set('Content-Security-Policy', csp)
    languageResponse.headers.set('x-nonce', nonce)
    if (process.env.NODE_ENV === 'production') {
      languageResponse.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      )
    }
    return languageResponse
  }

  if (typeof languageResponse === 'string') {
    response.cookies.set(LANGUAGE_COOKIE_NAME, languageResponse, {
      path: '/',
      sameSite: 'lax',
      expires: new Date(Date.now() + 31_536_000_000),
    })
  }

  return response
}
