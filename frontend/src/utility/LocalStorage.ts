/**
 * @file LocalStorage.ts
 * @module utility/LocalStorage
 * @description Exports the constants for the local storage keys.
 */

import { getOptions } from '@/app/i18n/settings'
import ClientProviders from '@/providers/ClientProviders'
import { CookieConsent } from '@/utility/CookieManager'

/**
 * @name LOCAL_STORAGE_LANGUAGE
 * @description The key for the language in the local storage, stored as a string
 * @property {string} en - The English language
 * @property {string} sv - The Swedish language
 * @see {@link getOptions}
 */
export const LOCAL_STORAGE_LANGUAGE = 'language'

/**
 * @name LOCAL_STORAGE_THEME
 * @description The key for the theme in the local storage, stored as a string
 * @property {string} light - The light theme
 * @property {string} dark  - The dark theme
 * @see {@link ClientProviders}
 */
export const LOCAL_STORAGE_THEME = 'theme'

/**
 * @name LOCAL_STORAGE_COOKIE_CONSENT
 * @description The key for the cookie consent in the local storage, stored as a JSON object
 * @property {CookieConsent} NECESSARY   - Cookies that are necessary for the website to function
 * @property {CookieConsent} FUNCTIONAL  - Cookies that are used to provide additional functionality
 * @property {CookieConsent} ANALYTICS   - Cookies that collect information about how the website is used
 * @property {CookieConsent} PERFORMANCE - Cookies that improve the performance of the website
 * @property {CookieConsent} ADVERTISING - Cookies that are used to deliver personalized advertisements
 * @property {CookieConsent} THIRD_PARTY - Cookies that are used by third-party services
 * @see {@link CookieConsent}
 */
export const LOCAL_STORAGE_COOKIE_CONSENT = 'cookieSettings'

