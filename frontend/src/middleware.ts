import acceptLanguage from 'accept-language';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';
import { fallbackLanguage, supportedLanguages } from './app/i18n/settings';
import { LanguageCode } from './models/Language';

acceptLanguage.languages(supportedLanguages);

const isDevelopment = process.env.NODE_ENV === 'development';

export const Config = {
  matcher: ['/:language*']
}

/**
 * Handles the language redirection and cookie setting based on the request headers and cookies.
 *
 * @param {NextRequest} request - The request object containing headers.
 * @param {Cookies} cookies - The cookies present in the request.
 * @param {ServerCookieConsent} serverConsent - The server cookie consent object.
 * @return {NextResponse} The response object with redirection or next response.
 */
async function handleLanguage(request: NextRequest, cookies: RequestCookies): Promise<NextResponse> {
  let language;

  // Blacklisted URLs, which should not be redirected
  const blacklistedURLs = ['/_next', '/_vercel', '/static', '/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/favicon', '/screenshots', '/apple-icon.png', '/react_devtools_backend_compact.js.map', '/installHook.js.map', '/ads.txt', '/__nextjs']

  language = null
  
  // Check client side language
  if(!language && typeof window !== 'undefined') { language = localStorage.getItem('language') }

  // Check the browsers language
  if(!language) { 
    language = request.headers.get('Accept-Language')?.split(',')[0].split('-')[0]
    if (language && !supportedLanguages.includes(language as LanguageCode)) {
      language = null
    }
  }

  // If no language is found, use the fallback language
  if(!language) { language = fallbackLanguage }

  // Non-specified language or language not supported
  if(!supportedLanguages.some((locale) => request.nextUrl.pathname.startsWith(`/${locale}`)) 
      && !blacklistedURLs.some((url) => request.nextUrl.pathname.startsWith(url))) {
    if (isDevelopment) {
      console.log(`Redirecting to ${language}${request.nextUrl.pathname}`)
    }
    
    const response = NextResponse.redirect(new NextURL(`/${language}${request.nextUrl.pathname}`, request.nextUrl))
    
    /**
     * if(serverConsent.isCategoryAllowed(CookieConsent.)) {
      response.cookies.set(cookieName, language as string, { path: '/' })
    }
     */

    return response;
  }
  
  // Specified language
  if(request.headers.has('Referer')) {
    const refererUrl = new URL(request.headers.get('Referer') as string)
    const language = supportedLanguages.find((locale) => refererUrl.pathname.startsWith(`/${locale}`))
    const response = NextResponse.next()

    if(language) {
      //localStorage.setItem('language', language)
    }
    return response;
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const cookieStore = request.cookies

  let response = handleLanguage(request, cookieStore);
  // response = handleAnalytics(request, cookies, serverConsent);
  

  return response;
}
