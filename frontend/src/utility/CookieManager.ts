
/**
 * @name CookieConsent
 * @description The different categories of cookies that can be consented to
 * @property {string} NECESSARY - Required cookies for the website to function
 * @property {string} FUNCTIONAL - Cookies that enhance the functionality of the website
 * @property {string} ANALYTICS - Cookies that collect information about how the website is used
 * @property {string} PERFORMANCE - Cookies that improve the performance of the website
 * @property {string} ADVERTISING - Cookies that are used to deliver personalized advertisements
 */
export const CookieConsent = {
  NECESSARY: 'NECESSARY',
  FUNCTIONAL: 'FUNCTIONAL',
  ANALYTICS: 'ANALYTICS',
  PERFORMANCE: 'PERFORMANCE',
  ADVERTISING: 'ADVERTISING',
  THIRD_PARTY: 'THIRD_PARTY',
} as const;

/**
 * @name DEFAULT_COOKIE_SETTINGS
 * @description The default cookie settings, where only necessary cookies are allowed
 */
export const DEFAULT_COOKIE_SETTINGS: CookieSettings = {
  NECESSARY: true,
  FUNCTIONAL: false,
  ANALYTICS: false,
  PERFORMANCE: false,
  ADVERTISING: false,
  THIRD_PARTY: false,
} as const;

export type CookieConsent = typeof CookieConsent[keyof typeof CookieConsent];

/**
 * @interface CookieSettings
 * @description An interface of the different cookie settings
 * @see {@link CookieConsent}
 */
export interface CookieSettings {
  NECESSARY: boolean;
  FUNCTIONAL: boolean;
  ANALYTICS: boolean;
  PERFORMANCE: boolean;
  ADVERTISING: boolean;
  THIRD_PARTY: boolean;
}

/**
 * @name decodeCookieSettings
 * @description Decodes the cookie settings from a JSON string to a CookieSettings object
 * 
 * @param {string} cookieSettings - The cookie settings as a JSON string
 * @returns {CookieSettings} The cookie settings as an object
 */
export function decodeCookieSettings(cookieSettings: string | undefined): CookieSettings {
  if (!cookieSettings) {
    return DEFAULT_COOKIE_SETTINGS
  }

  const settings: {
    NECESSARY: boolean;
    FUNCTIONAL: boolean;
    ANALYTICS: boolean;
    PERFORMANCE: boolean;
    ADVERTISING: boolean;
    THIRD_PARTY: boolean;
  } = JSON.parse(cookieSettings)
  return {
    NECESSARY: settings.NECESSARY,
    FUNCTIONAL: settings.FUNCTIONAL,
    ANALYTICS: settings.ANALYTICS,
    PERFORMANCE: settings.PERFORMANCE,
    ADVERTISING: settings.ADVERTISING,
    THIRD_PARTY: settings.THIRD_PARTY,
  }
}

/**
 * @name isCookieCategoryAllowed
 * @description Checks if a specific cookie category is allowed based on the cookie settings
 * 
 * @param {CookieSettings | string} cookieSettings - The cookie settings as an object or a JSON string
 * @param {CookieConsent} category - The category of the cookie to check
 * @returns {boolean} Whether the cookie category is allowed or not
 */
export function isCookieCategoryAllowed(cookieSettings: CookieSettings | string, category: CookieConsent): boolean {
  if (typeof cookieSettings === 'string') {
    cookieSettings = decodeCookieSettings(cookieSettings);
  }

  switch(category) {
    case CookieConsent.NECESSARY:
      // Necessary cookies are always allowed
      return true;
    case CookieConsent.FUNCTIONAL:
      return cookieSettings.FUNCTIONAL;
    case CookieConsent.ANALYTICS:
      return cookieSettings.ANALYTICS;
    case CookieConsent.PERFORMANCE:
      return cookieSettings.PERFORMANCE;
    case CookieConsent.ADVERTISING:
      return cookieSettings.ADVERTISING;
    default:
      return false;  
  }
}