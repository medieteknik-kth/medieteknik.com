import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLanguage, supportedLanguages, cookieName } from './app/i18n/settings';
import { NextRequest } from 'next/server';
import { getCookies } from 'next-client-cookies/server';
import { Cookies } from 'next-client-cookies';
import { CookieConsent, ServerCookieConsent  } from './utility/CookieManager';

acceptLanguage.languages(supportedLanguages);

const isDevelopment = process.env.NODE_ENV === 'development';

export const Config = {
  matcher: ['/:language*']
}

function handleLanguage(request: NextRequest, cookies: Cookies, serverConsent: ServerCookieConsent): NextResponse {
  let language;
  const blacklistedURLs = ['/_next', '/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/favicon', '/screenshots', '/apple-icon.png']

  language = cookies.get(cookieName)
  if(!language && typeof window !== 'undefined') { language = localStorage.getItem('i18nextLng') }
  if(!language) { language = request.headers.get('Accept-Language')?.split(',')[0].split('-')[0] }
  if(!language) { language = fallbackLanguage }

  // Non-specified language or language not supported
  if(!supportedLanguages.some((locale) => request.nextUrl.pathname.startsWith(`/${locale}`)) && !blacklistedURLs.some((url) => request.nextUrl.pathname.startsWith(url))) {
    const response = NextResponse.redirect(new URL(`/${language}${request.nextUrl.pathname}`, request.nextUrl))
    if(serverConsent.isCategoryAllowed(CookieConsent.FUNCTIONAL)) {
      response.cookies.set(cookieName, language, { path: '/' })
    }

    return response;
  }
  
  // Specified language
  if(request.headers.has('Referer')) {
    const refererUrl = new URL(request.headers.get('Referer') as string)
    const language = supportedLanguages.find((locale) => refererUrl.pathname.startsWith(`/${locale}`))
    const response = NextResponse.next()
    if(language) {
      if(serverConsent.isCategoryAllowed(CookieConsent.FUNCTIONAL)) {
        response.cookies.set(cookieName, language, { path: '/' })
      }
    }
    return response;
  }

  return NextResponse.next();
}

/**
 * Handle analytics and performance tracking
 * @param request The request object
 * @param cookies The cookies present in the request 
 * @param serverConsent The server cookie consent object
 * @returns The next response object
 */
function handleAnalytics(request: NextRequest, cookies: Cookies, serverConsent: ServerCookieConsent): NextResponse {
  if(window === undefined) return NextResponse.next();

  if(serverConsent.isCategoryAllowed(CookieConsent.ANALYTICS)) {
    try {
      fetch('https://.../analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({

      })
    })
    } catch (error) {
      console.error(error)
    }
  }

  if(serverConsent.isCategoryAllowed(CookieConsent.PERFORMANCE)) {
    try {
      fetch('https://.../performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({

      })
    })
    } catch (error) {
      console.error(error)
    }
  }

  return NextResponse.next();
}

/**
 * Handles the Content Security Policy (CSP) for the request by setting appropriate headers.
 *
 * @param {NextRequest} request - The request object containing headers.
 * @return {NextResponse} The response object with updated headers.
 */
function handleCSP(request: NextRequest): NextResponse {
  const nonce = crypto.randomUUID();
  const scriptSrc = isDevelopment ? `'unsafe-eval' 'nonce-${nonce}'` : `'strict-dynamic' 'nonce-${nonce}'`;
  const styleSrc = isDevelopment ? `'unsafe-inline'` : `'nonce-${nonce}'`;
  const cspHeader = `
    default-src 'self';
    connect-src 'self' 'https://api.medieteknik.com' 'https://localhost:8000';
    script-src 'self' ${scriptSrc};
    style-src 'self' ${styleSrc};
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

  const contentSecurityPolicyHeaderValue = cspHeader
  .replace(/\s{2,}/g, ' ')
  .trim()

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  if (nonce) {
    response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
  }

  return response
}

export function middleware(request: NextRequest) {
  const cookies = getCookies();
  const serverConsent = new ServerCookieConsent(request);
  
  let response = handleCSP(request);
  response = handleLanguage(request, cookies, serverConsent);
  // response = handleAnalytics(request, cookies, serverConsent);
  

  return response;
}
