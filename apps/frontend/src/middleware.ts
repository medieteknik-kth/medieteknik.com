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
  matcher: {
    source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
    missing: [
      { type: 'header', key: 'next-router-prefetch' },
      { type: 'header', key: 'purpose', value: 'prefetch' },
    ],
  },
}

const BLACKLISTED_URLS_REGEX = new RegExp(
  [
    '/_next.*',
    '/vercel.*',
    '/_vercel.*',
    '/\\.well-known.*',
    '/static.*',
    '/robots\\.txt',
    '/sitemap\\.xml',
    '/manifest\\.webmanifest',
    '/favicon.*',
    '/icon.*',
    '/service-worker\\.js',
    '/web-app-manifest-192x192\\.png',
    '/web-app-manifest-192x192-maskable\\.png',
    '/web-app-manifest-512x512\\.png',
    '/screenshots.*',
    '/apple-icon\\.png',
    '/react_devtools_backend_compact\\.js\\.map',
    '/installHook\\.js\\.map',
    '/ads\\.txt',
    '/__nextjs_original-stack-frame.*',
    '/api/.*',
  ].join('|')
)

/**
 * Handles the language redirection and cookie setting based on the request headers and cookies.
 *
 * @param {NextRequest} request - The incoming request object.
 * @return {Promise<NextResponse>} - The response object with the appropriate redirection or cookie setting.
 */
async function handleLanguage(request: NextRequest): Promise<NextResponse> {
  // Blacklisted URLs, which should not be redirected
  const isBlacklisted = BLACKLISTED_URLS_REGEX.test(request.nextUrl.pathname)
  let response: NextResponse = NextResponse.next()

  if (isBlacklisted) {
    return response
  }

  const isLanguageCookiePresent = request.cookies.has(LANGUAGE_COOKIE_NAME)

  /**
   * @name getPathLanguage
   * @description Gets the language from the path of the URL, e.g. /en or /sv.
   *
   * @returns {LanguageCode | undefined} - The language code if found, otherwise undefined.
   */
  function getPathLanguage(): LanguageCode | undefined {
    const path = request.nextUrl.pathname
    const [_, language] = path.split('/')
    if (SUPPORTED_LANGUAGES.includes(language as LanguageCode)) {
      return language as LanguageCode
    }
    return undefined
  }

  let language = getPathLanguage()

  if (language && !isLanguageCookiePresent) {
    // If the user has navigated to a page with a language in the path and has never visited the site before.
    response.cookies.set(LANGUAGE_COOKIE_NAME, language as string, {
      path: '/',
      sameSite: 'lax',
      expires: new Date(Date.now() + 31_536_000_000),
      secure: !isDevelopment,
    })
    return response
  }

  /**
   * @name getCookieLanguage
   * @description Gets the language from the cookie, if it exists.
   *
   * @returns {LanguageCode | undefined} - The language code if found, otherwise undefined.
   */
  function getCookieLanguage(): LanguageCode | undefined {
    const languageCookie = request.cookies.get('language')
    if (languageCookie) {
      return languageCookie.value as LanguageCode
    }
    return undefined
  }

  /**
   * @name getBrowserLanguage
   * @description Gets the language from the browser's Accept-Language header.
   *
   * @returns {LanguageCode | undefined} - The language code if found, otherwise undefined.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
   */
  function getBrowserLanguage(): LanguageCode | undefined {
    const acceptLanguage = request.headers.get('Accept-Language')
    if (acceptLanguage) {
      const languages = acceptLanguage
        .split(',')
        .map((lang) => {
          const [code, quality] = lang.split(';q=')
          return {
            code: code.split('-')[0].trim() as LanguageCode,
            quality: quality ? Number.parseFloat(quality) : 1,
          }
        })
        .sort((a, b) => b.quality - a.quality)

      for (const { code } of languages) {
        if (SUPPORTED_LANGUAGES.includes(code)) {
          return code as LanguageCode
        }
      }
    }
    return undefined
  }

  /**
   * @name getReferrerLanguage
   * @description Gets the language from the Referer header, if it exists.
   *
   * @returns {LanguageCode | undefined} - The language code if found, otherwise undefined.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin
   */
  function getReferrerLanguage(): LanguageCode | undefined {
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

  language =
    getCookieLanguage() ?? // Cookie language, taken from when a user has visited the site before and has a cookie set.
    getBrowserLanguage() ?? // Browser language, taken from when a user navigates to the site from a search engine or similar.
    getReferrerLanguage() ?? // Referer language, taken from when a user navigates to the site from another page.
    FALLBACK_LANGUAGE // Fallback language, used when no other language is found.

  if (language === getPathLanguage()) {
    // If the language in the path matches the detected language, do nothing.
    return response
  }

  if (isLanguageCookiePresent) {
    // If the cookie is already set, and the path is not the same as the detected language, replace the cookie.
    response.cookies.set(LANGUAGE_COOKIE_NAME, language, {
      path: '/',
      sameSite: 'lax',
      expires: new Date(Date.now() + 31_536_000_000),
      secure: !isDevelopment,
    })
  }

  // Non-specified language or language not supported
  if (
    !SUPPORTED_LANGUAGES.some((locale) =>
      request.nextUrl.pathname.startsWith(`/${locale}`)
    )
  ) {
    if (isDevelopment) {
      console.warn(
        `Redirecting to /${language}${request.nextUrl.pathname}. Original path: ${request.nextUrl.pathname}`
      )
    }

    response = NextResponse.redirect(
      new NextURL(`/${language}${request.nextUrl.pathname}`, request.nextUrl)
    )

    return response
  }

  return response
}

/**
 * @name generateCSP
 * @description Generates a Content Security Policy (CSP) string based on the provided nonce and environment.
 *
 * @param {string} nonce - The nonce to be used in the CSP.
 * @returns {string} - The generated CSP string.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 */
function generateCSP(nonce: string): string {
  return `default-src 'self'; 
    script-src 'self' 'nonce-${nonce}' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''};
    connect-src 'self' ${process.env.NODE_ENV === 'development' ? 'http://localhost:80 http://localhost:* ws://localhost:3000' : 'ws://medieteknik.com https://api.medieteknik.com'} https://vercel.live https://www.kth.se wss://ws-us3.pusher.com blob: https://storage.googleapis.com https://va.vercel-scripts.com;
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
  const response = await handleLanguage(request)
  const nonce = crypto.randomUUID()

  response.headers.set('Content-Security-Policy', generateCSP(nonce))
  response.headers.set('x-nonce', nonce)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Roll out longer HSTS in the future, ca 1 week to 604800, then 3 months to 63072000
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=3600; includeSubDomains'
    )
  }

  return response
}
