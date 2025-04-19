import type { LanguageCode } from '@/models/Language'
import {
  COOKIE_SETTINGS,
  FALLBACK_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  SUPPORTED_LANGUAGES,
} from '@/utility/Constants'
import { mergeResponses } from '@/utility/middleware/util'
import { NextURL } from 'next/dist/server/web/next-url'
import { type NextRequest, NextResponse } from 'next/server'

const isDevelopment = process.env.NODE_ENV === 'development'

const BLACKLISTED_URLS_REGEX = new RegExp(
  [
    '/vercel.*',
    '/_vercel.*',
    '/\\.well-known.*',
    '/static.*',
    '/manifest\\.webmanifest',
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
    '/discord',
  ].join('|')
)

/**
 * @name handleLanguage
 * @description Handles the language redirection and cookie setting based on the request headers and cookies.
 *
 * @param {NextRequest} request - The incoming request object.
 * @return The response object with the appropriate redirection or cookie setting.
 */
export function handleLanguage(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  // Blacklisted URLs, which should not be redirected
  const isBlacklisted = BLACKLISTED_URLS_REGEX.test(request.nextUrl.pathname)

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
    const options = COOKIE_SETTINGS[LANGUAGE_COOKIE_NAME] ?? {}
    response.cookies.set(LANGUAGE_COOKIE_NAME, language as string, options)
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
    const options = COOKIE_SETTINGS[LANGUAGE_COOKIE_NAME] ?? {}
    response.cookies.set(LANGUAGE_COOKIE_NAME, language, options)
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

    const redirectUrl = new NextURL(
      `/${language}${request.nextUrl.pathname}`,
      request.nextUrl
    )

    if (request.nextUrl.searchParams.size > 0) {
      request.nextUrl.searchParams.forEach((value, key) => {
        redirectUrl.searchParams.set(key, value)
      })
    }

    const newResponse = mergeResponses(
      response,
      NextResponse.redirect(redirectUrl)
    )

    return newResponse
  }

  return response
}
