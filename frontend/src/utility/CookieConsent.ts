import { NextRequest } from 'next/server';

export const CookieConsent = {
  ALLOWED: 'ALLOWED',
  NECESSARY: 'NECESSARY',
  NONE: 'NONE',
} as const;

export type CookieConsent = typeof CookieConsent[keyof typeof CookieConsent];

export const COOKIE_CONSENT_STORAGE_KEY = 'cookiePermission';

/**
 * Compares two cookie consents and checks if the inital consent is at least the comparator consent
 * @param initalConsent The first consent to check
 * @param comparatorConsent The consent to check against
 * @returns {boolean} True if the inital consent is at least the comparator consent
 */
function compareConsentHierarchy(initalConsent: CookieConsent, comparatorConsent: CookieConsent): boolean {
  const consentHierarchy = {
    
    [CookieConsent.NONE]: 0,
    [CookieConsent.NECESSARY]: 1,
    [CookieConsent.ALLOWED]: 2,
  }
  return consentHierarchy[initalConsent] >= consentHierarchy[comparatorConsent]; 
}

interface CookieConsentProvider {
  /**
   * Retrieves the current cookie consent status
   */
  retrieveCookieConsentStatus(): CookieConsent;
  /**
   * Updates the current cookie consent status
   * @param cookiePermission The new cookie permission
   */
  updateCookieConsentStatus(cookiePermission: CookieConsent): void;
  /**
   * Checks if the current cookie consent is at least the given consent
   * @param cookieConsent The consent to check against
   * @param customHierarchy A custom hierarchy to use for the check
   */
  isConsentLevelSufficient(cookieConsent: CookieConsent): boolean;
}

export class ClientCookieConsent implements CookieConsentProvider {
  private window: Window | undefined;

  constructor(window: Window | undefined) {
    this.window = window;
  }

  /**
   * Retrieves the current cookie consent status from local- or session storage
   * @returns The current cookie consent status
   */
  public retrieveCookieConsentStatus(): CookieConsent {
    if(!this.window) return CookieConsent.NONE;
    let cookieConsent: string | null = null;

    // Try local storage first
    try {
      cookieConsent = this.window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    } catch (error) {
      console.error('Error accessing local storage!');
    }

    // If no local storage is available, try session storage
    if(!cookieConsent) {
      try {
        cookieConsent = this.window.sessionStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      } catch (error) {
        console.error('Error accessing session storage!');
      }
    }

    if(cookieConsent && Object.values(CookieConsent).includes(cookieConsent as CookieConsent)) {
      return cookieConsent as CookieConsent;
    }

    return CookieConsent.NONE;
  }

  /**
   * Updates the current cookie consent status in both local- and session storage
   * @param cookiePermission The new cookie permission
   * @returns {void}
   */
  public updateCookieConsentStatus(cookiePermission: CookieConsent): void {
    if(cookiePermission === CookieConsent.NONE) { return; }
    if(!this.window) throw new Error('Unable to store cookie consent without window object');

    this.window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, cookiePermission);
    this.window.sessionStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, cookiePermission);
  }

  public isConsentLevelSufficient(cookieConsent: CookieConsent): boolean {
    return compareConsentHierarchy(this.retrieveCookieConsentStatus(), cookieConsent);
  }
}

export class ServerCookieConsent implements CookieConsentProvider {
  private request: NextRequest;
  // private response: NextResponse; <- not needed for now

  constructor(request: NextRequest) {
    this.request = request;1
  }

  /**
   * Retrieves the current cookie consent status from the request cookies
   * @returns The current cookie consent status
   */
  public retrieveCookieConsentStatus(): CookieConsent {
    const cookies = this.request.cookies;
    const currentConsentLevel = cookies.get(COOKIE_CONSENT_STORAGE_KEY);
  
    if(!currentConsentLevel) return CookieConsent.NONE;
    return currentConsentLevel.value as CookieConsent;
  }

  /**
   * Updates the current cookie consent status in the request cookies
   * @param cookiePermission The new cookie permission
   */
  public updateCookieConsentStatus(cookiePermission: CookieConsent): void {
    this.request.cookies.set(COOKIE_CONSENT_STORAGE_KEY, cookiePermission);
  }

  public isConsentLevelSufficient(cookieConsent: CookieConsent) {
    return compareConsentHierarchy(this.retrieveCookieConsentStatus(), cookieConsent);
  }
}
