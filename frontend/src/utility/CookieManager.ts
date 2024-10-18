import { RequestCookie, RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';

export const CookieConsent = {
  NECESSARY: 'NECESSARY',
  FUNCTIONAL: 'FUNCTIONAL',
  ANALYTICS: 'ANALYTICS',
  PERFORMANCE: 'PERFORMANCE',
  ADVERTISING: 'ADVERTISING',
} as const;

export type CookieConsent = typeof CookieConsent[keyof typeof CookieConsent];

export const COOKIE_CONSENT_STORAGE_KEY = 'cookieSettings';

interface CookieSettings {
  NECESSARY: boolean;
  FUNCTIONAL: boolean;
  ANALYTICS: boolean;
  PERFORMANCE: boolean;
  ADVERTISING: boolean;
}

function isCategoryAllowed(cookieSettings: CookieSettings, category: CookieConsent): boolean {
  switch(category) {
    case CookieConsent.NECESSARY:
      return cookieSettings.NECESSARY;
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

interface CookieConsentProvider {
  /**
   * Retrieves the current cookie consent settings
   */
  retrieveCookieSettings(): CookieSettings | undefined;

  /**
   * Updates the current cookie consent settings
   * @param cookieSettings The new cookie settings
   */
  updateCookieSettings(cookieSettings: CookieSettings): void;

  /**
   * Sanitizes the given cookie settings
   * @param cookieSettings The cookie settings to sanitize
   */
  sanitizeCookieSettings(cookieSettings: CookieSettings): CookieSettings;

  /**
   * Retrieves the default cookie settings
   */
  getDefaultSettings(): CookieSettings;

  /**
   * Checks if the given category is allowed
   * @param category The category to check
   */
  isCategoryAllowed(category: CookieConsent): boolean;
}

export class ClientCookieConsent implements CookieConsentProvider {
  private window: Window | undefined;

  constructor(window: Window | undefined) {
    this.window = window;
  }

  public retrieveCookieSettings(): CookieSettings | undefined {
    if(!this.window) return this.getDefaultSettings();
    let cookieSettings: string | null = this.window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);


    if(cookieSettings) {
      const settings = JSON.parse(cookieSettings);

      return this.sanitizeCookieSettings(settings);
    }
    return undefined;
  }

  public updateCookieSettings(cookieSettings: CookieSettings): void {
    if(!this.window) {
      throw new Error('No window object available! Cannot update cookie settings!');
    }
    this.window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(cookieSettings));
  }

  public sanitizeCookieSettings(cookieSettings: CookieSettings): CookieSettings {
    return {...this.getDefaultSettings(), ...cookieSettings};
  }

  public getDefaultSettings(): CookieSettings {
    return {
      NECESSARY: true,
      FUNCTIONAL: false,
      ANALYTICS: false,
      PERFORMANCE: false,
      ADVERTISING: false,
    };
  }

  public isCategoryAllowed(category: CookieConsent): boolean {
    const cookieSettings = this.retrieveCookieSettings() || this.getDefaultSettings();
    return isCategoryAllowed(cookieSettings, category);
  }
}

export class ServerCookieConsent implements CookieConsentProvider {
  private request: NextRequest;
  private _response: NextResponse | undefined = undefined;

  constructor(request: NextRequest) {
    this.request = request;
  }


  public retrieveCookieSettings(): CookieSettings | undefined {
    const cookies: RequestCookies = this.request.cookies;
    const cookieSettings: RequestCookie | undefined = cookies.get(COOKIE_CONSENT_STORAGE_KEY);
    if(cookieSettings) {
      const settings = JSON.parse(cookieSettings.value)
      return this.sanitizeCookieSettings(settings);
    }
    return undefined;
  }

  public updateCookieSettings(cookieSettings: CookieSettings): void {
    this.response.cookies.set(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(cookieSettings));
  }

  public sanitizeCookieSettings(cookieSettings: CookieSettings): CookieSettings {
    return {...this.getDefaultSettings(), ...cookieSettings};
  }

  public getDefaultSettings(): CookieSettings {
    return {
      NECESSARY: true,
      FUNCTIONAL: false,
      ANALYTICS: false,
      PERFORMANCE: false,
      ADVERTISING: false,
    }
  }

  public isCategoryAllowed(category: CookieConsent): boolean {
    const cookieSettings = this.retrieveCookieSettings() || this.getDefaultSettings();
    return isCategoryAllowed(cookieSettings, category);
  }

  public set response(response: NextResponse) {
    this._response = response;
  }

  public get response(): NextResponse {
    if(!this._response) {
      throw new Error('No response object available! Cannot update cookie settings!');
    }
    return this._response;
  }

}